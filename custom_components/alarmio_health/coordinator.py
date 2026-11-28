"""Runs every probe each cycle, tracks incidents and sends the heartbeat."""

from __future__ import annotations

import asyncio
import logging
from collections.abc import Awaitable, Callable
from dataclasses import replace
from datetime import datetime
from typing import Any
from urllib.parse import urlparse

import httpx
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import __version__ as HA_VERSION
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import dt as dt_util
from homeassistant.util.ssl import client_context

from .const import (
    CONF_ANCHOR_ENABLED,
    CONF_ANCHOR_HOST,
    CONF_GATEWAY,
    CONF_SHARE_DIAGNOSTICS,
    DEFAULT_ANCHOR,
    DOMAIN,
    PROBES,
    SCAN_INTERVAL,
    VERSION,
)
from .echo import EchoRequest, EchoTracker
from .foxace_adapter import FoxaceAdapter
from .heartbeat import HeartbeatClient, build_payload
from .incidents import IncidentTracker
from .models import EchoResult, FoxaceSnapshot, NetSnapshot, ProbeResult, StageTimings, Status, Verdict
from .net.attribution import apply_verdict
from .net.blame import blame, gateway_filtered, internet_filtered
from .net.gateway import read_default_gateway
from .net.icmp import MODE_TCP, detect_icmp_mode
from .net.looplag import LoopLagSampler
from .net.probes import (
    NetHops,
    ajaxcloud_result,
    gateway_result,
    internet_result,
    measure_network,
    net_block,
    probe_ajax_direct,
)
from .probes.alarmio import probe_alarmio, probe_tls
from .probes.foxace import ReconnectCounter, probe_ajax, probe_foxace, probe_stream

_LOGGER = logging.getLogger(__name__)
SLOW_READINGS_TO_DEGRADE = 2
STALLS_TO_BLAME = 2  # consecutive cycles with an event-loop stall before Home Assistant itself is blamed
MEASURE_TIMEOUT_S = 10.0  # the hop measurement must never stall the cycle


class AlarmioHealthCoordinator(DataUpdateCoordinator[dict[str, ProbeResult]]):
    """Owns probe scheduling. A failing probe becomes a status, never an exception."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        http: httpx.AsyncClient,
        adapter: FoxaceAdapter,
        tracker: IncidentTracker,
        store: Store[dict[str, Any]],
        heartbeat: HeartbeatClient,
    ) -> None:
        """Wire the collaborators; nothing here does I/O."""
        super().__init__(hass, _LOGGER, config_entry=entry, name=DOMAIN, update_interval=SCAN_INTERVAL)
        self.http = http
        self.adapter = adapter
        self.tracker = tracker
        self.store = store
        self.heartbeat = heartbeat
        self.reconnects = ReconnectCounter()
        self.share_diagnostics: bool = bool(entry.options.get(CONF_SHARE_DIAGNOSTICS, False))
        self._warned: set[str] = set()
        self._slow_streak = 0
        self._ssl_context = client_context()  # HA's shared, preloaded, verifying context (no I/O per cycle)
        self.echo = EchoTracker()
        self.sampler = LoopLagSampler()
        self.net: NetSnapshot | None = None
        self.verdict: Verdict | None = None
        self._icmp_mode: str | None = None
        self._degraded_streaks: dict[str, int] = {}
        self._stall_streak = 0

    def _failed(self, step: str, err: Exception) -> None:
        """Warn once per distinct step failure, by exception class name only."""
        key = f"{step}:{type(err).__name__}"
        if key not in self._warned:
            self._warned.add(key)
            _LOGGER.warning("Alarmio Health step '%s' failed (%s); continuing", step, type(err).__name__)

    def _recovered(self, step: str) -> None:
        """Forget earlier failures of a step so a later one is warned about again."""
        self._warned = {k for k in self._warned if not k.startswith(f"{step}:")}

    def _debounce_slow(self, result: ProbeResult) -> ProbeResult:
        """Report Alarmio as degraded only after SLOW_READINGS_TO_DEGRADE slow readings in a row.

        The probe's only DEGRADED outcome is a slow answer. One slow reading (for example the first one after a
        restart, or a busy moment) is reported healthy, with its latency kept. Any other outcome, including DOWN,
        resets the count and is passed through untouched: an outage is never delayed here.
        """
        if result.probe != "alarmio" or result.status is not Status.DEGRADED:
            self._slow_streak = 0
            return result
        self._slow_streak += 1
        if self._slow_streak >= SLOW_READINGS_TO_DEGRADE:
            return result
        return replace(result, status=Status.HEALTHY, detail="")

    def _unknown(self, probe: str, now: datetime, detail: str) -> ProbeResult:
        """Conservative placeholder for a probe that produced no usable result."""
        return ProbeResult(probe, Status.UNKNOWN, now, detail=detail)

    async def _run(self, probe: str, now: datetime, call: Callable[[], Awaitable[ProbeResult]]) -> ProbeResult:
        """Call and await an async probe; any unexpected failure becomes an unknown result."""
        try:
            result = await call()
        except Exception as err:  # noqa: BLE001 - one probe must not fail the cycle
            self._failed(probe, err)
            return self._unknown(probe, now, f"The {probe} check failed unexpectedly ({type(err).__name__}).")
        self._recovered(probe)
        return result

    def _run_sync(
        self,
        probe: str,
        now: datetime,
        snapshot: FoxaceSnapshot | None,
        fn: Callable[[FoxaceSnapshot, datetime], ProbeResult],
    ) -> ProbeResult:
        """Run a snapshot probe; unknown if there is no snapshot or the probe fails."""
        if snapshot is None:
            return self._unknown(probe, now, "foXaCe state could not be read. Check the Home Assistant log.")
        try:
            result = fn(snapshot, now)
        except Exception as err:  # noqa: BLE001
            self._failed(probe, err)
            return self._unknown(probe, now, f"The {probe} check failed unexpectedly ({type(err).__name__}).")
        self._recovered(probe)
        return result

    async def _snapshot(self, now: datetime) -> FoxaceSnapshot | None:
        """Read foXaCe state; None if the adapter fails despite its never-raise contract."""
        try:
            snapshot = await self.adapter.snapshot(now)
        except Exception as err:  # noqa: BLE001
            self._failed("snapshot", err)
            return None
        self._recovered("snapshot")
        try:
            self.reconnects.observe(snapshot.sse_connected)
        except Exception as err:  # noqa: BLE001 - a counter failure must not discard a valid snapshot
            self._failed("reconnects", err)
        else:
            self._recovered("reconnects")
        return snapshot

    def _option(self, key: str, default: Any) -> Any:
        """A config-entry option, read fresh each cycle so the options flow needs no reload."""
        try:
            return self.config_entry.options.get(key, default)
        except Exception:  # noqa: BLE001
            return default

    def _debounce_degraded(self, result: ProbeResult) -> ProbeResult:
        """Report a degraded network probe only after two readings in a row; down and healthy pass straight through."""
        if result.status is not Status.DEGRADED:
            self._degraded_streaks[result.probe] = 0
            return result
        self._degraded_streaks[result.probe] = self._degraded_streaks.get(result.probe, 0) + 1
        if self._degraded_streaks[result.probe] >= SLOW_READINGS_TO_DEGRADE:
            return result
        return replace(result, status=Status.HEALTHY, detail="")

    async def _measure(self, proxy_url: str | None) -> tuple[NetHops, str]:
        """Measure the hops. Any failure is "no data", never an exception."""
        mode = MODE_TCP
        try:
            if self._icmp_mode is None:
                self._icmp_mode = await detect_icmp_mode()
            mode = self._icmp_mode
            gateway = str(self._option(CONF_GATEWAY, "") or "").strip() or await self.hass.async_add_executor_job(
                read_default_gateway
            )
            anchor = str(self._option(CONF_ANCHOR_HOST, DEFAULT_ANCHOR) or DEFAULT_ANCHOR).strip()
            if not self._option(CONF_ANCHOR_ENABLED, True):
                anchor = None
            vps = urlparse(proxy_url).hostname if proxy_url else None
            async with asyncio.timeout(MEASURE_TIMEOUT_S):
                hops = await measure_network(mode=mode, gateway=gateway, anchor=anchor, vps=vps)
        except Exception as err:  # noqa: BLE001
            self._failed("network", err)
            return NetHops(None, None, None), mode
        self._recovered("network")
        return hops, mode

    async def _direct_ajax(self) -> tuple[bool | None, float | None]:
        """Direct mode: one unauthenticated request to Ajax's API host."""
        try:
            ok, total_ms, _timings = await probe_ajax_direct(self.http)
        except Exception as err:  # noqa: BLE001
            self._failed("ajax_direct", err)
            return None, None
        self._recovered("ajax_direct")
        return ok, total_ms

    def _finish_echo(self, request: EchoRequest | None) -> EchoResult | None:
        """Heartbeat exchange to echo result: reply ok/slow, no reply lost, no echo in it unavailable."""
        if request is None:
            return None
        try:
            exchange = self.heartbeat.last_exchange
            if exchange is None:
                if not (self.heartbeat.current_attempted and self.adapter.session_token()):
                    return self.echo.unavailable(request)  # nothing was sent: not a loss
                lost = self.echo.complete(request, None, None, StageTimings())
                if self.heartbeat.queued > 0:
                    self.echo.mark_resent(request.id)  # the queued copy is resent next cycle: direction unknowable
                return lost
            reply_echo = exchange.reply.get("echo") if isinstance(exchange.reply, dict) else None
            if exchange.status != 200 or exchange.downgraded or not isinstance(reply_echo, dict):
                return self.echo.unavailable(request, exchange.timings)
            return self.echo.complete(request, reply_echo, exchange.elapsed_s, exchange.timings)
        except Exception as err:  # noqa: BLE001
            self._failed("echo", err)
            return None

    async def _send_heartbeat(
        self, results, snapshot, now, net: dict[str, Any] | None = None, echo: EchoRequest | None = None
    ) -> ProbeResult:
        """Build and send the heartbeat; returns the session probe result."""
        proxy_url = snapshot.proxy_url if snapshot else None
        try:
            payload = build_payload(
                results, version=VERSION, now=now, share_diagnostics=self.share_diagnostics,
                snapshot=snapshot, reconnects=self.reconnects.count, ha_version=HA_VERSION,
                net=net, echo=(echo.id, echo.seq) if echo else None,
            )
            result = await self.heartbeat.send(proxy_url, self.adapter.session_token(), payload, now)
        except Exception as err:  # noqa: BLE001
            self._failed("session", err)
            return self._unknown("session", now, f"Not reporting to Alarmio ({type(err).__name__}). Will retry.")
        self._recovered("session")
        return result

    async def _track(self, results: dict[str, ProbeResult], now: datetime) -> None:
        """Feed results to the incident tracker and persist when it changed; never raises."""
        changed = False
        observe_failed = False
        for result in results.values():
            try:
                if self.tracker.observe(result) is not None:
                    changed = True
            except Exception as err:  # noqa: BLE001
                observe_failed = True
                self._failed("tracker", err)
        if not observe_failed:
            self._recovered("tracker")
        try:
            self.tracker.prune(now)
        except Exception as err:  # noqa: BLE001
            self._failed("prune", err)
        else:
            self._recovered("prune")
        if not changed:
            return
        try:
            await self.store.async_save(self.tracker.to_dict())
        except Exception as err:  # noqa: BLE001 - a failed save must not hide probe results
            self._failed("save", err)
        else:
            self._recovered("save")

    async def _async_update_data(self) -> dict[str, ProbeResult]:
        """Run all probes with one shared timestamp and always return every probe key."""
        now = dt_util.utcnow()
        snapshot = await self._snapshot(now)
        proxy_url = snapshot.proxy_url if snapshot else None
        proxy_mode = proxy_url is not None
        measuring = asyncio.ensure_future(self._measure(proxy_url))
        try:
            results: dict[str, ProbeResult] = {
                "alarmio": self._debounce_slow(
                    await self._run("alarmio", now, lambda: probe_alarmio(self.http, proxy_url, lambda: now))
                ),
                "tls": await self._run(
                    "tls", now, lambda: probe_tls(proxy_url, lambda: now, ssl_context=self._ssl_context)
                ),
                "foxace": self._run_sync("foxace", now, snapshot, probe_foxace),
                "stream": self._run_sync("stream", now, snapshot, probe_stream),
                "ajax": self._run_sync("ajax", now, snapshot, probe_ajax),
            }
            hops, mode = await measuring
        finally:
            if not measuring.done():
                measuring.cancel()
        direct_ok, direct_ms = (None, None) if proxy_mode or snapshot is None else await self._direct_ajax()
        lag_ms = self.sampler.take_max_ms()
        echo_request: EchoRequest | None = None
        net_payload: dict[str, Any] | None = None
        try:
            echo_request = self.echo.begin() if proxy_mode else None
            net_payload = net_block(hops, lag_ms, mode)
        except Exception as err:  # noqa: BLE001
            self._failed("network", err)
            echo_request, net_payload = None, None
        results["session"] = await self._send_heartbeat(results, snapshot, now, net=net_payload, echo=echo_request)
        results, net, verdict = self._network_verdict(
            results, now, hops, mode, lag_ms, proxy_mode, echo_request, direct_ok, direct_ms
        )
        self.net, self.verdict = net, verdict
        await self._track(results, now)
        return {probe: results[probe] for probe in PROBES}

    def _network_verdict(
        self, results, now, hops, mode, lag_ms, proxy_mode, echo_request, direct_ok, direct_ms
    ) -> tuple[dict[str, ProbeResult], NetSnapshot | None, Verdict]:
        """Network probe results and the blame verdict; any failure is UNKNOWN, never healthy, never raised."""
        try:
            net = NetSnapshot(
                gateway=hops.gateway, internet=hops.internet, vps=hops.vps if proxy_mode else None,
                loop_lag_ms=lag_ms, icmp_mode=mode, proxy_mode=proxy_mode, echo=self._finish_echo(echo_request),
                ajax_direct_ok=direct_ok, ajax_direct_ms=direct_ms,
            )
            verdict = blame(net)
            if verdict.broken == "ha_host":
                self._stall_streak += 1
                if self._stall_streak < STALLS_TO_BLAME:
                    # One stalled minute is a blip (HA does this when integrations load or reload). Judge the hops as if
                    # the loop had been calm, so a real router or internet fault is still reported.
                    verdict = blame(replace(net, loop_lag_ms=None))
            else:
                self._stall_streak = 0
            out = dict(results)
            out["gateway"] = self._debounce_degraded(
                gateway_result(net.gateway, now, filtered=gateway_filtered(net))
            )
            out["internet"] = self._debounce_degraded(
                internet_result(
                    net.internet, now, enabled=bool(self._option(CONF_ANCHOR_ENABLED, True)),
                    filtered=internet_filtered(net),
                )
            )
            out["ajaxcloud"] = self._debounce_degraded(ajaxcloud_result(net, now))
            echo_state = net.echo.state if net.echo else "unavailable"
            out, verdict = apply_verdict(out, verdict, echo_state)
        except Exception as err:  # noqa: BLE001
            self._failed("network", err)
            detail = f"The network checks failed unexpectedly ({type(err).__name__})."
            out = dict(results)
            for name in ("gateway", "internet", "ajaxcloud"):
                out[name] = ProbeResult(name, Status.UNKNOWN, now, detail=detail)
            return out, None, Verdict(None, Status.UNKNOWN, "", {})
        self._recovered("network")
        return out, net, verdict

    async def diagnostics_preview(self) -> dict[str, Any] | None:
        """The diagnostics block the next heartbeat will contain (for transparency in the panel); never raises."""
        try:
            now = dt_util.utcnow()
            snapshot = await self.adapter.snapshot(now)
            payload = build_payload(
                self.data or {}, version=VERSION, now=now, share_diagnostics=True,
                snapshot=snapshot, reconnects=self.reconnects.count, ha_version=HA_VERSION,
            )
            preview = payload["diagnostics"]
        except Exception as err:  # noqa: BLE001
            self._failed("preview", err)
            return None
        self._recovered("preview")
        return preview

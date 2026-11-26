"""Runs every probe each cycle, tracks incidents and sends the heartbeat."""

from __future__ import annotations

import logging
from collections.abc import Awaitable, Callable
from dataclasses import replace
from datetime import datetime
from typing import Any

import httpx
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import __version__ as HA_VERSION
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import dt as dt_util
from homeassistant.util.ssl import client_context

from .const import CONF_SHARE_DIAGNOSTICS, DOMAIN, PROBES, SCAN_INTERVAL, VERSION
from .foxace_adapter import FoxaceAdapter
from .heartbeat import HeartbeatClient, build_payload
from .incidents import IncidentTracker
from .models import FoxaceSnapshot, ProbeResult, Status
from .probes.alarmio import probe_alarmio, probe_tls
from .probes.foxace import ReconnectCounter, probe_ajax, probe_foxace, probe_stream

_LOGGER = logging.getLogger(__name__)
SLOW_READINGS_TO_DEGRADE = 2


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

    async def _send_heartbeat(
        self, results: dict[str, ProbeResult], snapshot: FoxaceSnapshot | None, now: datetime
    ) -> ProbeResult:
        """Build and send the heartbeat; returns the session probe result."""
        proxy_url = snapshot.proxy_url if snapshot else None
        try:
            payload = build_payload(
                results, version=VERSION, now=now, share_diagnostics=self.share_diagnostics,
                snapshot=snapshot, reconnects=self.reconnects.count, ha_version=HA_VERSION,
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
        """Run all probes with one shared timestamp and always return all six keys."""
        now = dt_util.utcnow()
        snapshot = await self._snapshot(now)
        proxy_url = snapshot.proxy_url if snapshot else None
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
        results["session"] = await self._send_heartbeat(results, snapshot, now)
        await self._track(results, now)
        return {probe: results[probe] for probe in PROBES}

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

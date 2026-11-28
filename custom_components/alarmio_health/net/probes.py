"""Hop measurement orchestration, hop -> probe result, the direct-mode Ajax probe and the heartbeat `net` block."""

from __future__ import annotations

import asyncio
import time
from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from datetime import datetime
from typing import Any

import httpx

from ..models import HopStats, NetSnapshot, ProbeResult, StageTimings, Status
from .blame import DIRECT_AJAX_SLOW_MS, ajax_cloud_status, gateway_status, internet_status
from .icmp import MODE_TCP, ping_hop, tcp_hop
from .timing import StageRecorder

AJAX_DIRECT_URL = "https://api.ajax.systems/"


@dataclass(frozen=True, slots=True)
class NetHops:
    """The three measured hops; None = no data."""

    gateway: HopStats | None
    internet: HopStats | None
    vps: HopStats | None


async def measure_network(
    *,
    mode: str,
    gateway: str | None,
    anchor: str | None,
    vps: str | None,
    ping: Callable[..., Awaitable[Any]] | None = None,
    tcp_connect: Callable[[str, int], Awaitable[Any]] | None = None,
) -> NetHops:
    """Measure all configured hops in parallel; a failing hop is None, never an exception."""

    async def one(label: str, host: str | None, port: int) -> HopStats | None:
        if not host:
            return None
        if mode == MODE_TCP:
            return await tcp_hop(label, host, port, connect=tcp_connect)
        return await ping_hop(label, host, mode, ping=ping)

    results = await asyncio.gather(
        one("gateway", gateway, 80), one("internet", anchor, 443), one("vps", vps, 443), return_exceptions=True
    )
    gw, net, srv = (r if isinstance(r, HopStats) else None for r in results)
    return NetHops(gw, net, srv)


def _hop_detail(noun: str, hop: HopStats, status: Status) -> str:
    """Empty when healthy (the latency is in `latency_ms`), so the recorder is not rewritten every minute."""
    if status is Status.HEALTHY:
        return ""
    if hop.method == "tcp":
        timing = f" in {hop.rtt_median_ms:.0f} ms" if hop.rtt_median_ms is not None else ""
        if not hop.received:
            return f"{noun} did not answer."
        return f"{noun} answered{timing} (packet loss is not measured on this system)."
    timing = f", {hop.rtt_median_ms:.1f} ms" if hop.rtt_median_ms is not None else ""
    return f"{noun} answered {hop.received} of {hop.sent} pings{timing}."


def _filtered_result(name: str, now: datetime, noun: str, hop: HopStats) -> ProbeResult:
    """A hop that is silent while later hops answer: not measurable, not a fault."""
    what = "connections" if hop.method == "tcp" else "pings"
    return ProbeResult(name, Status.UNKNOWN, now, detail=f"{noun} does not answer {what}, so it cannot be measured.")


def gateway_result(hop: HopStats | None, now: datetime, filtered: bool = False) -> ProbeResult:
    """The `gateway` probe. `filtered`: the router is silent but later hops answered (it ignores pings)."""
    if hop is None:
        return ProbeResult(
            "gateway", Status.UNKNOWN, now, detail="Your router could not be measured (no gateway found)."
        )
    if filtered:
        return _filtered_result("gateway", now, "Your router", hop)
    status = gateway_status(hop)
    return ProbeResult("gateway", status, now, hop.rtt_median_ms, _hop_detail("Your router", hop, status))


def internet_result(
    hop: HopStats | None, now: datetime, enabled: bool = True, filtered: bool = False
) -> ProbeResult:
    """The `internet` probe. `filtered`: the anchor is silent but later hops answered (it ignores pings)."""
    if not enabled:
        return ProbeResult("internet", Status.UNKNOWN, now, detail="The internet check is turned off in the options.")
    if hop is None:
        return ProbeResult("internet", Status.UNKNOWN, now, detail="The internet could not be measured this minute.")
    if filtered:
        return _filtered_result("internet", now, "The internet address", hop)
    status = internet_status(hop)
    return ProbeResult("internet", status, now, hop.rtt_median_ms, _hop_detail("The internet check", hop, status))


def ajaxcloud_result(net: NetSnapshot, now: datetime) -> ProbeResult:
    """The `ajaxcloud` probe: from Alarmio's report in proxy mode, from a direct request otherwise."""
    if net.proxy_mode:
        ajax = net.echo.ajax if net.echo else None
        status = ajax_cloud_status(ajax)
        if status is Status.UNKNOWN:
            return ProbeResult("ajaxcloud", status, now, detail="Waiting for Alarmio's report on Ajax's cloud.")
        latency = ajax.get("canary_ms") if ajax else None
        detail = "" if status is Status.HEALTHY else "Ajax's cloud is slow or failing, as seen from Alarmio."
        value = float(latency) if isinstance(latency, int | float) else None
        return ProbeResult("ajaxcloud", status, now, value, detail)
    if net.ajax_direct_ok is None:
        return ProbeResult("ajaxcloud", Status.UNKNOWN, now, detail="Ajax's cloud was not checked this minute.")
    if not net.ajax_direct_ok:
        return ProbeResult("ajaxcloud", Status.DOWN, now, detail="Cannot reach Ajax's cloud from your network.")
    slow = net.ajax_direct_ms is not None and net.ajax_direct_ms > DIRECT_AJAX_SLOW_MS
    return ProbeResult(
        "ajaxcloud", Status.DEGRADED if slow else Status.HEALTHY, now, net.ajax_direct_ms,
        "Ajax's cloud is slow to answer." if slow else "",
    )


async def probe_ajax_direct(
    client: httpx.AsyncClient, *, url: str = AJAX_DIRECT_URL, timeout: float = 10.0
) -> tuple[bool, float, StageTimings]:
    """Unauthenticated request to Ajax's API host: any HTTP answer proves the path. Never raises."""
    recorder = StageRecorder()
    started = time.perf_counter()
    try:
        await client.get(
            url, timeout=timeout, follow_redirects=False, headers={"Connection": "close"},
            extensions={"trace": recorder},
        )
    except Exception:  # noqa: BLE001 - any failure means unreachable
        return False, (time.perf_counter() - started) * 1000, recorder.timings()
    return True, (time.perf_counter() - started) * 1000, recorder.timings()


def _hop_block(hop: HopStats) -> dict[str, Any]:
    return {
        "sent": hop.sent, "received": hop.received,
        "loss_pct": hop.loss_pct if hop.method == "icmp" else None,  # TCP retransmits hide loss
        "rtt_median_ms": hop.rtt_median_ms, "jitter_ms": hop.jitter_ms,
    }


def net_block(hops: NetHops, loop_lag_ms: float, mode: str) -> dict[str, Any]:
    """The heartbeat `net` block: counts and timings only, never addresses."""
    block: dict[str, Any] = {}
    for name, hop in (("gateway", hops.gateway), ("internet", hops.internet), ("vps", hops.vps)):
        if hop is not None:
            block[name] = _hop_block(hop)
    block["loop_lag_max_ms"] = round(loop_lag_ms, 1)
    block["icmp"] = mode
    return block

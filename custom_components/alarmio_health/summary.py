"""Builds the panel summary (the signal chain) from probe results."""

from __future__ import annotations

import math
from collections.abc import Iterable
from typing import Any, Protocol

from .models import NetSnapshot, ProbeResult, Status, Verdict
from .net.blame import server_status

LINK_ORDER = ("ajax", "alarmio", "foxace", "ha")
LINK_LABELS = {"ajax": "Ajax hub", "alarmio": "Alarmio", "foxace": "foXaCe", "ha": "Home Assistant"}
LINK_PROBES = {"ajax": ("ajax",), "alarmio": ("alarmio", "tls", "session"), "foxace": ("foxace", "stream"), "ha": ()}
_SEVERITY = {Status.HEALTHY: 0, Status.DEGRADED: 1, Status.DOWN: 2}
NODE_LABELS = {
    "ajax_hub": "Ajax hub",
    "ajax_cloud": "Ajax cloud",
    "alarmio": "Alarmio",
    "internet": "Internet",
    "gateway": "Gateway",
    "ha": "Home Assistant",
}
_OUTWARD = ("ha", "gateway", "internet", "alarmio", "ajax_cloud", "ajax_hub")
_BLAMED_NODE = {
    "ha_host": "ha",
    "gateway": "gateway",
    "internet": "internet",
    "route": "internet",
    "alarmio": "alarmio",
    "ajax_cloud": "ajax_cloud",
}


class _OpenIncident(Protocol):
    probe: str
    opened_at: Any


def combine(statuses: Iterable[Status]) -> Status:
    """Return the worst known status; `unknown` only if nothing is known."""
    known = [s for s in statuses if s is not Status.UNKNOWN]
    if not known:
        return Status.UNKNOWN
    return max(known, key=lambda s: _SEVERITY[s])


def build_summary(
    results: dict[str, ProbeResult],
    open_incidents: list[_OpenIncident],
    net: NetSnapshot | None = None,
    verdict: Verdict | None = None,
) -> dict[str, Any]:
    """Return links, probes, down_since plus the network chain, echo trace and cause line."""
    links: list[dict[str, Any]] = []
    for link_id in LINK_ORDER:
        probes = [results[p] for p in LINK_PROBES[link_id] if p in results]
        if link_id == "ha":
            links.append(_link(link_id, Status.HEALTHY, None, "Integration running."))
            continue
        status = combine(p.status for p in probes)
        worst = next((p for p in probes if p.status is status and p.detail), None)
        primary = results.get(LINK_PROBES[link_id][0])
        links.append(_link(link_id, status, primary.latency_ms if primary else None, worst.detail if worst else ""))

    down_since = None
    first_down = next((link for link in links if link["status"] == "down"), None)
    if first_down:
        probes_of_link = LINK_PROBES[first_down["id"]]
        opened = [i.opened_at for i in open_incidents if i.probe in probes_of_link]
        if opened:
            down_since = min(opened).isoformat()

    return {
        "links": links,
        "probes": {name: _probe_dict(r) for name, r in results.items()},
        "down_since": down_since,
        "chain": build_chain(results, net, verdict),
        "trace": build_trace(net, verdict),
        "cause": verdict.text if verdict and verdict.status in (Status.DEGRADED, Status.DOWN) else "",
        "cause_status": verdict.status.value if verdict else Status.UNKNOWN.value,
    }


def _link(link_id: str, status: Status, latency_ms: float | None, detail: str) -> dict[str, Any]:
    return {
        "id": link_id,
        "label": LINK_LABELS[link_id],
        "status": status.value,
        "latency_ms": latency_ms,
        "detail": detail,
    }


def _probe_dict(result: ProbeResult) -> dict[str, Any]:
    return {
        "status": result.status.value,
        "latency_ms": result.latency_ms,
        "detail": result.detail,
        "checked_at": result.checked_at.isoformat(),
    }


def build_chain(
    results: dict[str, ProbeResult], net: NetSnapshot | None, verdict: Verdict | None
) -> list[dict[str, Any]]:
    """The chain in event order (Ajax hub first, Home Assistant last), each node marked evaluated or not."""
    if net is None:
        return []
    verdict = verdict or Verdict(None, Status.UNKNOWN, "", {})
    server_ms = net.echo.server_ms if net.echo else None
    alarmio = results.get("alarmio")
    alarmio_status = (
        server_status(server_ms) if server_ms is not None else (alarmio.status if alarmio else Status.UNKNOWN)
    )
    raw: dict[str, tuple[Status, float | None, str]] = {
        "ajax_hub": _node_values(results.get("ajax")),
        "ajax_cloud": _node_values(results.get("ajaxcloud")),
        "alarmio": (
            alarmio_status,
            server_ms if server_ms is not None else (alarmio.latency_ms if alarmio else None),
            alarmio.detail if alarmio else "",
        ),
        "internet": _node_values(results.get("internet")),
        "gateway": _node_values(results.get("gateway")),
        "ha": (Status.DEGRADED if verdict.broken == "ha_host" else Status.HEALTHY, net.loop_lag_ms, ""),
    }
    order = [n for n in _OUTWARD if net.proxy_mode or n != "alarmio"]
    blamed = _BLAMED_NODE.get(verdict.broken or "")
    cutoff = order.index(blamed) if blamed in order else None
    if verdict.broken == "route" and net.echo is not None and net.echo.state in ("ok", "slow"):
        cutoff = None  # the server's own numbers arrived, so the hops beyond the route were evaluated
    nodes = []
    for node_id in reversed(order):
        status, latency, detail = raw[node_id]
        evaluated = cutoff is None or order.index(node_id) <= cutoff
        nodes.append(
            {
                "id": node_id,
                "label": NODE_LABELS[node_id],
                "status": (status if evaluated else Status.UNKNOWN).value,
                "latency_ms": latency if evaluated else None,
                "detail": detail if evaluated else "Not evaluated",
                "evaluated": evaluated,
            }
        )
    return nodes


def _node_values(result: ProbeResult | None) -> tuple[Status, float | None, str]:
    return (result.status, result.latency_ms, result.detail) if result else (Status.UNKNOWN, None, "")


def _is_ms(value: object) -> bool:
    """True for a finite, non-negative number (bool is not a measurement)."""
    return isinstance(value, int | float) and not isinstance(value, bool) and math.isfinite(value) and value >= 0


def build_trace(net: NetSnapshot | None, verdict: Verdict | None) -> dict[str, Any]:
    """Milliseconds per segment of the round trip, plus which segment is blamed."""
    if net is None:
        return {"blamed": None, "segments": []}
    echo = net.echo
    ajax = echo.ajax if echo and echo.ajax else {}
    canary = ajax.get("canary_ms")
    ajax_ms = canary if isinstance(canary, int | float) else ajax.get("p50_ms")
    if not net.proxy_mode and _is_ms(net.ajax_direct_ms):
        ajax_ms = net.ajax_direct_ms
    values = (
        ("gateway", net.gateway.rtt_median_ms if net.gateway else None),
        ("internet", net.internet.rtt_median_ms if net.internet else None),
        (
            "route",
            echo.round_trip_ms
            if echo and echo.round_trip_ms is not None
            else (net.vps.rtt_median_ms if net.vps else None),
        ),
        ("alarmio", echo.server_ms if echo else None),
        ("ajax", ajax_ms),
    )
    segments = [{"id": seg, "ms": float(ms)} for seg, ms in values if isinstance(ms, int | float)]
    return {"blamed": verdict.broken if verdict else None, "segments": segments}

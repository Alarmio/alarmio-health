"""Builds the panel summary (the signal chain) from probe results."""

from __future__ import annotations

from collections.abc import Iterable
from typing import Any, Protocol

from .models import ProbeResult, Status

LINK_ORDER = ("ajax", "alarmio", "foxace", "ha")
LINK_LABELS = {"ajax": "Ajax hub", "alarmio": "Alarmio", "foxace": "foXaCe", "ha": "Home Assistant"}
LINK_PROBES = {"ajax": ("ajax",), "alarmio": ("alarmio", "tls", "session"), "foxace": ("foxace", "stream"), "ha": ()}
_SEVERITY = {Status.HEALTHY: 0, Status.DEGRADED: 1, Status.DOWN: 2}


class _OpenIncident(Protocol):
    probe: str
    opened_at: Any


def combine(statuses: Iterable[Status]) -> Status:
    """Return the worst known status; `unknown` only if nothing is known."""
    known = [s for s in statuses if s is not Status.UNKNOWN]
    if not known:
        return Status.UNKNOWN
    return max(known, key=lambda s: _SEVERITY[s])


def build_summary(results: dict[str, ProbeResult], open_incidents: list[_OpenIncident]) -> dict[str, Any]:
    """Return {"links": [...], "probes": {...}, "down_since": iso | None}."""
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

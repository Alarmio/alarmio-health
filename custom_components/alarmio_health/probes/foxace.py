"""Probes that read a FoxaceSnapshot. Pure functions: no Home Assistant imports."""

from __future__ import annotations

from datetime import datetime

from ..models import FoxaceSnapshot, ProbeResult, Status


def probe_foxace(snap: FoxaceSnapshot, checked_at: datetime, stale_after_s: float = 180.0) -> ProbeResult:
    """Is the foXaCe integration present and updating?"""
    if not snap.installed:
        return ProbeResult(
            "foxace", Status.UNKNOWN, checked_at, detail="The foXaCe (Ajax) integration is not installed."
        )
    if not snap.update_ok:
        return ProbeResult(
            "foxace",
            Status.DOWN,
            checked_at,
            detail="foXaCe's last update failed. Check its logs in Settings > System.",
        )
    if snap.seconds_since_update is not None and snap.seconds_since_update > stale_after_s:
        minutes = snap.seconds_since_update / 60
        return ProbeResult(
            "foxace", Status.DEGRADED, checked_at, detail=f"foXaCe has not updated for {minutes:.0f} min."
        )
    if not snap.version_tested:
        return ProbeResult(
            "foxace",
            Status.DEGRADED,
            checked_at,
            detail=f"foXaCe {snap.version} has not been tested with Alarmio Health.",
        )
    return ProbeResult("foxace", Status.HEALTHY, checked_at)


def probe_stream(snap: FoxaceSnapshot, checked_at: datetime) -> ProbeResult:
    """Is the Alarmio event stream (SSE) connected?

    Silence is never a failure: Ajax only sends events while armed.
    """
    if snap.sse_connected is None:
        return ProbeResult("stream", Status.UNKNOWN, checked_at, detail="foXaCe is not using the Alarmio event stream.")
    if not snap.sse_connected:
        return ProbeResult("stream", Status.DOWN, checked_at, detail="Event stream disconnected. foXaCe is retrying.")
    return ProbeResult("stream", Status.HEALTHY, checked_at)


def probe_ajax(snap: FoxaceSnapshot, checked_at: datetime, low_battery: int = 20) -> ProbeResult:
    """Aggregate hub and device health as foXaCe reports it."""
    devices = snap.devices
    if not devices:
        return ProbeResult("ajax", Status.UNKNOWN, checked_at, detail="No Ajax devices reported yet.")
    if all(not d.online for d in devices):
        return ProbeResult(
            "ajax", Status.DOWN, checked_at, detail="Every Ajax device is offline. Check the hub's power and internet."
        )
    offline = sum(1 for d in devices if not d.online)
    low = sum(1 for d in devices if d.battery_level is not None and d.battery_level < low_battery)
    malfunctions = sum(1 for d in devices if d.malfunctions > 0)
    parts = []
    if offline:
        parts.append(f"{offline} offline")
    if low:
        parts.append(f"{low} low battery")
    if malfunctions:
        parts.append(f"{malfunctions} with a malfunction")
    if parts:
        return ProbeResult("ajax", Status.DEGRADED, checked_at, detail=", ".join(parts) + ".")
    return ProbeResult("ajax", Status.HEALTHY, checked_at)


class ReconnectCounter:
    """Counts disconnect-then-reconnect transitions seen between polls."""

    def __init__(self) -> None:
        self.count = 0
        self._last: bool | None = None
        self._dropped = False

    def observe(self, connected: bool | None) -> None:
        """Record the latest connection state (None means unknown and is skipped)."""
        if connected is None:
            return
        if self._last is True and connected is False:
            self._dropped = True
        elif connected is True and self._dropped:
            self.count += 1
            self._dropped = False
        self._last = connected

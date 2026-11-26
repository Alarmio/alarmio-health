"""Incident detection with hysteresis. Pure Python; persistence is a dict round-trip."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Any

from .models import ProbeResult, Status


def _aware(moment: datetime) -> datetime:
    """A stored timestamp as an aware UTC datetime (naive values are taken to be UTC)."""
    return moment.replace(tzinfo=UTC) if moment.tzinfo is None else moment


@dataclass
class Incident:
    """One outage of one probe."""

    id: str
    probe: str
    opened_at: datetime
    detail: str
    closed_at: datetime | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "probe": self.probe,
            "opened_at": self.opened_at.isoformat(),
            "detail": self.detail,
            "closed_at": self.closed_at.isoformat() if self.closed_at else None,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Incident:
        closed = data.get("closed_at")
        return cls(
            id=data["id"],
            probe=data["probe"],
            opened_at=_aware(datetime.fromisoformat(data["opened_at"])),
            detail=data.get("detail", ""),
            closed_at=_aware(datetime.fromisoformat(closed)) if closed else None,
        )


class IncidentTracker:
    """Opens an incident after N consecutive `down` results, closes after M non-`down`."""

    def __init__(
        self, open_after: int = 3, close_after: int = 2, retention: timedelta = timedelta(days=90)
    ) -> None:
        self._open_after = open_after
        self._close_after = close_after
        self._retention = retention
        self._fail: dict[str, int] = {}
        self._first_fail: dict[str, datetime] = {}
        self._ok: dict[str, int] = {}
        self._open: dict[str, Incident] = {}
        self.incidents: list[Incident] = []
        self.skipped = 0  # incidents dropped by a lenient restore

    @property
    def open_incidents(self) -> list[Incident]:
        return list(self._open.values())

    def observe(self, result: ProbeResult) -> Incident | None:
        """Feed one result. Returns the incident that just opened or closed, else None."""
        probe = result.probe
        if result.status is Status.UNKNOWN:
            return None
        if result.status is Status.DOWN:
            self._ok[probe] = 0
            if self._fail.get(probe, 0) == 0:
                self._first_fail[probe] = result.checked_at
            self._fail[probe] = self._fail.get(probe, 0) + 1
            if probe not in self._open and self._fail[probe] >= self._open_after:
                first = self._first_fail[probe]
                incident = Incident(f"{probe}-{int(first.timestamp())}", probe, first, result.detail)
                self._open[probe] = incident
                self.incidents.append(incident)
                return incident
            return None
        self._fail[probe] = 0
        if probe in self._open:
            self._ok[probe] = self._ok.get(probe, 0) + 1
            if self._ok[probe] >= self._close_after:
                incident = self._open.pop(probe)
                incident.closed_at = result.checked_at
                self._ok[probe] = 0
                return incident
        return None

    def prune(self, now: datetime) -> None:
        """Drop closed incidents older than the retention period."""
        cutoff = now - self._retention
        self.incidents = [i for i in self.incidents if i.closed_at is None or i.closed_at >= cutoff]

    def to_dict(self) -> dict[str, Any]:
        return {"incidents": [i.to_dict() for i in self.incidents]}

    @classmethod
    def from_dict(cls, data: dict[str, Any], *, lenient: bool = False, **kwargs: Any) -> IncidentTracker:
        """Restore a tracker. With `lenient`, unparseable incidents are skipped and counted in `skipped`."""
        tracker = cls(**kwargs)
        if not lenient:
            tracker.incidents = [Incident.from_dict(d) for d in data.get("incidents", [])]
        else:
            restored: list[Incident] = []
            for entry in data.get("incidents", []):
                try:
                    restored.append(Incident.from_dict(entry))
                except Exception:  # noqa: BLE001 - one corrupt entry must not lose the rest
                    tracker.skipped += 1
            tracker.incidents = restored
        tracker._open = {i.probe: i for i in tracker.incidents if i.closed_at is None}
        return tracker

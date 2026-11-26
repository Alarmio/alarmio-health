from datetime import UTC, datetime, timedelta

import pytest

from custom_components.alarmio_health.incidents import IncidentTracker
from custom_components.alarmio_health.models import ProbeResult, Status

T0 = datetime(2026, 11, 26, 12, 0, tzinfo=UTC)


def _r(status: Status, minutes: int, probe: str = "stream") -> ProbeResult:
    return ProbeResult(probe, status, T0 + timedelta(minutes=minutes), detail="d")


def test_incident_opens_after_three_consecutive_failures_and_uses_first_failure_time() -> None:
    tracker = IncidentTracker()
    assert tracker.observe(_r(Status.DOWN, 0)) is None
    assert tracker.observe(_r(Status.DOWN, 1)) is None
    opened = tracker.observe(_r(Status.DOWN, 2))
    assert opened is not None
    assert opened.opened_at == T0
    assert opened.closed_at is None


def test_single_blip_does_not_open_an_incident() -> None:
    tracker = IncidentTracker()
    for minute, status in enumerate([Status.DOWN, Status.HEALTHY, Status.DOWN, Status.HEALTHY]):
        assert tracker.observe(_r(status, minute)) is None
    assert tracker.incidents == []


def test_incident_closes_after_two_consecutive_successes() -> None:
    tracker = IncidentTracker()
    for minute in range(3):
        tracker.observe(_r(Status.DOWN, minute))
    assert tracker.observe(_r(Status.HEALTHY, 3)) is None
    closed = tracker.observe(_r(Status.DEGRADED, 4))
    assert closed is not None
    assert closed.closed_at == T0 + timedelta(minutes=4)
    assert tracker.open_incidents == []


def test_failure_between_successes_resets_close_counter() -> None:
    tracker = IncidentTracker()
    for minute in range(3):
        tracker.observe(_r(Status.DOWN, minute))
    tracker.observe(_r(Status.HEALTHY, 3))
    tracker.observe(_r(Status.DOWN, 4))
    assert tracker.observe(_r(Status.HEALTHY, 5)) is None
    assert len(tracker.open_incidents) == 1


def test_unknown_is_ignored() -> None:
    tracker = IncidentTracker()
    tracker.observe(_r(Status.DOWN, 0))
    tracker.observe(_r(Status.DOWN, 1))
    tracker.observe(_r(Status.UNKNOWN, 2))
    assert tracker.observe(_r(Status.DOWN, 3)) is not None


def test_probes_are_tracked_independently() -> None:
    tracker = IncidentTracker()
    for minute in range(3):
        tracker.observe(_r(Status.DOWN, minute, "stream"))
        tracker.observe(_r(Status.HEALTHY, minute, "alarmio"))
    assert [i.probe for i in tracker.open_incidents] == ["stream"]


def test_prune_drops_old_closed_incidents_only() -> None:
    tracker = IncidentTracker(retention=timedelta(days=90))
    for minute in range(3):
        tracker.observe(_r(Status.DOWN, minute))
    tracker.observe(_r(Status.HEALTHY, 3))
    tracker.observe(_r(Status.HEALTHY, 4))
    tracker.prune(T0 + timedelta(days=91))
    assert tracker.incidents == []


def test_round_trip_keeps_open_incident_open() -> None:
    tracker = IncidentTracker()
    for minute in range(3):
        tracker.observe(_r(Status.DOWN, minute))
    restored = IncidentTracker.from_dict(tracker.to_dict())
    assert [i.probe for i in restored.open_incidents] == ["stream"]
    closed = None
    for minute in (3, 4):
        closed = restored.observe(_r(Status.HEALTHY, minute))
    assert closed is not None


def test_lenient_restore_skips_bad_incidents_and_counts_them() -> None:
    good = {"id": "a", "probe": "stream", "opened_at": "2026-11-01T10:00:00+00:00", "detail": "", "closed_at": None}
    data = {"incidents": [good, {"id": "b"}, "junk", {**good, "id": "c", "opened_at": "nope"}]}
    tracker = IncidentTracker.from_dict(data, lenient=True)
    assert [i.id for i in tracker.incidents] == ["a"]
    assert tracker.skipped == 3
    assert list(tracker._open) == ["stream"]


def test_strict_restore_still_raises_on_bad_incident() -> None:
    with pytest.raises(KeyError):
        IncidentTracker.from_dict({"incidents": [{"id": "b"}]})


def test_naive_stored_timestamps_are_normalised_to_utc_and_prune_does_not_raise() -> None:
    now = datetime(2026, 11, 26, 12, 0, tzinfo=UTC)
    old = now - timedelta(days=200)
    recent = now - timedelta(days=1)
    data = {"incidents": [
        {"id": "a", "probe": "ajax", "opened_at": (old - timedelta(hours=1)).replace(tzinfo=None).isoformat(),
         "detail": "", "closed_at": old.replace(tzinfo=None).isoformat()},
        {"id": "b", "probe": "ajax", "opened_at": old.isoformat(), "detail": "", "closed_at": old.isoformat()},
        {"id": "c", "probe": "ajax", "opened_at": recent.replace(tzinfo=None).isoformat(), "detail": "",
         "closed_at": recent.replace(tzinfo=None).isoformat()},
        {"id": "d", "probe": "ajax", "opened_at": recent.isoformat(), "detail": "", "closed_at": recent.isoformat()},
    ]}
    tracker = IncidentTracker.from_dict(data, lenient=True)
    assert all(i.opened_at.tzinfo is not None for i in tracker.incidents)
    assert tracker.incidents[0].opened_at.utcoffset() == timedelta(0)
    tracker.prune(now)
    assert [i.id for i in tracker.incidents] == ["c", "d"]

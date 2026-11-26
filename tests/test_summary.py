from datetime import UTC, datetime

from custom_components.alarmio_health.models import ProbeResult, Status
from custom_components.alarmio_health.summary import build_summary, combine

NOW = datetime(2026, 11, 26, 12, 0, tzinfo=UTC)


def _r(probe: str, status: Status, latency: float | None = None, detail: str = "") -> ProbeResult:
    return ProbeResult(probe, status, NOW, latency, detail)


def test_combine_worst_wins_and_unknown_is_ignored() -> None:
    assert combine([Status.HEALTHY, Status.DOWN]) is Status.DOWN
    assert combine([Status.HEALTHY, Status.DEGRADED]) is Status.DEGRADED
    assert combine([Status.HEALTHY, Status.UNKNOWN]) is Status.HEALTHY
    assert combine([Status.UNKNOWN, Status.UNKNOWN]) is Status.UNKNOWN
    assert combine([]) is Status.UNKNOWN


def test_summary_maps_probes_to_chain_links_in_order() -> None:
    results = {
        "ajax": _r("ajax", Status.HEALTHY),
        "alarmio": _r("alarmio", Status.HEALTHY, 112.0),
        "tls": _r("tls", Status.HEALTHY),
        "session": _r("session", Status.HEALTHY, 80.0),
        "foxace": _r("foxace", Status.HEALTHY),
        "stream": _r("stream", Status.DOWN, detail="Event stream disconnected."),
    }
    summary = build_summary(results, [])
    assert [link["id"] for link in summary["links"]] == ["ajax", "alarmio", "foxace", "ha"]
    foxace = summary["links"][2]
    assert foxace["status"] == "down"
    assert foxace["detail"] == "Event stream disconnected."
    assert summary["links"][1]["latency_ms"] == 112.0
    assert summary["links"][3]["status"] == "healthy"


def test_summary_reports_down_since_from_open_incident() -> None:
    class Inc:
        probe = "stream"
        opened_at = datetime(2026, 11, 26, 11, 46, tzinfo=UTC)

    results = {"stream": _r("stream", Status.DOWN, detail="x")}
    summary = build_summary(results, [Inc()])
    assert summary["down_since"] == "2026-11-26T11:46:00+00:00"

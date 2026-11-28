from datetime import UTC, datetime

from custom_components.alarmio_health.models import (
    EchoResult,
    HopStats,
    NetSnapshot,
    ProbeResult,
    StageTimings,
    Status,
)
from custom_components.alarmio_health.net.blame import blame
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


# ---------------------------------------------------------------- chain / trace / cause

_NAMES = ("alarmio", "tls", "session", "foxace", "stream", "ajax", "gateway", "internet", "ajaxcloud")


def _results(**status: Status) -> dict[str, ProbeResult]:
    return {n: ProbeResult(n, status.get(n, Status.HEALTHY), NOW, 10.0, "") for n in _NAMES}


def _net(**kw) -> NetSnapshot:
    base = dict(
        gateway=HopStats("gateway", "icmp", 5, 5, 0.4, 0.1),
        internet=HopStats("internet", "icmp", 5, 5, 12.0, 0.2),
        vps=HopStats("vps", "icmp", 5, 5, 172.0, 0.5),
        loop_lag_ms=10.0,
        icmp_mode="unprivileged",
        proxy_mode=True,
        echo=EchoResult(
            "ok",
            server_ms=3.0,
            round_trip_ms=517.0,
            ajax={"canary_ms": 180.0, "p50_ms": 200.0, "canary_ok": True},
            timings=StageTimings(wait_ms=520.0),
        ),
    )
    base.update(kw)
    return NetSnapshot(**base)


def test_legacy_keys_are_unchanged_and_new_keys_default_empty() -> None:
    s = build_summary(_results(), [])
    assert [link["id"] for link in s["links"]] == ["ajax", "alarmio", "foxace", "ha"]
    assert s["chain"] == [] and s["trace"] == {"blamed": None, "segments": []} and s["cause"] == ""


def test_chain_order_and_healthy_state() -> None:
    net = _net()
    s = build_summary(_results(), [], net, blame(net))
    assert [n["id"] for n in s["chain"]] == ["ajax_hub", "ajax_cloud", "alarmio", "internet", "gateway", "ha"]
    assert all(n["status"] == "healthy" and n["evaluated"] for n in s["chain"])
    assert s["cause"] == "" and s["trace"]["blamed"] is None
    assert {seg["id"] for seg in s["trace"]["segments"]} == {"gateway", "internet", "route", "alarmio", "ajax"}


def test_gateway_down_leaves_everything_beyond_it_not_evaluated() -> None:
    net = _net(gateway=HopStats("gateway", "icmp", 5, 0), vps=HopStats("vps", "icmp", 5, 0), echo=EchoResult("lost"))
    v = blame(net)
    s = build_summary(_results(gateway=Status.DOWN), [], net, v)
    by_id = {n["id"]: n for n in s["chain"]}
    assert by_id["ha"]["evaluated"] and by_id["gateway"]["status"] == "down"
    for node in ("internet", "alarmio", "ajax_cloud", "ajax_hub"):
        assert by_id[node]["evaluated"] is False and by_id[node]["status"] == "unknown"
        assert by_id[node]["detail"] == "Not evaluated" and by_id[node]["latency_ms"] is None
    assert s["cause"] == v.text and s["trace"]["blamed"] == "gateway"


def test_route_with_a_server_reply_still_evaluates_alarmio() -> None:
    net = _net(vps=HopStats("vps", "icmp", 5, 2, 180.0, 5.0))
    s = build_summary(_results(), [], net, blame(net))
    by_id = {n["id"]: n for n in s["chain"]}
    assert s["trace"]["blamed"] == "route"
    assert by_id["alarmio"]["evaluated"] is True and by_id["alarmio"]["status"] == "healthy"  # 3 ms server time


def test_route_without_a_reply_leaves_alarmio_not_evaluated() -> None:
    net = _net(echo=EchoResult("lost"))
    s = build_summary(_results(), [], net, blame(net))
    by_id = {n["id"]: n for n in s["chain"]}
    assert by_id["alarmio"]["evaluated"] is False and by_id["ajax_cloud"]["evaluated"] is False


def test_direct_mode_has_no_alarmio_node() -> None:
    net = _net(proxy_mode=False, vps=None, echo=None, ajax_direct_ok=True, ajax_direct_ms=300.0)
    s = build_summary(_results(), [], net, blame(net))
    assert [n["id"] for n in s["chain"]] == ["ajax_hub", "ajax_cloud", "internet", "gateway", "ha"]


def test_ha_host_marks_the_ha_node_degraded() -> None:
    net = _net(loop_lag_ms=500.0)
    s = build_summary(_results(), [], net, blame(net))
    assert {n["id"]: n for n in s["chain"]}["ha"]["status"] == "degraded"


def test_missing_probes_become_unknown_nodes_without_raising() -> None:
    net = _net(echo=None)
    s = build_summary({}, [], net, None)
    assert {n["id"]: n["status"] for n in s["chain"]}["ajax_hub"] == "unknown"
    assert s["cause"] == ""


import pytest  # noqa: E402

from custom_components.alarmio_health.models import Verdict  # noqa: E402
from custom_components.alarmio_health.summary import _BLAMED_NODE, _OUTWARD  # noqa: E402


@pytest.mark.parametrize("broken", ["ha_host", "gateway", "internet", "alarmio", "ajax_cloud"])
def test_every_blamed_node_leaves_exactly_the_nodes_beyond_it_unevaluated(broken: str) -> None:
    net = _net(echo=EchoResult("ok", server_ms=900.0, ajax={"canary_ok": False}))
    verdict = Verdict(broken, Status.DEGRADED, "cause", {})
    chain = build_summary(_results(), [], net, verdict)["chain"]
    outward = [n for n in _OUTWARD]
    cutoff = outward.index(_BLAMED_NODE[broken])
    for node in chain:
        assert node["evaluated"] is (outward.index(node["id"]) <= cutoff), (broken, node["id"])


def test_cause_status_unknown_without_a_verdict() -> None:
    assert build_summary(_results(), [])["cause_status"] == "unknown"


def test_cause_status_degraded_for_a_degraded_route() -> None:
    net = _net(vps=HopStats("vps", "icmp", 5, 2, 180.0, 5.0))
    assert build_summary(_results(), [], net, blame(net))["cause_status"] == "degraded"


def test_cause_status_healthy_for_a_healthy_verdict() -> None:
    net = _net()
    assert build_summary(_results(), [], net, blame(net))["cause_status"] == "healthy"


def _ajax_seg(net: NetSnapshot) -> list[float]:
    return [s["ms"] for s in build_summary(_results(), [], net, blame(net))["trace"]["segments"] if s["id"] == "ajax"]


def test_direct_mode_trace_emits_the_ajax_segment_from_ajax_direct_ms() -> None:
    net = _net(proxy_mode=False, vps=None, echo=None, ajax_direct_ok=True, ajax_direct_ms=230.0)
    assert _ajax_seg(net) == [230.0]


def test_direct_mode_trace_without_ajax_direct_ms_has_no_ajax_segment() -> None:
    net = _net(proxy_mode=False, vps=None, echo=None, ajax_direct_ok=True, ajax_direct_ms=None)
    assert _ajax_seg(net) == []


def test_trace_ajax_falls_back_to_p50_when_canary_is_none() -> None:
    echo = EchoResult(
        "ok",
        server_ms=3.0,
        round_trip_ms=517.0,
        ajax={"canary_ms": None, "p50_ms": 200.0},
        timings=StageTimings(wait_ms=520.0),
    )
    assert _ajax_seg(_net(echo=echo)) == [200.0]

"""Cause text attached to probe results, and downstream results marked not evaluated."""

from datetime import UTC, datetime

from custom_components.alarmio_health.models import ProbeResult, Status, Verdict
from custom_components.alarmio_health.net.attribution import apply_verdict

NOW = datetime(2026, 11, 28, 12, 0, tzinfo=UTC)


def _results(**status: Status) -> dict[str, ProbeResult]:
    names = ("alarmio", "tls", "session", "foxace", "stream", "ajax", "gateway", "internet", "ajaxcloud")
    return {n: ProbeResult(n, status.get(n, Status.HEALTHY), NOW, detail="own detail") for n in names}


def _verdict(broken: str | None, status=Status.DEGRADED, text="cause text") -> Verdict:
    return Verdict(broken, status, text, {"x": 1.0}, ("n",))


def test_nothing_broken_changes_nothing() -> None:
    r = _results()
    v = _verdict(None, Status.HEALTHY, "")
    assert apply_verdict(r, v, "ok") == (r, v)


def test_gateway_down_marks_everything_beyond_it_not_evaluated() -> None:
    r = _results(gateway=Status.DOWN, internet=Status.DOWN, alarmio=Status.DOWN, session=Status.DOWN,
                 ajaxcloud=Status.UNKNOWN, stream=Status.DOWN)
    out, _ = apply_verdict(r, _verdict("gateway", Status.DOWN), "lost")
    assert out["gateway"].status is Status.DOWN and out["gateway"].detail == "cause text"
    for name in ("internet", "alarmio", "stream"):
        assert out[name].status is Status.UNKNOWN and "Not evaluated" in out[name].detail
    # the server answered a 401, so a DOWN session is proof the path works: never masked
    assert out["session"].status is Status.DOWN
    assert out["tls"].status is Status.HEALTHY  # healthy results are left alone


def test_internet_down_leaves_the_gateway_alone() -> None:
    r = _results(gateway=Status.HEALTHY, internet=Status.DOWN, alarmio=Status.DOWN)
    out, _ = apply_verdict(r, _verdict("internet", Status.DOWN), "ok")
    assert out["gateway"].status is Status.HEALTHY
    assert out["internet"].detail == "cause text" and out["alarmio"].status is Status.UNKNOWN


def test_ha_host_marks_network_probes_not_evaluated_but_not_foxace_state() -> None:
    r = _results(gateway=Status.DOWN, alarmio=Status.DOWN, ajaxcloud=Status.DEGRADED, stream=Status.DOWN,
                 ajax=Status.DEGRADED, tls=Status.DOWN, session=Status.DOWN)
    out, _ = apply_verdict(r, _verdict("ha_host"), "ok")
    for name in ("gateway", "alarmio", "ajaxcloud"):
        assert out[name].status is Status.UNKNOWN
    # read from foXaCe state or proof the server answered: a loop stall does not hide them
    for name, status in (("stream", Status.DOWN), ("ajax", Status.DEGRADED), ("tls", Status.DOWN),
                         ("session", Status.DOWN)):
        assert out[name].status is status


def test_tls_and_session_down_survive_an_internet_verdict() -> None:
    r = _results(internet=Status.DOWN, tls=Status.DOWN, session=Status.DOWN, stream=Status.DOWN)
    out, _ = apply_verdict(r, _verdict("internet", Status.DOWN), "ok")
    assert out["tls"].status is Status.DOWN and out["session"].status is Status.DOWN
    assert out["stream"].status is Status.UNKNOWN


def test_route_keeps_the_alarmio_status_but_explains_it() -> None:
    r = _results(alarmio=Status.DEGRADED)
    out, _ = apply_verdict(r, _verdict("route"), "ok")
    assert out["alarmio"].status is Status.DEGRADED and out["alarmio"].detail == "cause text"
    assert out["ajaxcloud"].status is Status.HEALTHY  # the server's report arrived


def test_route_without_a_reply_cannot_evaluate_ajax_cloud() -> None:
    r = _results(ajaxcloud=Status.DEGRADED)
    out, _ = apply_verdict(r, _verdict("route"), "lost")
    assert out["ajaxcloud"].status is Status.UNKNOWN


def test_alarmio_and_ajax_cloud_get_their_own_cause() -> None:
    out, _ = apply_verdict(_results(alarmio=Status.DEGRADED), _verdict("alarmio"), "ok")
    assert out["alarmio"].detail == "cause text"
    out, _ = apply_verdict(_results(ajaxcloud=Status.DEGRADED), _verdict("ajax_cloud"), "ok")
    assert out["ajaxcloud"].detail == "cause text"


def test_missing_keys_do_not_raise() -> None:
    assert apply_verdict({}, _verdict("gateway"), "ok")[0] == {}


def test_a_verdict_whose_own_probe_is_debounced_to_healthy_changes_nothing() -> None:
    r = _results(gateway=Status.HEALTHY, internet=Status.DEGRADED, alarmio=Status.DEGRADED)
    for broken, own in (("gateway", "gateway"), ("internet", "internet"), ("ajax_cloud", "ajaxcloud")):
        r2 = dict(r)
        r2[own] = ProbeResult(own, Status.HEALTHY, NOW, detail="")
        out, applied = apply_verdict(r2, _verdict(broken), "ok")
        assert out == r2
        assert applied.broken is None and applied.status is Status.HEALTHY and applied.text == ""
        assert applied.numbers == {"x": 1.0} and applied.notes == ("n",)

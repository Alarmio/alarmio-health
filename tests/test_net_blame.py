"""The blame rule, table-driven. The 27 Nov 2026 evening is the headline fixture."""

import pytest

from custom_components.alarmio_health.models import EchoResult, HopStats, NetSnapshot, StageTimings, Status
from custom_components.alarmio_health.net.blame import (
    ajax_cloud_status,
    blame,
    gateway_status,
    internet_status,
    server_status,
)

GOOD_AJAX = {"calls": 50, "p50_ms": 200.0, "p95_ms": 900.0, "err_5xx": 0.0, "canary_ok": True}


def _hop(label: str, sent=5, received=5, median=1.0, method="icmp") -> HopStats:
    return HopStats(label, method, sent, received, median if received else None, 0.3 if received else None)


def _echo(state="ok", server_ms=3.0, ajax=GOOD_AJAX, connect_ms=120.0, loss=()) -> EchoResult:
    return EchoResult(state, server_ms=server_ms, ajax=ajax, timings=StageTimings(connect_ms=connect_ms), loss=loss)


def _net(**kw) -> NetSnapshot:
    base = dict(
        gateway=_hop("gateway", median=0.4),
        internet=_hop("internet", median=12.0),
        vps=_hop("vps", median=172.0),
        loop_lag_ms=20.0,
        icmp_mode="unprivileged",
        proxy_mode=True,
        echo=_echo(),
    )
    base.update(kw)
    return NetSnapshot(**base)


def _dead_beyond() -> dict:
    """Nothing further out answers either, so a silent hop is really down and not merely filtered."""
    return dict(vps=_hop("vps", received=0), echo=_echo(state="lost", server_ms=None))


def test_all_good_is_healthy() -> None:
    v = blame(_net())
    assert v.broken is None and v.status is Status.HEALTHY and v.text == ""


def test_27_nov_evening_is_the_route_not_alarmio() -> None:
    v = blame(_net(vps=_hop("vps", sent=5, received=2, median=180.0), echo=_echo(server_ms=3.0)))
    assert v.broken == "route" and v.status is Status.DEGRADED
    assert "3 of 5" in v.text and "3 ms" in v.text
    assert v.numbers["server_ms"] == 3.0 and v.numbers["vps_loss_pct"] == 60.0


def test_loop_lag_is_the_ha_host_and_comes_first() -> None:
    v = blame(_net(loop_lag_ms=400.0, gateway=_hop("gateway", received=0)))
    assert v.broken == "ha_host"


def test_gateway_down_and_degraded() -> None:
    assert (
        blame(_net(gateway=_hop("gateway", received=0), **_dead_beyond())).broken,
        blame(_net(gateway=_hop("gateway", received=0), **_dead_beyond())).status,
    ) == ("gateway", Status.DOWN)
    slow = blame(_net(gateway=_hop("gateway", median=35.0)))
    assert slow.broken == "gateway" and slow.status is Status.DEGRADED
    lossy = blame(_net(gateway=_hop("gateway", sent=5, received=3)))
    assert lossy.broken == "gateway" and lossy.status is Status.DEGRADED


def test_tcp_hop_loss_is_ignored_but_silence_is_not() -> None:
    assert blame(_net(gateway=_hop("gateway", sent=3, received=2, median=2.0, method="tcp"))).broken is None
    silent = _hop("gateway", sent=3, received=0, method="tcp")
    assert blame(_net(gateway=silent, **_dead_beyond())).status is Status.DOWN


def test_gateway_beats_internet() -> None:
    v = blame(_net(gateway=_hop("gateway", received=0), internet=_hop("internet", received=0), **_dead_beyond()))
    assert v.broken == "gateway"


def test_internet_loss_and_down() -> None:
    assert blame(_net(internet=_hop("internet", sent=5, received=3))).broken == "internet"
    v = blame(_net(internet=_hop("internet", received=0), **_dead_beyond()))
    assert v.broken == "internet" and v.status is Status.DOWN


def test_route_from_slow_vps_pings() -> None:
    assert blame(_net(vps=_hop("vps", median=500.0))).broken == "route"


def test_route_from_a_syn_retransmit_with_a_fast_server() -> None:
    v = blame(_net(echo=_echo(connect_ms=1200.0, server_ms=3.0)))
    assert v.broken == "route" and "1200" in v.text


def test_a_lost_echo_is_the_route() -> None:
    v = blame(_net(echo=_echo(state="lost", server_ms=None)))
    assert v.broken == "route" and v.status is Status.DEGRADED


def test_server_time() -> None:
    assert blame(_net(echo=_echo(server_ms=700.0))).status is Status.DEGRADED
    slow = blame(_net(echo=_echo(server_ms=3500.0)))
    assert slow.broken == "alarmio" and slow.status is Status.DOWN


@pytest.mark.parametrize(
    "ajax",
    [
        {**GOOD_AJAX, "canary_ok": False},
        {**GOOD_AJAX, "p95_ms": 4000.0},
        {**GOOD_AJAX, "calls": 12.0, "err_5xx": 3.0},
    ],
)
def test_ajax_cloud_problems(ajax) -> None:
    v = blame(_net(echo=_echo(ajax=ajax)))
    assert v.broken == "ajax_cloud" and v.status is Status.DEGRADED


def test_few_calls_do_not_make_an_error_rate() -> None:
    assert blame(_net(echo=_echo(ajax={**GOOD_AJAX, "calls": 5.0, "err_5xx": 5.0}))).broken is None


def test_no_canary_configured_is_not_a_failure() -> None:
    assert ajax_cloud_status({**GOOD_AJAX, "canary_ok": None}) is Status.HEALTHY


def test_direct_mode_uses_the_direct_ajax_probe_and_ignores_the_vps() -> None:
    base = dict(proxy_mode=False, vps=_hop("vps", received=0), echo=None)
    assert blame(_net(**base, ajax_direct_ok=True, ajax_direct_ms=300.0)).broken is None
    down = blame(_net(**base, ajax_direct_ok=False))
    assert down.broken == "ajax_cloud" and down.status is Status.DOWN
    assert blame(_net(**base, ajax_direct_ok=True, ajax_direct_ms=4000.0)).status is Status.DEGRADED


def test_no_data_at_all_is_unknown_not_healthy() -> None:
    v = blame(NetSnapshot(None, None, None, None, "tcp-fallback", True, None))
    assert v.broken is None and v.status is Status.UNKNOWN


def test_old_server_adds_a_note_and_is_not_blamed() -> None:
    v = blame(_net(echo=EchoResult("unavailable")))
    assert v.broken is None and "server timing unavailable" in v.notes


def test_status_helpers() -> None:
    assert gateway_status(None) is Status.UNKNOWN and internet_status(None) is Status.UNKNOWN
    assert server_status(None) is Status.UNKNOWN and server_status(499.0) is Status.HEALTHY
    assert server_status(501.0) is Status.DEGRADED and server_status(3001.0) is Status.DOWN
    assert ajax_cloud_status(None) is Status.UNKNOWN and ajax_cloud_status({}) is Status.UNKNOWN


# --- review fixes: nothing measured is never healthy ---------------------------------------------


def test_hops_with_no_pings_sent_and_nothing_else_is_unknown() -> None:
    zero = _hop("x", sent=0, received=0)
    v = blame(NetSnapshot(zero, zero, None, 20.0, "tcp-fallback", True, None))
    assert v.broken is None and v.status is Status.UNKNOWN


def test_only_an_unavailable_echo_is_unknown_and_keeps_its_note() -> None:
    v = blame(_net(gateway=None, internet=None, vps=None, echo=EchoResult("unavailable")))
    assert v.status is Status.UNKNOWN and "server timing unavailable" in v.notes


def test_ok_echo_without_timings_or_hops_is_unknown() -> None:
    v = blame(_net(gateway=None, internet=None, vps=None, echo=EchoResult("ok")))
    assert v.broken is None and v.status is Status.UNKNOWN


@pytest.mark.parametrize("ajax", [{"canary_ok": None, "p95_ms": "x", "calls": None}, {"p95_ms": None}, {"other": 1}])
def test_ajax_block_without_usable_fields_is_unknown(ajax) -> None:
    assert ajax_cloud_status(ajax) is Status.UNKNOWN


def test_direct_mode_measured_by_ms_alone_counts_as_data() -> None:
    base = dict(gateway=None, internet=None, proxy_mode=False, vps=None, echo=None, ajax_direct_ok=None)
    assert blame(_net(**base, ajax_direct_ms=300.0)).status is Status.HEALTHY
    assert blame(_net(**base)).status is Status.UNKNOWN


# --- review fixes: ICMP-blocked VPS ------------------------------------------------------------


def test_icmp_blocked_vps_with_an_ok_echo_is_ignored_with_a_note() -> None:
    v = blame(_net(vps=_hop("vps", sent=5, received=0), echo=_echo(server_ms=3.0)))
    assert v.broken is None and v.status is Status.HEALTHY
    assert "pings to Alarmio are blocked" in v.notes


def test_icmp_blocked_vps_with_a_slow_echo_is_ignored_too() -> None:
    v = blame(_net(vps=_hop("vps", sent=5, received=0), echo=_echo(state="slow", server_ms=3.0)))
    assert v.broken is None and "pings to Alarmio are blocked" in v.notes


def test_silent_vps_with_a_lost_echo_is_still_route_down() -> None:
    v = blame(_net(vps=_hop("vps", sent=5, received=0), echo=_echo(state="lost", server_ms=None)))
    assert v.broken == "route" and v.status is Status.DOWN


def test_silent_vps_with_no_echo_is_route_down() -> None:
    v = blame(_net(vps=_hop("vps", sent=5, received=0), echo=None))
    assert v.broken == "route" and v.status is Status.DOWN


def test_partial_icmp_loss_with_an_ok_echo_still_blames_the_route() -> None:
    v = blame(_net(vps=_hop("vps", sent=5, received=4), echo=_echo(server_ms=3.0)))
    assert v.broken == "route" and v.status is Status.DEGRADED


def test_tcp_vps_with_no_answers_and_an_ok_echo_is_ignored() -> None:
    v = blame(_net(vps=_hop("vps", sent=3, received=0, method="tcp"), echo=_echo(server_ms=3.0)))
    assert v.broken is None


# --- boundaries ----------------------------------------------------------------------------------


def test_syn_retransmit_with_server_exactly_at_the_limit_is_still_the_route() -> None:
    v = blame(_net(echo=_echo(connect_ms=1200.0, server_ms=500.0)))
    assert v.broken == "route"


def test_gateway_median_boundary() -> None:
    assert blame(_net(gateway=_hop("gateway", median=20.0))).broken is None
    assert blame(_net(gateway=_hop("gateway", median=20.1))).broken == "gateway"


def test_icmp_loss_exactly_at_the_limit_is_degraded() -> None:
    v = blame(_net(internet=_hop("internet", sent=5, received=4)))
    assert v.broken == "internet" and v.status is Status.DEGRADED


def test_loop_lag_boundary() -> None:
    assert blame(_net(loop_lag_ms=250.0)).broken is None
    assert blame(_net(loop_lag_ms=251.0)).broken == "ha_host"


def test_vps_median_boundary() -> None:
    assert blame(_net(vps=_hop("vps", median=400.0))).broken is None
    assert blame(_net(vps=_hop("vps", median=401.0))).broken == "route"


def test_slow_server_beats_a_bad_ajax_block() -> None:
    v = blame(_net(echo=_echo(server_ms=700.0, ajax={**GOOD_AJAX, "canary_ok": False})))
    assert v.broken == "alarmio"


# --- filtered hops: silent but later evidence answered -----------------------------------------------


def test_a_silent_gateway_with_an_ok_echo_is_filtered_not_down() -> None:
    v = blame(_net(gateway=_hop("gateway", received=0)))
    assert v.broken is None and "your router does not answer pings" in v.notes


def test_a_silent_gateway_with_a_slow_echo_or_answering_vps_is_filtered() -> None:
    assert blame(_net(gateway=_hop("gateway", received=0), echo=_echo(state="slow"))).broken is None
    v = blame(_net(gateway=_hop("gateway", received=0), echo=_echo(state="lost", server_ms=None)))
    assert v.broken != "gateway"  # the VPS answered pings
    silent_vps = blame(
        _net(gateway=_hop("gateway", received=0), vps=_hop("vps", received=0), echo=_echo(state="lost", server_ms=None))
    )
    assert silent_vps.broken == "gateway" and silent_vps.status is Status.DOWN


def test_a_silent_tcp_gateway_note_says_connections() -> None:
    v = blame(_net(gateway=_hop("gateway", received=0, method="tcp")))
    assert v.broken is None and "your router does not answer connections" in v.notes


def test_a_silent_gateway_in_direct_mode_needs_the_direct_probe_to_have_answered() -> None:
    base = dict(proxy_mode=False, vps=None, echo=None, internet=None)
    ok = blame(_net(gateway=_hop("gateway", received=0), ajax_direct_ok=True, **base))
    assert ok.broken is None and "your router does not answer pings" in ok.notes
    assert blame(_net(gateway=_hop("gateway", received=0), ajax_direct_ok=False, **base)).broken == "gateway"
    assert blame(_net(gateway=_hop("gateway", received=0), **base)).broken == "gateway"


def test_partial_gateway_loss_is_still_blamed_even_with_an_ok_echo() -> None:
    v = blame(_net(gateway=_hop("gateway", sent=5, received=3)))
    assert v.broken == "gateway" and v.status is Status.DEGRADED


def test_a_silent_internet_anchor_with_an_ok_echo_is_filtered() -> None:
    v = blame(_net(internet=_hop("internet", received=0)))
    assert v.broken is None and "the internet address does not answer pings" in v.notes
    t = blame(_net(internet=_hop("internet", received=0, method="tcp")))
    assert "the internet address does not answer connections" in t.notes
    down = blame(_net(internet=_hop("internet", received=0), vps=_hop("vps", received=0), echo=_echo(state="lost")))
    assert down.broken == "internet"


def test_route_and_echo_wording() -> None:
    down = blame(_net(vps=_hop("vps", received=0), echo=None))
    assert down.text == "Nothing reached Alarmio. Either Alarmio is down or the route to it is."
    lost = blame(_net(echo=_echo(state="lost", server_ms=None)))
    assert lost.text == (
        "Alarmio did not answer in time; the heartbeat was lost on the way or Alarmio is not responding."
    )

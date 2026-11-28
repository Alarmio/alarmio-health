"""The new network models and constants."""

from custom_components.alarmio_health.const import DEFAULT_ANCHOR, PROBE_TITLES, PROBES
from custom_components.alarmio_health.models import EchoResult, HopStats, NetSnapshot, StageTimings, Status, Verdict


def test_loss_pct() -> None:
    assert HopStats("gateway", "icmp", 5, 3).loss_pct == 40.0
    assert HopStats("gateway", "icmp", 5, 5).loss_pct == 0.0


def test_loss_pct_with_nothing_sent_is_zero() -> None:
    assert HopStats("gateway", "icmp", 0, 0).loss_pct == 0.0


def test_new_probes_are_appended_and_titled() -> None:
    assert PROBES[:6] == ("alarmio", "tls", "session", "foxace", "stream", "ajax")
    assert PROBES[6:] == ("gateway", "internet", "ajaxcloud")
    assert all(p in PROBE_TITLES for p in PROBES)
    assert DEFAULT_ANCHOR == "1.1.1.1"


def test_defaults_are_empty_and_safe() -> None:
    echo = EchoResult(state="unavailable")
    assert echo.timings == StageTimings() and echo.loss == ()
    net = NetSnapshot(gateway=None, internet=None, vps=None, loop_lag_ms=None, icmp_mode="tcp-fallback",
                      proxy_mode=True, echo=None)
    assert net.ajax_direct_ok is None
    assert Verdict(None, Status.HEALTHY, "", {}).notes == ()

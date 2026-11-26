from datetime import UTC, datetime

from custom_components.alarmio_health.models import DeviceHealth, FoxaceSnapshot, Status
from custom_components.alarmio_health.probes.foxace import ReconnectCounter, probe_ajax, probe_foxace, probe_stream

NOW = datetime(2026, 11, 26, 12, 0, tzinfo=UTC)


def _dev(name="Door", online=True, malf=0, battery=90, signal=2) -> DeviceHealth:
    return DeviceHealth(name, online, malf, battery, signal)


def _snap(**kw) -> FoxaceSnapshot:
    base = {"installed": True, "version": "0.39.0", "version_tested": True, "proxy_mode": True,
            "proxy_url": "https://a.test", "update_ok": True, "seconds_since_update": 20.0,
            "sse_connected": True, "armed": False, "devices": (_dev(),)}
    base.update(kw)
    return FoxaceSnapshot(**base)


def test_foxace_unknown_when_not_installed() -> None:
    assert probe_foxace(FoxaceSnapshot(installed=False), NOW).status is Status.UNKNOWN


def test_foxace_down_when_last_update_failed() -> None:
    assert probe_foxace(_snap(update_ok=False), NOW).status is Status.DOWN


def test_foxace_degraded_when_updates_are_stale() -> None:
    assert probe_foxace(_snap(seconds_since_update=600.0), NOW).status is Status.DEGRADED


def test_foxace_degraded_on_untested_version() -> None:
    result = probe_foxace(_snap(version="9.9.9", version_tested=False), NOW)
    assert result.status is Status.DEGRADED
    assert "9.9.9" in result.detail


def test_foxace_healthy() -> None:
    assert probe_foxace(_snap(), NOW).status is Status.HEALTHY


def test_stream_states() -> None:
    assert probe_stream(_snap(sse_connected=None), NOW).status is Status.UNKNOWN
    assert probe_stream(_snap(sse_connected=False), NOW).status is Status.DOWN
    assert probe_stream(_snap(sse_connected=True), NOW).status is Status.HEALTHY


def test_stream_silence_while_armed_is_not_a_failure() -> None:
    snap = _snap(armed=True, seconds_since_update=7200.0)
    assert probe_stream(snap, NOW).status is Status.HEALTHY


def test_ajax_states() -> None:
    assert probe_ajax(_snap(devices=()), NOW).status is Status.UNKNOWN
    assert probe_ajax(_snap(devices=(_dev(online=False), _dev(online=False))), NOW).status is Status.DOWN
    assert probe_ajax(_snap(devices=(_dev(), _dev(battery=10))), NOW).status is Status.DEGRADED
    assert probe_ajax(_snap(devices=(_dev(), _dev(malf=1))), NOW).status is Status.DEGRADED
    assert probe_ajax(_snap(devices=(_dev(), _dev())), NOW).status is Status.HEALTHY


def test_ajax_detail_names_the_counts() -> None:
    result = probe_ajax(_snap(devices=(_dev(online=False), _dev(), _dev(battery=5))), NOW)
    assert "1 offline" in result.detail
    assert "1 low battery" in result.detail


def test_reconnect_counter_counts_drop_then_return() -> None:
    counter = ReconnectCounter()
    for state in (True, True, False, False, True, None, True, False, True):
        counter.observe(state)
    assert counter.count == 2

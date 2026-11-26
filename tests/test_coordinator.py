"""Coordinator tests."""

import json
import logging
from datetime import UTC, datetime
from unittest.mock import AsyncMock, MagicMock

import httpx
import pytest
from homeassistant.core import HomeAssistant

from custom_components.alarmio_health.const import PROBES
from custom_components.alarmio_health.coordinator import AlarmioHealthCoordinator
from custom_components.alarmio_health.heartbeat import HeartbeatClient
from custom_components.alarmio_health.incidents import IncidentTracker
from custom_components.alarmio_health.models import DeviceHealth, FoxaceSnapshot, ProbeResult, Status

NOW = datetime(2026, 11, 26, 12, 0, tzinfo=UTC)


def _snapshot(sse: bool = True) -> FoxaceSnapshot:
    return FoxaceSnapshot(
        installed=True, version="0.39.0", version_tested=True, proxy_mode=True, proxy_url="https://a.test",
        update_ok=True, seconds_since_update=10.0, sse_connected=sse, armed=False,
        devices=(DeviceHealth("Door", True, 0, 90, 2),),
    )


def _build(hass: HomeAssistant, handler, snapshot: FoxaceSnapshot) -> AlarmioHealthCoordinator:
    http = httpx.AsyncClient(transport=httpx.MockTransport(handler))
    adapter = MagicMock()
    adapter.snapshot = AsyncMock(return_value=snapshot)
    adapter.session_token.return_value = "tok"
    store = MagicMock()
    store.async_save = AsyncMock()
    entry = MagicMock()
    entry.options = {}
    return AlarmioHealthCoordinator(hass, entry, http, adapter, IncidentTracker(), store, HeartbeatClient(http))


def _ok(request: httpx.Request) -> httpx.Response:
    return httpx.Response(200, json={"ok": True})


async def test_update_runs_all_probes(hass: HomeAssistant) -> None:
    coordinator = _build(hass, _ok, _snapshot())
    data = await coordinator._async_update_data()
    assert set(data) == set(PROBES)
    assert data["alarmio"].status is Status.HEALTHY
    assert data["stream"].status is Status.HEALTHY


async def test_three_failed_cycles_open_and_persist_an_incident(hass: HomeAssistant) -> None:
    coordinator = _build(hass, _ok, _snapshot(sse=False))
    for _ in range(3):
        await coordinator._async_update_data()
    assert [i.probe for i in coordinator.tracker.open_incidents] == ["stream"]
    assert coordinator.store.async_save.await_count >= 1


async def test_diagnostics_only_sent_when_enabled(hass: HomeAssistant) -> None:
    bodies: list[dict] = []

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/api/heartbeat":
            bodies.append(json.loads(request.content))
        return httpx.Response(200, json={"ok": True})

    coordinator = _build(hass, handler, _snapshot())
    await coordinator._async_update_data()
    assert bodies[-1]["diagnostics"] is None
    coordinator.share_diagnostics = True
    await coordinator._async_update_data()
    assert bodies[-1]["diagnostics"] is not None


async def test_failed_save_warns_once_across_cycles_and_rewarns_after_recovery(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    coordinator = _build(hass, _ok, _snapshot())
    tracker = MagicMock()
    tracker.observe.return_value = object()  # every cycle reports a change, so a save is attempted each time
    tracker.to_dict.return_value = {}
    coordinator.tracker = tracker
    save = AsyncMock(side_effect=OSError("secret path /x"))
    coordinator.store.async_save = save

    def save_warnings() -> list[str]:
        return [r.getMessage() for r in caplog.records if "'save'" in r.getMessage()]

    with caplog.at_level(logging.WARNING):
        for _ in range(4):
            data = await coordinator._async_update_data()
        assert save.await_count == 4
        assert data["alarmio"].status is Status.HEALTHY
        assert len(save_warnings()) == 1
        assert "OSError" in save_warnings()[0]
        save.side_effect = None
        await coordinator._async_update_data()
        assert len(save_warnings()) == 1
        save.side_effect = OSError("secret again")
        await coordinator._async_update_data()
        assert len(save_warnings()) == 2
    assert "secret" not in caplog.text


async def test_tracker_warn_key_not_reset_by_other_probes_success(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    coordinator = _build(hass, _ok, _snapshot())
    tracker = MagicMock()

    def observe(result):
        if result.probe == "tls":
            raise RuntimeError("secret")

    tracker.observe.side_effect = observe
    coordinator.tracker = tracker
    with caplog.at_level(logging.WARNING):
        for _ in range(3):
            await coordinator._async_update_data()
    assert caplog.text.count("'tracker'") == 1
    assert "secret" not in caplog.text


async def test_tracker_failure_does_not_fail_cycle(hass: HomeAssistant) -> None:
    coordinator = _build(hass, _ok, _snapshot())
    coordinator.tracker = MagicMock()
    coordinator.tracker.observe.side_effect = RuntimeError("boom")
    coordinator.tracker.prune.side_effect = RuntimeError("boom")
    data = await coordinator._async_update_data()
    assert set(data) == set(PROBES)
    assert data["alarmio"].status is Status.HEALTHY


async def test_adapter_failure_returns_all_keys_unknown(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    coordinator = _build(hass, _ok, _snapshot())
    coordinator.adapter.snapshot = AsyncMock(side_effect=RuntimeError("tok-secret"))
    with caplog.at_level(logging.WARNING):
        data = await coordinator._async_update_data()
    assert set(data) == set(PROBES)
    for key in ("alarmio", "tls", "foxace", "stream", "ajax"):
        assert data[key].status is Status.UNKNOWN
        assert data[key].detail
    assert all(r.status is not Status.HEALTHY for r in data.values())
    assert "secret" not in "".join(r.detail for r in data.values())
    assert "RuntimeError" in caplog.text
    assert "secret" not in caplog.text


async def test_probe_and_heartbeat_exceptions_become_unknown(hass: HomeAssistant) -> None:
    coordinator = _build(hass, _ok, _snapshot())
    coordinator.heartbeat = MagicMock()
    coordinator.heartbeat.send = AsyncMock(side_effect=ValueError("x"))
    coordinator.adapter.session_token.side_effect = KeyError("y")
    data = await coordinator._async_update_data()
    assert set(data) == set(PROBES)
    assert data["session"].status is Status.UNKNOWN
    assert data["foxace"].status is Status.HEALTHY


async def test_all_probes_share_one_timestamp(hass: HomeAssistant) -> None:
    coordinator = _build(hass, _ok, _snapshot())
    data = await coordinator._async_update_data()
    assert len({r.checked_at for r in data.values()}) == 1


def _stub_tls(monkeypatch: pytest.MonkeyPatch) -> None:
    """probe_tls opens a real socket; replace it with a healthy result so isolation can be asserted."""
    healthy = ProbeResult("tls", Status.HEALTHY, NOW)
    monkeypatch.setattr("custom_components.alarmio_health.coordinator.probe_tls", AsyncMock(return_value=healthy))


def _boom(*_args: object, **_kwargs: object) -> None:
    raise KeyError("secret")


@pytest.mark.parametrize("raise_on", ["call", "await"])
@pytest.mark.parametrize("name", ["alarmio", "tls"])
async def test_async_probe_failure_is_isolated(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture, monkeypatch: pytest.MonkeyPatch, name: str, raise_on: str
) -> None:
    _stub_tls(monkeypatch)
    target = {"alarmio": "probe_alarmio", "tls": "probe_tls"}[name]
    mock_type = MagicMock if raise_on == "call" else AsyncMock
    fake = mock_type(side_effect=KeyError("secret"))
    monkeypatch.setattr(f"custom_components.alarmio_health.coordinator.{target}", fake)
    coordinator = _build(hass, _ok, _snapshot())
    with caplog.at_level(logging.WARNING):
        data = await coordinator._async_update_data()
    _assert_isolated(data, name, caplog)


@pytest.mark.parametrize("name", ["foxace", "stream", "ajax"])
async def test_sync_probe_failure_is_isolated(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture, monkeypatch: pytest.MonkeyPatch, name: str
) -> None:
    _stub_tls(monkeypatch)
    monkeypatch.setattr(f"custom_components.alarmio_health.coordinator.probe_{name}", _boom)
    coordinator = _build(hass, _ok, _snapshot())
    with caplog.at_level(logging.WARNING):
        data = await coordinator._async_update_data()
    _assert_isolated(data, name, caplog)


def _assert_isolated(data: dict, failed: str, caplog: pytest.LogCaptureFixture) -> None:
    assert set(data) == set(PROBES)
    assert data[failed].status is Status.UNKNOWN
    assert data[failed].detail
    for key in ("alarmio", "tls", "foxace", "stream", "ajax"):
        if key != failed:
            assert data[key].status is Status.HEALTHY, key
    assert "KeyError" in caplog.text
    assert "secret" not in caplog.text


async def test_reconnect_observe_failure_keeps_snapshot(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture, monkeypatch: pytest.MonkeyPatch
) -> None:
    _stub_tls(monkeypatch)
    coordinator = _build(hass, _ok, _snapshot())
    coordinator.reconnects = MagicMock()
    coordinator.reconnects.observe.side_effect = KeyError("secret")
    coordinator.reconnects.count = 0
    with caplog.at_level(logging.WARNING):
        for _ in range(2):
            data = await coordinator._async_update_data()
    assert set(data) == set(PROBES)
    for key in ("alarmio", "tls", "foxace", "stream", "ajax"):
        assert data[key].status is Status.HEALTHY, key
    assert caplog.text.count("KeyError") == 1
    assert "secret" not in caplog.text


async def test_coordinator_passes_a_shared_tls_context_and_creates_none_per_cycle(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    import ssl

    from custom_components.alarmio_health import coordinator as module

    coordinator = _build(hass, _ok, _snapshot())
    contexts: list[object] = []

    async def fake_tls(proxy_url: object, now: object, **kwargs: object) -> ProbeResult:
        contexts.append(kwargs.get("ssl_context"))
        return ProbeResult("tls", Status.HEALTHY, NOW)

    monkeypatch.setattr(module, "probe_tls", fake_tls)
    monkeypatch.setattr(
        ssl, "create_default_context", lambda *a, **k: pytest.fail("a TLS context was created during a cycle")
    )
    await coordinator._async_update_data()
    await coordinator._async_update_data()
    assert len(contexts) == 2
    assert isinstance(contexts[0], ssl.SSLContext)
    assert contexts[0] is contexts[1]


async def test_coordinator_receives_config_entry_explicitly(hass: HomeAssistant) -> None:
    """Current HA wants config_entry passed to DataUpdateCoordinator rather than read from a ContextVar."""
    http = httpx.AsyncClient(transport=httpx.MockTransport(_ok))
    entry = MagicMock()
    entry.options = {}
    coordinator = AlarmioHealthCoordinator(
        hass, entry, http, MagicMock(), IncidentTracker(), MagicMock(), HeartbeatClient(http)
    )
    assert coordinator.config_entry is entry


def _alarmio_sequence(monkeypatch: pytest.MonkeyPatch, statuses: list[Status]) -> None:
    results = [ProbeResult("alarmio", s, NOW, 1500.0 if s is Status.DEGRADED else 300.0,
                           "Alarmio is slow (1500 ms)." if s is Status.DEGRADED else "") for s in statuses]
    monkeypatch.setattr(
        "custom_components.alarmio_health.coordinator.probe_alarmio", AsyncMock(side_effect=results)
    )


async def _alarmio_statuses(hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch, seq: list[Status]) -> list[Status]:
    _stub_tls(monkeypatch)
    _alarmio_sequence(monkeypatch, seq)
    coordinator = _build(hass, _ok, _snapshot())
    return [(await coordinator._async_update_data())["alarmio"].status for _ in seq]


@pytest.mark.parametrize(
    ("seq", "expected"),
    [
        ([Status.DEGRADED], [Status.HEALTHY]),  # one slow reading, including the very first, is not judged
        ([Status.DEGRADED, Status.DEGRADED], [Status.HEALTHY, Status.DEGRADED]),
        ([Status.DEGRADED, Status.DEGRADED, Status.DEGRADED], [Status.HEALTHY, Status.DEGRADED, Status.DEGRADED]),
        (
            [Status.DEGRADED, Status.HEALTHY, Status.DEGRADED],  # slow, good, slow: the good reading resets
            [Status.HEALTHY, Status.HEALTHY, Status.HEALTHY],
        ),
        ([Status.DEGRADED, Status.DOWN, Status.DEGRADED], [Status.HEALTHY, Status.DOWN, Status.HEALTHY]),
        ([Status.DOWN], [Status.DOWN]),  # an outage is never debounced
        ([Status.UNKNOWN, Status.DEGRADED], [Status.UNKNOWN, Status.HEALTHY]),
    ],
)
async def test_slow_alarmio_needs_two_readings_in_a_row(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch, seq: list[Status], expected: list[Status]
) -> None:
    assert await _alarmio_statuses(hass, monkeypatch, seq) == expected


async def test_a_single_slow_reading_keeps_its_latency_and_has_no_warning_text(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    _stub_tls(monkeypatch)
    _alarmio_sequence(monkeypatch, [Status.DEGRADED])
    result = (await _build(hass, _ok, _snapshot())._async_update_data())["alarmio"]
    assert (result.status, result.latency_ms, result.detail) == (Status.HEALTHY, 1500.0, "")

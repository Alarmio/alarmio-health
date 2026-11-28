"""Websocket API tests: no real recorder or frontend is used."""

import asyncio
import logging
from datetime import UTC, datetime, timedelta
from types import SimpleNamespace
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.alarmio_health import history as history_mod
from custom_components.alarmio_health.const import CONF_SHARE_DIAGNOSTICS, DOMAIN, VERSION
from custom_components.alarmio_health.foxace_adapter import FoxaceAdapter
from custom_components.alarmio_health.models import ProbeResult, Status

WS = "custom_components.alarmio_health.websocket"
PANEL = "custom_components.alarmio_health.panel.async_register_panel"
T0 = datetime(2026, 11, 26, 10, 0, tzinfo=UTC)


async def _setup(hass: HomeAssistant, options: dict[str, Any] | None = None) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, data={}, entry_id="e1", options=options or {})
    entry.add_to_hass(hass)
    with patch(PANEL):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    return entry


async def _call(client: Any, mid: int, type_: str, **kw: Any) -> dict[str, Any]:
    await client.send_json({"id": mid, "type": type_, **kw})
    return await client.receive_json()


def _state(value: str, minutes: int) -> SimpleNamespace:
    return SimpleNamespace(state=value, last_changed=T0 + timedelta(minutes=minutes))


@pytest.fixture(autouse=True)
def real_http(preload_dependencies: None, hass: HomeAssistant) -> None:
    """hass_ws_client needs the real http and websocket_api; the other pre-seeded components stay mocked."""
    hass.config.components.difference_update({"http", "websocket_api"})


@pytest.fixture
def clock() -> Any:
    """A patchable monotonic clock for the E2E cooldown."""
    now = [1000.0]
    with patch(f"{WS}._monotonic", side_effect=lambda: now[0]):
        yield now


# ---------------------------------------------------------------- brief tests


async def test_summary_returns_chain_and_sharing_state(hass: HomeAssistant, hass_ws_client: WebSocketGenerator) -> None:
    await _setup(hass)
    client = await hass_ws_client(hass)
    reply = await _call(client, 1, "alarmio_health/summary")
    assert reply["success"]
    assert [link["id"] for link in reply["result"]["links"]] == ["ajax", "alarmio", "foxace", "ha"]
    assert reply["result"]["share_diagnostics"] is False
    assert reply["result"]["queued_heartbeats"] == 0
    assert reply["result"]["diagnostics_preview"] is None
    assert {"chain", "trace", "cause"} <= set(reply["result"])
    assert isinstance(reply["result"]["chain"], list)
    assert set(reply["result"]["trace"]) == {"blamed", "segments"}
    assert isinstance(reply["result"]["cause"], str)
    assert reply["result"]["integration_version"] == VERSION
    assert reply["result"]["cause_status"] in {"healthy", "degraded", "down", "unknown"}


async def test_summary_includes_preview_when_sharing(hass: HomeAssistant, hass_ws_client: WebSocketGenerator) -> None:
    await _setup(hass, {CONF_SHARE_DIAGNOSTICS: True})
    client = await hass_ws_client(hass)
    reply = await _call(client, 1, "alarmio_health/summary")
    preview = reply["result"]["diagnostics_preview"]
    assert reply["result"]["share_diagnostics"] is True
    assert set(preview) >= {"reconnects", "ha_version", "devices"}


async def test_incidents_returns_newest_first(hass: HomeAssistant, hass_ws_client: WebSocketGenerator) -> None:
    entry = await _setup(hass)
    tracker = entry.runtime_data.tracker
    for probe, offset in (("stream", 0), ("ajax", 60)):
        for i in range(3):
            tracker.observe(ProbeResult(probe, Status.DOWN, T0 + timedelta(minutes=offset + i), detail="d"))
    client = await hass_ws_client(hass)
    reply = await _call(client, 2, "alarmio_health/incidents")
    assert [i["probe"] for i in reply["result"]["incidents"]] == ["ajax", "stream"]
    assert set(reply["result"]["incidents"][0]) == {"id", "probe", "opened_at", "closed_at", "detail"}


async def test_history_rejects_unknown_range(hass: HomeAssistant, hass_ws_client: WebSocketGenerator) -> None:
    await _setup(hass)
    client = await hass_ws_client(hass)
    assert (await _call(client, 3, "alarmio_health/history", range="1y"))["success"] is False


async def test_e2e_test_forces_a_foxace_refresh_and_never_arms(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, clock: Any
) -> None:
    entry = await _setup(hass)
    client = await hass_ws_client(hass)
    with patch.object(entry.runtime_data.adapter, "async_refresh_foxace", return_value=(True, 140.0)) as refresh:
        reply = await _call(client, 4, "alarmio_health/run_e2e_test")
    refresh.assert_awaited_once()
    assert reply["result"]["status"] == "healthy"
    assert reply["result"]["latency_ms"] == 140.0
    assert "cached" not in reply["result"]


# ---------------------------------------------------------------- not loaded


@pytest.mark.parametrize(
    ("type_", "extra"),
    [
        ("alarmio_health/summary", {}),
        ("alarmio_health/incidents", {}),
        ("alarmio_health/history", {"range": "24h"}),
        ("alarmio_health/run_e2e_test", {}),
    ],
)
async def test_not_loaded(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, type_: str, extra: dict[str, Any]
) -> None:
    entry = await _setup(hass)
    client = await hass_ws_client(hass)
    await hass.config_entries.async_unload(entry.entry_id)
    reply = await _call(client, 1, type_, **extra)
    assert reply["success"] is False
    assert reply["error"]["code"] == "not_loaded"


async def test_reload_does_not_duplicate_commands(hass: HomeAssistant, hass_ws_client: WebSocketGenerator) -> None:
    entry = await _setup(hass)
    with patch(PANEL):
        assert await hass.config_entries.async_reload(entry.entry_id)
        await hass.async_block_till_done()
    client = await hass_ws_client(hass)
    assert (await _call(client, 1, "alarmio_health/incidents"))["success"]


# ---------------------------------------------------------------- handler failures


async def test_summary_failure_is_unknown_error_without_leak(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, caplog: pytest.LogCaptureFixture
) -> None:
    await _setup(hass)
    client = await hass_ws_client(hass)
    with patch(f"{WS}.build_summary", side_effect=RuntimeError("leak-me")):
        for mid in (1, 2):
            reply = await _call(client, mid, "alarmio_health/summary")
            assert reply["error"]["code"] == "unknown_error"
            assert "leak-me" not in str(reply)
    assert "leak-me" not in caplog.text
    warnings = [r for r in caplog.records if r.levelno == logging.WARNING and "RuntimeError" in r.getMessage()]
    assert len(warnings) == 1  # once per command+class


async def test_warning_is_rearmed_after_success(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, caplog: pytest.LogCaptureFixture
) -> None:
    await _setup(hass)
    client = await hass_ws_client(hass)
    for mid, fail in enumerate((True, False, True), start=1):
        if fail:
            with patch(f"{WS}.build_summary", side_effect=RuntimeError("x")):
                await _call(client, mid, "alarmio_health/summary")
        else:
            assert (await _call(client, mid, "alarmio_health/summary"))["success"]
    assert len([r for r in caplog.records if "RuntimeError" in r.getMessage()]) == 2


async def test_incidents_failure_is_unknown_error(hass: HomeAssistant, hass_ws_client: WebSocketGenerator) -> None:
    entry = await _setup(hass)
    entry.runtime_data.tracker.incidents = None
    client = await hass_ws_client(hass)
    reply = await _call(client, 1, "alarmio_health/incidents")
    assert reply["error"]["code"] == "unknown_error"


async def test_e2e_failure_is_unknown_error(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, clock: Any, caplog: pytest.LogCaptureFixture
) -> None:
    entry = await _setup(hass)
    client = await hass_ws_client(hass)
    with patch.object(entry.runtime_data.adapter, "async_refresh_foxace", side_effect=RuntimeError("boom-secret")):
        reply = await _call(client, 1, "alarmio_health/run_e2e_test")
    assert reply["error"]["code"] == "unknown_error"
    assert "boom-secret" not in str(reply) + caplog.text


async def test_summary_preview_failure_returns_none(hass: HomeAssistant, hass_ws_client: WebSocketGenerator) -> None:
    entry = await _setup(hass, {CONF_SHARE_DIAGNOSTICS: True})
    client = await hass_ws_client(hass)
    with patch.object(entry.runtime_data.adapter, "snapshot", side_effect=RuntimeError("x")):
        reply = await _call(client, 1, "alarmio_health/summary")
    assert reply["success"]
    assert reply["result"]["diagnostics_preview"] is None


# ---------------------------------------------------------------- E2E gating


async def test_e2e_concurrent_calls_run_one_refresh(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, clock: Any
) -> None:
    entry = await _setup(hass)
    client = await hass_ws_client(hass)
    release = asyncio.Event()

    async def slow() -> tuple[bool, float | None]:
        await release.wait()
        return False, 250.0

    with patch.object(entry.runtime_data.adapter, "async_refresh_foxace", side_effect=slow) as refresh:
        await client.send_json({"id": 1, "type": "alarmio_health/run_e2e_test"})
        await client.send_json({"id": 2, "type": "alarmio_health/run_e2e_test"})
        await asyncio.sleep(0.05)
        release.set()
        replies = [await client.receive_json(), await client.receive_json()]
    assert refresh.await_count == 1
    assert [r["result"]["status"] for r in replies] == ["down", "down"]
    assert all("cached" not in r["result"] for r in replies)


async def test_e2e_cooldown_returns_cached_then_refreshes(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, clock: Any
) -> None:
    entry = await _setup(hass)
    client = await hass_ws_client(hass)
    adapter = entry.runtime_data.adapter
    with patch.object(adapter, "async_refresh_foxace", side_effect=[(False, 90.0), (True, 80.0)]) as refresh:
        first = (await _call(client, 1, "alarmio_health/run_e2e_test"))["result"]
        clock[0] += 29.0
        second = (await _call(client, 2, "alarmio_health/run_e2e_test"))["result"]
        clock[0] += 2.0
        third = (await _call(client, 3, "alarmio_health/run_e2e_test"))["result"]
    assert refresh.await_count == 2
    assert second == {**first, "cached": True}
    assert second["status"] == "down"  # never healthier than the real result
    assert third["status"] == "healthy"
    assert "cached" not in third


@pytest.mark.parametrize(
    ("outcome", "status", "latency"),
    [
        ((False, None), "unknown", None),
        ((False, 120.0), "down", 120.0),
        ((False, 20000.0), "down", 20000.0),
        ((True, 3500.0), "degraded", 3500.0),
        ((True, 3000.0), "healthy", 3000.0),
        ((True, 100.0), "healthy", 100.0),
    ],
)
async def test_e2e_status_mapping(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    clock: Any,
    outcome: tuple[bool, float | None],
    status: str,
    latency: float | None,
) -> None:
    entry = await _setup(hass)
    client = await hass_ws_client(hass)
    with patch.object(entry.runtime_data.adapter, "async_refresh_foxace", return_value=outcome):
        result = (await _call(client, 1, "alarmio_health/run_e2e_test"))["result"]
    assert result["status"] == status
    assert result["latency_ms"] == latency
    assert result["detail"]


# ---------------------------------------------------------------- adapter refresh


def _adapter_with(hass: HomeAssistant, coordinator: Any) -> FoxaceAdapter:
    adapter = FoxaceAdapter(hass)
    adapter._coordinator = lambda: coordinator  # type: ignore[method-assign]
    return adapter


async def test_refresh_not_installed(hass: HomeAssistant) -> None:
    assert await _adapter_with(hass, None).async_refresh_foxace() == (False, None)


async def test_refresh_success_is_timed(hass: HomeAssistant) -> None:
    coordinator = SimpleNamespace(async_refresh=AsyncMock(), last_update_success=True)
    ok, elapsed = await _adapter_with(hass, coordinator).async_refresh_foxace()
    assert ok is True
    assert elapsed is not None and elapsed >= 0
    coordinator.async_refresh.assert_awaited_once()


async def test_refresh_reports_unsuccessful_update(hass: HomeAssistant) -> None:
    coordinator = SimpleNamespace(async_refresh=AsyncMock(), last_update_success=False)
    ok, elapsed = await _adapter_with(hass, coordinator).async_refresh_foxace()
    assert ok is False
    assert elapsed is not None


async def test_refresh_exception_never_raises_and_warns_once(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    refresh = AsyncMock(side_effect=ValueError("tok-secret"))
    coordinator = SimpleNamespace(async_refresh=refresh, last_update_success=True)
    adapter = _adapter_with(hass, coordinator)
    for _ in range(2):
        ok, elapsed = await adapter.async_refresh_foxace()
        assert ok is False
        assert elapsed is not None
    assert "tok-secret" not in caplog.text
    assert len([r for r in caplog.records if "ValueError" in r.getMessage()]) == 1


async def test_refresh_timeout(hass: HomeAssistant) -> None:
    async def hang() -> None:
        await asyncio.sleep(10)

    coordinator = SimpleNamespace(async_refresh=hang, last_update_success=True)
    with patch("custom_components.alarmio_health.foxace_adapter.REFRESH_TIMEOUT_S", 0.05):
        assert await _adapter_with(hass, coordinator).async_refresh_foxace() == (False, 50.0)


# ---------------------------------------------------------------- pure shaping


def test_shape_status_series_dedupes_consecutive_states() -> None:
    states = [_state("healthy", 0), _state("healthy", 1), _state("down", 2), _state("down", 3), _state("healthy", 4)]
    series = history_mod.shape_status_series(states)
    assert [p["s"] for p in series] == ["healthy", "down", "healthy"]
    assert series[0]["t"] == T0.isoformat()


@pytest.mark.parametrize("raw", ["unavailable", None, "", 5, "Healthy", "HEALTHY ", "ok", "unknown"])
def test_shape_status_series_maps_unrecognised_states_to_unknown(raw: Any) -> None:
    series = history_mod.shape_status_series([_state("healthy", 0), _state(raw, 1)])
    assert [p["s"] for p in series] == ["healthy", "unknown"]


def test_shape_status_series_keeps_the_four_valid_states() -> None:
    names = ["healthy", "degraded", "down", "unknown"]
    series = history_mod.shape_status_series([_state(n, i) for i, n in enumerate(names)])
    assert [p["s"] for p in series] == names


def test_shape_status_series_collapses_consecutive_mapped_duplicates() -> None:
    states = [_state("down", 0), _state("unavailable", 1), _state(None, 2), _state("unknown", 3), _state("down", 4)]
    assert [p["s"] for p in history_mod.shape_status_series(states)] == ["down", "unknown", "down"]


def test_shape_status_series_caps_to_latest_events() -> None:
    states = [_state("healthy" if i % 2 else "down", i) for i in range(2500)]
    series = history_mod.shape_status_series(states)
    assert len(series) == history_mod.MAX_STATUS_EVENTS == 1000
    assert series[-1]["t"] == states[-1].last_changed.isoformat()


def test_shape_latency_skips_non_numeric() -> None:
    states = [_state("100", 0), _state("unknown", 1), _state("unavailable", 2), _state("abc", 3),
              _state("nan", 4), _state("inf", 5), _state("250.5", 6)]
    assert history_mod.shape_latency_series(states, 500) == [
        {"t": T0.isoformat(), "ms": 100.0},
        {"t": (T0 + timedelta(minutes=6)).isoformat(), "ms": 250.5},
    ]


def test_downsample_keeps_spike_and_bounds_size() -> None:
    points = [{"t": str(i), "ms": 10.0} for i in range(2000)]
    points[1234]["ms"] = 9999.0
    out = history_mod.downsample_max(points, 500)
    assert len(out) <= 500
    assert any(p["ms"] == 9999.0 for p in out)
    assert [p["t"] for p in out] == sorted((p["t"] for p in out), key=int)


def test_downsample_small_series_unchanged() -> None:
    points = [{"t": "a", "ms": 1.0}, {"t": "b", "ms": 2.0}]
    assert history_mod.downsample_max(points, 500) == points


def test_shape_statistics_series() -> None:
    rows = [{"start": T0.timestamp(), "mean": 12.5}, {"start": T0.timestamp() + 3600, "mean": None},
            {"start": T0.timestamp() + 7200, "mean": 20}]
    assert history_mod.shape_statistics_series(rows, 500) == [
        {"t": T0.isoformat(), "ms": 12.5},
        {"t": (T0 + timedelta(hours=2)).isoformat(), "ms": 20.0},
    ]


# ---------------------------------------------------------------- history handler


class _FakeRecorder:
    async def async_add_executor_job(self, func: Any, *args: Any) -> Any:
        return func(*args)


async def _register_entities(hass: HomeAssistant) -> dict[str, str]:
    """Run the real platforms so the entity registry holds the real unique ids."""
    from homeassistant.helpers import entity_registry as er

    registry = er.async_get(hass)
    ids = {e.unique_id: e.entity_id for e in registry.entities.values() if e.platform == DOMAIN}
    return ids


async def test_history_24h_uses_detailed_states(hass: HomeAssistant, hass_ws_client: WebSocketGenerator) -> None:
    await _setup(hass)
    ids = await _register_entities(hass)
    status_id, latency_id = ids["e1_ajax_status"], ids["e1_alarmio_latency"]
    states = {
        status_id: [_state("healthy", 0), _state("healthy", 1), _state("down", 2)],
        latency_id: [_state("100", 0), _state("unknown", 1), _state("300", 2)],
    }
    client = await hass_ws_client(hass)
    with (
        patch(f"{WS}.get_instance", return_value=_FakeRecorder()),
        patch(f"{WS}.get_significant_states", return_value=states) as sig,
        patch(f"{WS}.statistics_during_period") as stats,
    ):
        reply = await _call(client, 1, "alarmio_health/history", range="24h")
    assert [p["s"] for p in reply["result"]["status"]["ajax"]] == ["healthy", "down"]
    assert [p["ms"] for p in reply["result"]["latency"]] == [100.0, 300.0]
    assert "warning" not in reply["result"]
    stats.assert_not_called()
    expected = {eid for uid, eid in ids.items() if uid.endswith(("_status", "_alarmio_latency"))}
    assert set(sig.call_args.args[3]) == expected  # only our own registry entities, never user input


@pytest.mark.parametrize("range_", ["7d", "30d"])
async def test_history_long_range_uses_hourly_statistics(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, range_: str
) -> None:
    await _setup(hass)
    ids = await _register_entities(hass)
    latency_id = ids["e1_alarmio_latency"]
    rows = {latency_id: [{"start": T0.timestamp(), "mean": 42.0}]}
    client = await hass_ws_client(hass)
    with (
        patch(f"{WS}.get_instance", return_value=_FakeRecorder()),
        patch(f"{WS}.get_significant_states", return_value={}),
        patch(f"{WS}.statistics_during_period", return_value=rows) as stats,
    ):
        reply = await _call(client, 1, "alarmio_health/history", range=range_)
    assert reply["result"]["latency"] == [{"t": T0.isoformat(), "ms": 42.0}]
    args = stats.call_args.args
    assert args[3] == {latency_id}
    assert args[4] == "hour"
    assert args[6] == {"mean"}


async def test_long_range_does_not_ask_for_latency_states(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    await _setup(hass)
    ids = await _register_entities(hass)
    latency_id = ids["e1_alarmio_latency"]
    client = await hass_ws_client(hass)
    with (
        patch(f"{WS}.get_instance", return_value=_FakeRecorder()),
        patch(f"{WS}.get_significant_states", return_value={}) as sig,
        patch(f"{WS}.statistics_during_period", return_value={}),
    ):
        await _call(client, 1, "alarmio_health/history", range="30d")
    wanted = set(sig.call_args.args[3])
    assert latency_id not in wanted
    assert wanted  # the status entities are still asked for


async def test_history_without_registered_entities_makes_no_recorder_call(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    from homeassistant.helpers import entity_registry as er

    await _setup(hass)
    registry = er.async_get(hass)
    for entity in [e for e in registry.entities.values() if e.platform == DOMAIN]:
        registry.async_remove(entity.entity_id)
    client = await hass_ws_client(hass)
    with (
        patch(f"{WS}.get_instance", side_effect=AssertionError("recorder used")),
        patch(f"{WS}.get_significant_states", side_effect=AssertionError("recorder used")),
        patch(f"{WS}.statistics_during_period", side_effect=AssertionError("recorder used")),
    ):
        reply = await _call(client, 1, "alarmio_health/history", range="24h")
    assert reply["success"]
    assert reply["result"] == {"status": {}, "latency": []}


@pytest.mark.parametrize("failing", ["get_instance", "get_significant_states", "statistics_during_period"])
async def test_history_unavailable_when_recorder_fails(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, caplog: pytest.LogCaptureFixture, failing: str
) -> None:
    await _setup(hass)
    client = await hass_ws_client(hass)
    patches = {
        "get_instance": patch(f"{WS}.get_instance", return_value=_FakeRecorder()),
        "get_significant_states": patch(f"{WS}.get_significant_states", return_value={}),
        "statistics_during_period": patch(f"{WS}.statistics_during_period", return_value={}),
    }
    patches[failing] = patch(f"{WS}.{failing}", side_effect=KeyError("db-secret"))
    with patches["get_instance"], patches["get_significant_states"], patches["statistics_during_period"]:
        reply = await _call(client, 1, "alarmio_health/history", range="7d")
    assert reply["success"]
    assert reply["result"] == {"status": {}, "latency": [], "warning": "history_unavailable"}
    assert "db-secret" not in caplog.text


# ---------------------------------------------------------------- secrets


async def test_token_never_in_replies_or_logs(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, clock: Any, caplog: pytest.LogCaptureFixture
) -> None:
    caplog.set_level(logging.DEBUG)
    entry = await _setup(hass, {CONF_SHARE_DIAGNOSTICS: True})
    adapter = entry.runtime_data.adapter
    client = await hass_ws_client(hass)
    with (
        patch.object(adapter, "session_token", return_value="tok-secret"),
        patch.object(adapter, "async_refresh_foxace", return_value=(True, 10.0)),
        patch(f"{WS}.get_instance", return_value=_FakeRecorder()),
        patch(f"{WS}.get_significant_states", return_value={}),
        patch(f"{WS}.statistics_during_period", return_value={}),
    ):
        replies = [
            await _call(client, 1, "alarmio_health/summary"),
            await _call(client, 2, "alarmio_health/incidents"),
            await _call(client, 3, "alarmio_health/history", range="24h"),
            await _call(client, 4, "alarmio_health/run_e2e_test"),
        ]
        await entry.runtime_data.async_refresh()
    assert all(r["success"] for r in replies)
    assert "tok-secret" not in str(replies)
    assert "tok-secret" not in caplog.text



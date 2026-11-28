"""Entity tests."""

from datetime import UTC, datetime
from unittest.mock import patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.alarmio_health.const import DOMAIN, PROBES
from custom_components.alarmio_health.models import ProbeResult, Status

PANEL = "custom_components.alarmio_health.panel.async_register_panel"
NOW = datetime(2026, 1, 1, tzinfo=UTC)


async def _setup(hass: HomeAssistant, options: dict | None = None) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, data={}, entry_id="e1", options=options or {})
    entry.add_to_hass(hass)
    with patch(PANEL):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    return entry


def _eid(hass: HomeAssistant, platform: str, unique_id: str) -> str:
    entity_id = er.async_get(hass).async_get_entity_id(platform, DOMAIN, unique_id)
    assert entity_id
    return entity_id


def _result(probe: str, status: Status, latency: float | None = None, detail: str = "") -> ProbeResult:
    return ProbeResult(probe, status, NOW, latency, detail)


async def _push(hass: HomeAssistant, entry: MockConfigEntry, **results: ProbeResult) -> None:
    coordinator = entry.runtime_data
    coordinator.async_set_updated_data({**coordinator.data, **results})
    await hass.async_block_till_done()


async def test_entities_are_registered_with_stable_unique_ids(hass: HomeAssistant) -> None:
    await _setup(hass)
    registry = er.async_get(hass)
    expected = {
        *(("sensor", f"e1_{p}_status") for p in PROBES),
        ("sensor", "e1_alarmio_latency"),
        *(("binary_sensor", f"e1_{p}_problem") for p in PROBES),
        ("switch", "e1_share_diagnostics"),
    }
    actual = {(e.domain, e.unique_id) for e in registry.entities.values() if e.platform == DOMAIN}
    assert actual == expected
    assert len(expected) == 20
    entity_ids = [e.entity_id for e in registry.entities.values() if e.platform == DOMAIN]
    assert len(set(entity_ids)) == 20
    assert "sensor.alarmio_health_alarmio_reachability" in entity_ids
    assert "binary_sensor.alarmio_health_event_stream_problem" in entity_ids
    assert "switch.alarmio_health_share_diagnostics_with_alarmio" in entity_ids


async def test_entity_categories_and_device(hass: HomeAssistant) -> None:
    await _setup(hass)
    registry = er.async_get(hass)
    for p in PROBES:
        assert registry.async_get(_eid(hass, "binary_sensor", f"e1_{p}_problem")).entity_category == "diagnostic"
        assert registry.async_get(_eid(hass, "sensor", f"e1_{p}_status")).entity_category is None
    assert registry.async_get(_eid(hass, "sensor", "e1_alarmio_latency")).entity_category is None
    assert registry.async_get(_eid(hass, "switch", "e1_share_diagnostics")).entity_category == "config"


async def test_status_sensor_value_and_detail(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    entity_id = _eid(hass, "sensor", "e1_stream_status")
    await _push(hass, entry, stream=_result("stream", Status.DEGRADED, detail="Stale"))
    state = hass.states.get(entity_id)
    assert state.state == "degraded"
    assert state.attributes["detail"] == "Stale"


async def test_status_detail_is_truncated_and_passed_through(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    entity_id = _eid(hass, "sensor", "e1_stream_status")
    await _push(hass, entry, stream=_result("stream", Status.DOWN, detail="x" * 1000))
    assert hass.states.get(entity_id).attributes["detail"] == "x" * 255
    await _push(hass, entry, stream=_result("stream", Status.DOWN, detail="tok-secret"))
    assert hass.states.get(entity_id).attributes["detail"] == "tok-secret"  # protection is upstream


async def test_status_sensor_unknown_when_data_missing(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    entry.runtime_data.async_set_updated_data({})
    await hass.async_block_till_done()
    state = hass.states.get(_eid(hass, "sensor", "e1_stream_status"))
    assert state.state == "unknown"
    assert "detail" not in state.attributes
    assert hass.states.get(_eid(hass, "binary_sensor", "e1_stream_problem")).state == "unknown"
    assert hass.states.get(_eid(hass, "sensor", "e1_alarmio_latency")).state == "unknown"


async def test_latency_rounding_and_none(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    entity_id = _eid(hass, "sensor", "e1_alarmio_latency")
    await _push(hass, entry, alarmio=_result("alarmio", Status.HEALTHY, latency=123.456))
    assert hass.states.get(entity_id).state == "123.5"
    await _push(hass, entry, alarmio=_result("alarmio", Status.DOWN, latency=None))
    assert hass.states.get(entity_id).state == "unknown"


@pytest.mark.parametrize(
    ("status", "expected"),
    [(Status.DOWN, "on"), (Status.DEGRADED, "off"), (Status.HEALTHY, "off"), (Status.UNKNOWN, "unknown")],
)
async def test_problem_sensor_mapping(hass: HomeAssistant, status: Status, expected: str) -> None:
    entry = await _setup(hass)
    await _push(hass, entry, tls=_result("tls", status))
    assert hass.states.get(_eid(hass, "binary_sensor", "e1_tls_problem")).state == expected


async def test_switch_default_off_and_persists_choice(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    entity_id = _eid(hass, "switch", "e1_share_diagnostics")
    assert hass.states.get(entity_id).state == "off"
    await hass.services.async_call("switch", "turn_on", {"entity_id": entity_id}, blocking=True)
    assert hass.states.get(entity_id).state == "on"
    assert entry.options["share_diagnostics"] is True
    assert entry.runtime_data.share_diagnostics is True


async def test_switch_repeated_toggles_without_reload(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    coordinator = entry.runtime_data
    entity_id = _eid(hass, "switch", "e1_share_diagnostics")
    for service, state, value in (("turn_on", "on", True), ("turn_off", "off", False), ("turn_on", "on", True)):
        await hass.services.async_call("switch", service, {"entity_id": entity_id}, blocking=True)
        await hass.async_block_till_done()
        assert hass.states.get(entity_id).state == state
        assert entry.options["share_diagnostics"] is value
        assert coordinator.share_diagnostics is value
        assert entry.runtime_data is coordinator  # entry was not reloaded


async def test_switch_restores_on_after_restart(hass: HomeAssistant) -> None:
    await _setup(hass, options={"share_diagnostics": True})
    assert hass.states.get(_eid(hass, "switch", "e1_share_diagnostics")).state == "on"


async def test_entities_stay_available_when_update_failed(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    entry.runtime_data.last_update_success = False
    entry.runtime_data.async_update_listeners()
    await hass.async_block_till_done()
    registry = er.async_get(hass)
    for entity in [e for e in registry.entities.values() if e.platform == DOMAIN]:
        assert hass.states.get(entity.entity_id).state != "unavailable"


async def test_only_the_foxace_status_sensor_is_deprecated(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    await _push(hass, entry, foxace=_result("foxace", Status.HEALTHY, detail="ok"))
    foxace = hass.states.get(_eid(hass, "sensor", "e1_foxace_status"))
    assert foxace.attributes["detail"] == "ok"
    assert "Will be removed in a later version" in foxace.attributes["deprecated"]
    entry.runtime_data.async_set_updated_data({})
    await hass.async_block_till_done()
    assert "deprecated" in hass.states.get(_eid(hass, "sensor", "e1_foxace_status")).attributes
    for probe in PROBES:
        if probe != "foxace":
            assert "deprecated" not in hass.states.get(_eid(hass, "sensor", f"e1_{probe}_status")).attributes

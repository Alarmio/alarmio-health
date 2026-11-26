"""Setup and unload tests."""

import logging
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.alarmio_health.const import DOMAIN, PROBES
from custom_components.alarmio_health.models import Status

PANEL = "custom_components.alarmio_health.panel.async_register_panel"


async def test_setup_and_unload(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    with patch(PANEL):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED
    assert await hass.config_entries.async_unload(entry.entry_id)


async def test_setup_without_foxace_installed(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    with patch(PANEL):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED
    data = entry.runtime_data.data
    assert set(data) == set(PROBES)
    assert data["alarmio"].status is Status.UNKNOWN
    assert all(r.status is not Status.HEALTHY for r in data.values())


async def test_unload_then_setup_again(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    with patch(PANEL):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
        assert await hass.config_entries.async_unload(entry.entry_id)
        assert entry.state is ConfigEntryState.NOT_LOADED
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED


async def test_setup_quietens_http_loggers(hass: HomeAssistant) -> None:
    logging.getLogger("httpx").setLevel(logging.INFO)
    logging.getLogger("httpx2").setLevel(logging.INFO)
    logging.getLogger("httpcore2").setLevel(logging.INFO)
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    with patch(PANEL):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    assert logging.getLogger("httpx").level == logging.WARNING
    assert logging.getLogger("httpcore").level == logging.WARNING
    # HA 2026.11+ ships httpx2/httpcore2, which log request URLs under these names.
    assert logging.getLogger("httpx2").level == logging.WARNING
    assert logging.getLogger("httpcore2").level == logging.WARNING


STORE_LOAD = "custom_components.alarmio_health.Store.async_load"
VALID = {"id": "a", "probe": "stream", "opened_at": "2026-11-01T10:00:00+00:00", "detail": "d", "closed_at": None}


async def _setup(hass: HomeAssistant, loaded: object = None, exc: Exception | None = None) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    load = AsyncMock(side_effect=exc) if exc else AsyncMock(return_value=loaded)
    with patch(PANEL), patch(STORE_LOAD, load):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED
    return entry


@pytest.mark.parametrize(
    "loaded",
    [None, [1, 2], "garbage", {}, {"incidents": 5}, {"incidents": "abc"}],
)
async def test_setup_survives_bad_store_value(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture, loaded: object
) -> None:
    with caplog.at_level(logging.WARNING):
        entry = await _setup(hass, loaded)
    assert entry.runtime_data.tracker.incidents == []
    assert "garbage" not in caplog.text


@pytest.mark.parametrize("loaded", [[1], "garbage", {"incidents": 5}])
async def test_bad_store_warns_with_class_name(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture, loaded: object
) -> None:
    with caplog.at_level(logging.WARNING):
        await _setup(hass, loaded)
    assert any(r.levelno == logging.WARNING and "alarmio_health" in r.name for r in caplog.records)


async def test_store_load_oserror_falls_back_to_fresh_tracker(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    with caplog.at_level(logging.WARNING):
        entry = await _setup(hass, exc=OSError("secret path"))
    assert entry.runtime_data.tracker.incidents == []
    assert "OSError" in caplog.text
    assert "secret" not in caplog.text


@pytest.mark.parametrize(
    "bad",
    [
        {"probe": "stream", "opened_at": VALID["opened_at"]},
        {"id": "b", "opened_at": VALID["opened_at"]},
        {"id": "b", "probe": "stream"},
        {"id": "b", "probe": "stream", "opened_at": "not-a-date"},
        "not-a-dict",
    ],
)
async def test_one_bad_incident_is_skipped_and_valid_kept(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture, bad: object
) -> None:
    with caplog.at_level(logging.WARNING):
        entry = await _setup(hass, {"incidents": [VALID, bad]})
    assert [i.id for i in entry.runtime_data.tracker.incidents] == ["a"]
    assert caplog.text.count("skipped") == 1
    assert "not-a-date" not in caplog.text


async def test_panel_failure_does_not_break_setup(hass: HomeAssistant, caplog: pytest.LogCaptureFixture) -> None:
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    with caplog.at_level(logging.WARNING), patch(PANEL, AsyncMock(side_effect=KeyError("secret"))):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED
    assert caplog.text.count("KeyError") == 1
    assert "secret" not in caplog.text

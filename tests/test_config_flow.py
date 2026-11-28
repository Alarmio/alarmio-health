"""Config flow tests."""

from unittest.mock import patch

from homeassistant.config_entries import SOURCE_USER
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.alarmio_health.const import DOMAIN


async def test_user_step_shows_form(hass: HomeAssistant) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"


async def test_submit_creates_entry(hass: HomeAssistant) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Alarmio Health"


async def test_second_flow_aborts(hass: HomeAssistant) -> None:
    MockConfigEntry(domain=DOMAIN, data={}).add_to_hass(hass)
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "single_instance_allowed"


async def test_options_flow_saves_and_keeps_share_diagnostics(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(domain=DOMAIN, data={}, options={"share_diagnostics": True})
    entry.add_to_hass(hass)
    with patch("custom_components.alarmio_health.async_setup_entry", return_value=True):
        result = await hass.config_entries.options.async_init(entry.entry_id)
        assert result["type"] is FlowResultType.FORM and result["step_id"] == "init"
        result = await hass.config_entries.options.async_configure(
            result["flow_id"], {"gateway": "10.0.0.1", "anchor_host": "9.9.9.9", "anchor_enabled": False}
        )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert entry.options == {
        "share_diagnostics": True,
        "gateway": "10.0.0.1",
        "anchor_host": "9.9.9.9",
        "anchor_enabled": False,
    }


async def test_options_flow_rejects_a_url_and_empty_anchor_falls_back(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    with patch("custom_components.alarmio_health.async_setup_entry", return_value=True):
        result = await hass.config_entries.options.async_init(entry.entry_id)
        bad = await hass.config_entries.options.async_configure(
            result["flow_id"], {"gateway": "http://router", "anchor_host": "1.1.1.1", "anchor_enabled": True}
        )
        assert bad["type"] is FlowResultType.FORM and bad["errors"] == {"gateway": "invalid_host"}
        ok = await hass.config_entries.options.async_configure(
            bad["flow_id"], {"gateway": "", "anchor_host": "", "anchor_enabled": True}
        )
    assert ok["type"] is FlowResultType.CREATE_ENTRY
    assert entry.options["gateway"] == "" and entry.options["anchor_host"] == "1.1.1.1"


async def test_options_flow_rejects_a_bad_anchor_host(hass) -> None:
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    with patch("custom_components.alarmio_health.async_setup_entry", return_value=True):
        result = await hass.config_entries.options.async_init(entry.entry_id)
        bad = await hass.config_entries.options.async_configure(
            result["flow_id"], {"gateway": "", "anchor_host": "1.1.1.1:443", "anchor_enabled": True}
        )
    assert bad["type"] == "form" and bad["errors"] == {"anchor_host": "invalid_host"}
    assert "anchor_host" not in entry.options

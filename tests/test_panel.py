"""Panel registration tests: the real frontend and http are replaced by mocks."""

import logging
from collections.abc import Iterator
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.alarmio_health import panel
from custom_components.alarmio_health.const import DOMAIN, VERSION

P = "custom_components.alarmio_health.panel"


@pytest.fixture
def mocks(hass: HomeAssistant, tmp_path: Path) -> Iterator[dict[str, MagicMock]]:
    """Mock out http, panel_custom and frontend removal; serve from an existing www dir."""
    hass.http = MagicMock(async_register_static_paths=AsyncMock())
    www = tmp_path / "www"
    www.mkdir()
    (www / "panel.js").write_text("// built")
    with (
        patch(f"{P}.WWW_DIR", www),
        patch(f"{P}.panel_custom.async_register_panel", new_callable=AsyncMock) as register,
        patch(f"{P}.frontend.async_remove_panel") as remove,
    ):
        yield {"register": register, "remove": remove, "static": hass.http.async_register_static_paths}


async def test_register_is_idempotent(hass: HomeAssistant, mocks: dict[str, MagicMock]) -> None:
    await panel.async_register_panel(hass)
    await panel.async_register_panel(hass)
    mocks["register"].assert_awaited_once()
    mocks["static"].assert_awaited_once()


async def test_register_arguments(hass: HomeAssistant, mocks: dict[str, MagicMock]) -> None:
    await panel.async_register_panel(hass)
    kwargs = mocks["register"].call_args.kwargs
    assert kwargs["webcomponent_name"] == "alarmio-health-panel"
    assert kwargs["frontend_url_path"] == "alarmio-health"
    assert kwargs["module_url"] == f"/alarmio_health_static/panel.js?v={VERSION}"
    assert kwargs["sidebar_title"] == "Alarmio Health"
    assert kwargs["sidebar_icon"] == "mdi:heart-pulse"
    assert kwargs["require_admin"] is False
    config = mocks["static"].call_args.args[0][0]
    assert config.url_path == "/alarmio_health_static"


async def test_unregister_clears_flag_and_allows_reregistration(
    hass: HomeAssistant, mocks: dict[str, MagicMock]
) -> None:
    await panel.async_register_panel(hass)
    await panel.async_unregister_panel(hass)
    mocks["remove"].assert_called_once()
    assert mocks["remove"].call_args.args[1] == "alarmio-health"
    await panel.async_register_panel(hass)
    assert mocks["register"].await_count == 2
    mocks["static"].assert_awaited_once()  # a URL may only be registered once per hass


async def test_unregister_without_register_is_noop(hass: HomeAssistant, mocks: dict[str, MagicMock]) -> None:
    await panel.async_unregister_panel(hass)
    mocks["remove"].assert_not_called()


async def test_unregister_failure_is_logged_by_class_only(
    hass: HomeAssistant, mocks: dict[str, MagicMock], caplog: pytest.LogCaptureFixture
) -> None:
    await panel.async_register_panel(hass)
    mocks["remove"].side_effect = RuntimeError("secret-detail")
    await panel.async_unregister_panel(hass)
    assert "RuntimeError" in caplog.text
    assert "secret-detail" not in caplog.text
    await panel.async_register_panel(hass)  # flag was cleared regardless
    assert mocks["register"].await_count == 2


async def test_missing_panel_js_skips_registration_and_warns_once(
    hass: HomeAssistant, mocks: dict[str, MagicMock], tmp_path: Path, caplog: pytest.LogCaptureFixture
) -> None:
    missing = tmp_path / "nested" / "www"
    with (
        patch(f"{P}.WWW_DIR", missing),
        patch.object(Path, "mkdir", side_effect=AssertionError("must not create directories")),
        caplog.at_level(logging.WARNING),
    ):
        await panel.async_register_panel(hass)
        await panel.async_register_panel(hass)
    assert not missing.exists()
    mocks["static"].assert_not_awaited()
    mocks["register"].assert_not_awaited()
    warnings = [r for r in caplog.records if r.levelno == logging.WARNING and r.name == panel.__name__]
    assert len(warnings) == 1
    assert "frontend files are missing" in warnings[0].getMessage()


async def test_unload_last_entry_unregisters_panel(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    with (
        patch(f"{P}.async_register_panel", new_callable=AsyncMock),
        patch(f"{P}.async_unregister_panel", new_callable=AsyncMock) as unregister,
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
        assert await hass.config_entries.async_unload(entry.entry_id)
    unregister.assert_awaited_once()
    assert entry.state is ConfigEntryState.NOT_LOADED


async def test_unregister_error_never_blocks_unload(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    with (
        patch(f"{P}.async_register_panel", new_callable=AsyncMock),
        patch(f"{P}.async_unregister_panel", new_callable=AsyncMock, side_effect=RuntimeError("x")),
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
        assert await hass.config_entries.async_unload(entry.entry_id)

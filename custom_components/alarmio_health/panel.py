"""Registers the sidebar panel and serves the built frontend."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import DOMAIN, VERSION

_LOGGER = logging.getLogger(__name__)

STATIC_URL = "/alarmio_health_static"
PANEL_PATH = "alarmio-health"
WWW_DIR = Path(__file__).parent / "www"
_PANEL_KEY = f"{DOMAIN}_panel"
_STATIC_KEY = f"{DOMAIN}_static"
_MISSING_KEY = f"{DOMAIN}_frontend_missing"


async def _register_static(hass: HomeAssistant) -> None:
    """Serve www/ once per hass (HA raises on a duplicate URL)."""
    if hass.data.get(_STATIC_KEY):
        return
    await hass.http.async_register_static_paths([StaticPathConfig(STATIC_URL, str(WWW_DIR), cache_headers=False)])
    hass.data[_STATIC_KEY] = True


async def async_register_panel(hass: HomeAssistant) -> None:
    """Idempotent: safe if the entry reloads. Skipped (one warning) when the built frontend is missing."""
    if hass.data.get(_PANEL_KEY):
        return
    if not await hass.async_add_executor_job((WWW_DIR / "panel.js").is_file):
        if not hass.data.get(_MISSING_KEY):
            hass.data[_MISSING_KEY] = True
            _LOGGER.warning("Alarmio Health frontend files are missing; the sidebar panel was not registered")
        return
    hass.data.pop(_MISSING_KEY, None)
    await _register_static(hass)
    await panel_custom.async_register_panel(
        hass,
        webcomponent_name="alarmio-health-panel",
        frontend_url_path=PANEL_PATH,
        module_url=f"{STATIC_URL}/panel.js?v={VERSION}",
        sidebar_title="Alarmio Health",
        sidebar_icon="mdi:heart-pulse",
        require_admin=False,
    )
    hass.data[_PANEL_KEY] = True


async def async_unregister_panel(hass: HomeAssistant) -> None:
    """Remove the sidebar panel; never raises, so it cannot block an unload."""
    if not hass.data.pop(_PANEL_KEY, False):
        return
    try:
        frontend.async_remove_panel(hass, PANEL_PATH)
    except Exception as err:  # noqa: BLE001 - class name only
        _LOGGER.warning("Alarmio Health panel removal failed (%s)", type(err).__name__)

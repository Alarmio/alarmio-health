"""Alarmio Health: health checks for the Ajax, Alarmio and foXaCe chain."""

from __future__ import annotations

import logging

import httpx
from homeassistant.config_entries import ConfigEntry, ConfigEntryState
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.httpx_client import get_async_client
from homeassistant.helpers.storage import Store

from .const import DOMAIN, STORE_KEY, STORE_VERSION
from .coordinator import AlarmioHealthCoordinator
from .foxace_adapter import FoxaceAdapter
from .heartbeat import HeartbeatClient
from .incidents import IncidentTracker

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [Platform.SENSOR, Platform.BINARY_SENSOR, Platform.SWITCH]

type AlarmioHealthEntry = ConfigEntry[AlarmioHealthCoordinator]


async def _restore_tracker(store: Store) -> IncidentTracker:
    """Load saved incidents; any corrupt or unreadable store yields a fresh (or partly restored) tracker."""
    try:
        saved = await store.async_load()
        if not isinstance(saved, dict):
            if saved is not None:
                _LOGGER.warning("Alarmio Health stored incidents ignored (%s); starting fresh", type(saved).__name__)
            return IncidentTracker()
        tracker = IncidentTracker.from_dict(saved, lenient=True)
    except Exception as err:  # noqa: BLE001 - corrupt data must never block setup
        _LOGGER.warning("Alarmio Health could not restore incidents (%s); starting fresh", type(err).__name__)
        return IncidentTracker()
    if tracker.skipped:
        _LOGGER.warning("Alarmio Health skipped %d unreadable stored incident(s)", tracker.skipped)
    return tracker


async def async_setup_entry(hass: HomeAssistant, entry: AlarmioHealthEntry) -> bool:
    """Create the coordinator, run the first probe cycle and set up platforms and panel."""
    # httpx logs full request URLs at INFO, which would expose the Alarmio proxy URL. Home Assistant 2026.11+
    # uses httpx2/httpcore2, which log under their own names (httpx is only an import alias there).
    for name in ("httpx", "httpcore", "httpx2", "httpcore2"):
        logging.getLogger(name).setLevel(logging.WARNING)
    http: httpx.AsyncClient = get_async_client(hass)  # owned by Home Assistant: never closed here
    store: Store = Store(hass, STORE_VERSION, STORE_KEY)
    tracker = await _restore_tracker(store)
    coordinator = AlarmioHealthCoordinator(
        hass, entry, http, FoxaceAdapter(hass), tracker, store, HeartbeatClient(http)
    )
    await coordinator.async_config_entry_first_refresh()
    entry.runtime_data = coordinator
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    from .panel import async_register_panel  # imported here: needs http and frontend
    from .websocket import async_register_commands

    try:
        await async_register_panel(hass)
    except Exception as err:  # noqa: BLE001 - probes and entities still work without the panel
        _LOGGER.warning("Alarmio Health panel registration failed (%s); continuing without it", type(err).__name__)
    try:
        async_register_commands(hass)
    except Exception as err:  # noqa: BLE001 - the panel is optional; probes and entities keep working
        _LOGGER.warning("Alarmio Health websocket registration failed (%s); continuing without it", type(err).__name__)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: AlarmioHealthEntry) -> bool:
    """Detach from foXaCe and unload the platforms."""
    entry.runtime_data.adapter.async_unload()
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    others = [
        e for e in hass.config_entries.async_entries(DOMAIN) if e is not entry and e.state is ConfigEntryState.LOADED
    ]
    if unloaded and not others:
        from .panel import async_unregister_panel

        try:
            await async_unregister_panel(hass)
        except Exception as err:  # noqa: BLE001 - must never block unload
            _LOGGER.warning("Alarmio Health panel removal failed (%s)", type(err).__name__)
    return unloaded

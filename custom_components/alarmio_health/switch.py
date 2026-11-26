"""The visible 'Share diagnostics' switch."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import EntityCategory
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import AlarmioHealthEntry
from .const import CONF_SHARE_DIAGNOSTICS
from .entity import HealthEntity


async def async_setup_entry(
    hass: HomeAssistant, entry: AlarmioHealthEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up the diagnostics-sharing switch."""
    async_add_entities([ShareDiagnosticsSwitch(hass, entry)])


class ShareDiagnosticsSwitch(HealthEntity, SwitchEntity):
    """Opt-in switch; state lives in the coordinator and the entry options."""

    _attr_name = "Share diagnostics with Alarmio"
    _attr_icon = "mdi:share-variant"
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, hass: HomeAssistant, entry: AlarmioHealthEntry) -> None:
        """Create the switch."""
        super().__init__(entry.runtime_data, entry.entry_id)
        self._hass = hass
        self._entry = entry
        self._attr_unique_id = f"{entry.entry_id}_share_diagnostics"

    @property
    def is_on(self) -> bool:
        """Return whether diagnostics sharing is enabled."""
        return self.coordinator.share_diagnostics

    async def _set(self, value: bool) -> None:
        """Apply the choice to the coordinator and persist it in the entry options."""
        self.coordinator.share_diagnostics = value
        self._hass.config_entries.async_update_entry(
            self._entry, options={**self._entry.options, CONF_SHARE_DIAGNOSTICS: value}
        )
        self.async_write_ha_state()

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable sharing."""
        await self._set(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable sharing."""
        await self._set(False)

"""Problem binary sensors (on when a probe is down)."""

from __future__ import annotations

from homeassistant.components.binary_sensor import BinarySensorDeviceClass, BinarySensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import EntityCategory
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import AlarmioHealthEntry
from .const import PROBE_TITLES, PROBES
from .coordinator import AlarmioHealthCoordinator
from .entity import HealthEntity
from .models import Status


async def async_setup_entry(
    hass: HomeAssistant, entry: AlarmioHealthEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up one problem binary sensor per probe."""
    async_add_entities(ProblemSensor(entry.runtime_data, entry.entry_id, p) for p in PROBES)


class ProblemSensor(HealthEntity, BinarySensorEntity):
    """On when a probe is down; unknown when there is no usable data."""

    _attr_device_class = BinarySensorDeviceClass.PROBLEM
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, coordinator: AlarmioHealthCoordinator, entry_id: str, probe: str) -> None:
        """Create the problem sensor for a probe."""
        super().__init__(coordinator, entry_id)
        self._probe = probe
        self._attr_unique_id = f"{entry_id}_{probe}_problem"
        self._attr_name = f"{PROBE_TITLES[probe]} problem"

    @property
    def is_on(self) -> bool | None:
        """Return True only for down; None for unknown or missing data."""
        result = self._result(self._probe)
        if result is None or result.status is Status.UNKNOWN:
            return None
        return result.status is Status.DOWN

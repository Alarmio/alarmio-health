"""Status and latency sensors."""

from __future__ import annotations

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity, SensorStateClass
from homeassistant.const import UnitOfTime
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import AlarmioHealthEntry
from .const import PROBE_TITLES, PROBES
from .coordinator import AlarmioHealthCoordinator
from .entity import MAX_DETAIL_LENGTH, HealthEntity
from .models import Status


async def async_setup_entry(
    hass: HomeAssistant, entry: AlarmioHealthEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up one status sensor per probe plus the Alarmio latency sensor."""
    coordinator = entry.runtime_data
    entities: list[SensorEntity] = [StatusSensor(coordinator, entry.entry_id, p) for p in PROBES]
    entities.append(LatencySensor(coordinator, entry.entry_id))
    async_add_entities(entities)


class StatusSensor(HealthEntity, SensorEntity):
    """Health status of one probe."""

    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = [s.value for s in Status]

    def __init__(self, coordinator: AlarmioHealthCoordinator, entry_id: str, probe: str) -> None:
        """Create the status sensor for a probe."""
        super().__init__(coordinator, entry_id)
        self._probe = probe
        self._attr_unique_id = f"{entry_id}_{probe}_status"
        self._attr_name = PROBE_TITLES[probe]

    @property
    def native_value(self) -> str | None:
        """Return the probe status, or None when there is no data."""
        result = self._result(self._probe)
        return result.status.value if result else None

    @property
    def extra_state_attributes(self) -> dict[str, str]:
        """Return the (length-bounded) probe detail."""
        result = self._result(self._probe)
        return {"detail": result.detail[:MAX_DETAIL_LENGTH]} if result else {}


class LatencySensor(HealthEntity, SensorEntity):
    """Round-trip time to the Alarmio proxy."""

    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = UnitOfTime.MILLISECONDS
    _attr_device_class = SensorDeviceClass.DURATION
    _attr_name = "Alarmio latency"

    def __init__(self, coordinator: AlarmioHealthCoordinator, entry_id: str) -> None:
        """Create the latency sensor."""
        super().__init__(coordinator, entry_id)
        self._attr_unique_id = f"{entry_id}_alarmio_latency"

    @property
    def native_value(self) -> float | None:
        """Return the latency in ms (1 decimal), or None when unknown."""
        result = self._result("alarmio")
        return round(result.latency_ms, 1) if result and result.latency_ms is not None else None

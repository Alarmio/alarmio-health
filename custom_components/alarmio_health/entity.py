"""Shared base entity."""

from __future__ import annotations

from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import AlarmioHealthCoordinator
from .models import ProbeResult

MAX_DETAIL_LENGTH = 255


class HealthEntity(CoordinatorEntity[AlarmioHealthCoordinator]):
    """Base for all Alarmio Health entities: one service device, always available."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, coordinator: AlarmioHealthCoordinator, entry_id: str) -> None:
        """Attach the entity to the shared device."""
        super().__init__(coordinator)
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry_id)}, name="Alarmio Health", entry_type=DeviceEntryType.SERVICE
        )

    @property
    def available(self) -> bool:
        """Stay available: an unavailable monitor entity would hide the problem it reports."""
        return True

    def _result(self, probe: str) -> ProbeResult | None:
        """Return the latest result for a probe, or None when there is no data for it."""
        return (self.coordinator.data or {}).get(probe)

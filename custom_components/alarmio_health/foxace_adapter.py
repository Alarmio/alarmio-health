"""The only module that reads foXaCe internals. Read-only.

foXaCe's api and coordinator are mixin compositions that change between releases;
tests/test_foxace_contract.py pins the names used here.
"""

from __future__ import annotations

import asyncio
import logging
import time
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration
from homeassistant.util import dt as dt_util

from .models import DeviceHealth, FoxaceSnapshot

_LOGGER = logging.getLogger(__name__)

FOXACE_DOMAIN = "ajax"
TESTED_VERSIONS = ("0.38.", "0.39.")
REFRESH_TIMEOUT_S = 20.0
ARMED_STATES = frozenset({"ARMED", "NIGHT_MODE", "PARTIALLY_ARMED"})


_REQUIRED = ("name", "online", "malfunctions", "battery_level", "signal_strength")


_MISSING: Any = object()


def _device_health(d: Any) -> DeviceHealth | None:
    """Build DeviceHealth; None only if the device genuinely lacks an expected attribute.

    Any other failure (a property raising, an odd value) propagates so the caller reports
    a minimal snapshot instead of a partial device list.
    """
    values = [getattr(d, a, _MISSING) for a in _REQUIRED]
    if any(v is _MISSING for v in values):
        return None
    name, online, malfunctions, battery, signal = values
    return DeviceHealth(name, bool(online), int(malfunctions or 0), battery, signal)


class FoxaceAdapter:
    """Produces FoxaceSnapshot objects from the live foXaCe coordinator."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._last_update: datetime | None = None
        self._listening_since: datetime | None = None
        self._listening_to: Any = None
        self._unsub: Any = None
        self._warned: set[str] = set()

    def _warn_once(self, key: str, what: str, err: Exception) -> None:
        """WARNING (class name only) the first time `key` fails; again after it recovers."""
        if key in self._warned:
            return
        self._warned.add(key)
        _LOGGER.warning("Could not read foXaCe %s (%s)", what, type(err).__name__)

    def _attr(self, obj: Any, name: str, default: Any = None) -> Any:
        """getattr that swallows any failure (warn once per attribute name, class name only)."""
        try:
            value = getattr(obj, name, default)
        except Exception as err:  # noqa: BLE001 - must never raise
            self._warn_once(name, f"attribute {name}", err)
            return default
        self._warned.discard(name)
        return value

    def _update_ok(self, coordinator: Any) -> bool:
        """coordinator.last_update_success as a bool; False (warn once) if reading it fails."""
        try:
            value = bool(getattr(coordinator, "last_update_success", False))
        except Exception as err:  # noqa: BLE001 - must never raise
            self._warn_once("last_update_success", "attribute last_update_success", err)
            return False
        self._warned.discard("last_update_success")
        return value

    def _version_info(self, version: Any) -> tuple[str | None, bool]:
        """Return (version string, tested?) without ever raising."""
        try:
            version_str = str(version) if version else None
            tested = version_str is not None and version_str.startswith(TESTED_VERSIONS)
        except Exception as err:  # noqa: BLE001 - must never raise
            self._warn_once("version_info", "version", err)
            return None, False
        self._warned.discard("version_info")
        return version_str, tested

    def _coordinator(self) -> Any | None:
        try:
            for entry in self._hass.config_entries.async_entries(FOXACE_DOMAIN):
                coordinator = getattr(entry, "runtime_data", None)
                if coordinator is not None:
                    self._warned.discard("coordinator")
                    return coordinator
        except Exception as err:  # noqa: BLE001 - treat as absent
            self._warn_once("coordinator", "config entry", err)
            return None
        self._warned.discard("coordinator")
        return None

    def _on_update(self) -> None:
        self._last_update = dt_util.utcnow()

    def _release(self) -> None:
        """Call the stored unsubscribe (if any) and always clear listener state."""
        unsub, self._unsub, self._listening_to = self._unsub, None, None
        if unsub is None:
            return
        try:
            unsub()
        except Exception as err:  # noqa: BLE001 - must never raise
            _LOGGER.debug("foXaCe listener unsubscribe failed (%s)", type(err).__name__)

    def _ensure_listener(self, coordinator: Any, now: datetime) -> None:
        if self._listening_to is coordinator:
            return
        self._release()
        self._last_update = None
        self._listening_since = None
        self._unsub = coordinator.async_add_listener(self._on_update)
        self._listening_to = coordinator
        self._listening_since = now

    def session_token(self) -> str | None:
        """foXaCe's current Alarmio session token (secret: never log or expose)."""
        try:
            coordinator = self._coordinator()
            if coordinator is None:
                return None
            token = getattr(getattr(coordinator, "api", None), "session_token", None)
            return token if isinstance(token, str) else None
        except Exception as err:  # noqa: BLE001 - must never raise
            _LOGGER.debug("Could not read the foXaCe session token (%s)", type(err).__name__)
            return None

    async def snapshot(self, now: datetime) -> FoxaceSnapshot:
        """Return the current foXaCe state; never raises (probe failures become status)."""
        coordinator = self._coordinator()
        if coordinator is None:
            return FoxaceSnapshot(installed=False)
        try:
            version = (await async_get_integration(self._hass, FOXACE_DOMAIN)).version
        except Exception as err:  # noqa: BLE001 - loader errors must not break probing
            self._warn_once("version", "integration version", err)
            version = None
        else:
            self._warned.discard("version")
        version_str, tested = self._version_info(version)
        try:
            self._ensure_listener(coordinator, now)
            snapshot = self._read(coordinator, now, version_str, tested)
        except Exception as err:  # noqa: BLE001 - snapshot() must never raise
            self._warn_once(f"snapshot:{type(err).__name__}", "internals (reporting minimal state)", err)
            return FoxaceSnapshot(
                installed=True,
                version=version_str,
                version_tested=tested,
                update_ok=self._update_ok(coordinator),
            )
        self._warned = {k for k in self._warned if not k.startswith("snapshot:")}
        return snapshot

    def _read(self, coordinator: Any, now: datetime, version: str | None, tested: bool) -> FoxaceSnapshot:
        attr = self._attr
        api = attr(coordinator, "api")
        sse_client = attr(attr(coordinator, "sse_manager"), "sse_client")
        connected = attr(sse_client, "is_connected", _MISSING)
        sse_connected = None if sse_client is None or connected is _MISSING else bool(connected)
        raw_spaces = attr(attr(coordinator, "account"), "spaces")
        spaces = list(raw_spaces.values()) if raw_spaces else []
        devices_list: list[DeviceHealth] = []
        names: list[str] = []
        for space in spaces:
            # Only a genuinely missing attribute is tolerated; any other failure propagates.
            for d in (getattr(space, "devices", None) or {}).values():
                if (health := _device_health(d)) is not None:
                    devices_list.append(health)
            if (name := getattr(getattr(space, "security_state", None), "name", None)):
                names.append(name)
        devices = tuple(devices_list)
        armed = any(n in ARMED_STATES for n in names) if names else None
        # The listener also fires on failed refreshes, so this is time since the last update attempt; update_ok
        # says whether it succeeded. Before foXaCe has fired at all, count from when the listener attached so a
        # stalled foXaCe cannot look healthy forever.
        since = self._last_update or self._listening_since
        age = max(0.0, (now - since).total_seconds()) if since else None
        return FoxaceSnapshot(
            installed=True,
            version=version,
            version_tested=tested,
            proxy_mode=bool(attr(api, "is_proxy_mode", False)),
            proxy_url=attr(api, "proxy_url"),
            update_ok=self._update_ok(coordinator),
            seconds_since_update=age,
            sse_connected=sse_connected,
            armed=armed,
            devices=devices,
        )

    def async_unload(self) -> None:
        """Remove the coordinator listener; never raises; safe to call more than once."""
        self._release()

    async def async_refresh_foxace(self) -> tuple[bool, float | None]:
        """Ask foXaCe to poll Alarmio/Ajax now and time it. Read-only: this never sends a command.

        Returns (succeeded, elapsed_ms): (False, None) when foXaCe is not installed, (False, elapsed) when the
        refresh fails or exceeds REFRESH_TIMEOUT_S. Never raises.
        """
        coordinator = self._coordinator()
        if coordinator is None:
            return False, None
        started = time.perf_counter()
        try:
            async with asyncio.timeout(REFRESH_TIMEOUT_S):
                await coordinator.async_refresh()
        except TimeoutError:
            self._warn_once("refresh", "refresh (timed out)", TimeoutError())
            return False, REFRESH_TIMEOUT_S * 1000
        except Exception as err:  # noqa: BLE001 - must never raise
            self._warn_once("refresh", "refresh", err)
            return False, (time.perf_counter() - started) * 1000
        elapsed = (time.perf_counter() - started) * 1000
        ok = self._update_ok(coordinator)
        if ok:
            self._warned.discard("refresh")
        return ok, elapsed

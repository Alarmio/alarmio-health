"""Websocket commands used by the panel. Read-only apart from the E2E refresh (which never sends a command)."""

from __future__ import annotations

import asyncio
import logging
import time
from collections.abc import Awaitable, Callable
from datetime import timedelta
from functools import wraps
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.recorder import get_instance
from homeassistant.components.recorder.history import get_significant_states
from homeassistant.components.recorder.statistics import statistics_during_period
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

from .const import DOMAIN, PROBES, VERSION
from .coordinator import AlarmioHealthCoordinator
from .history import shape_latency_series, shape_statistics_series, shape_status_series
from .summary import build_summary

_LOGGER = logging.getLogger(__name__)

RANGES = {"24h": timedelta(hours=24), "7d": timedelta(days=7), "30d": timedelta(days=30)}
E2E_DEGRADED_MS = 3000.0
E2E_COOLDOWN_S = 30.0
_monotonic = time.monotonic  # patched in tests

_COMMANDS_KEY = f"{DOMAIN}_ws_commands"
_E2E_KEY = f"{DOMAIN}_e2e_gate"
_WARNED_KEY = f"{DOMAIN}_ws_warned"

type _Handler = Callable[[HomeAssistant, AlarmioHealthCoordinator, dict[str, Any]], Awaitable[dict[str, Any]]]


def _coordinator(hass: HomeAssistant) -> AlarmioHealthCoordinator | None:
    """The loaded entry's coordinator, or None when the integration is not set up."""
    for entry in hass.config_entries.async_entries(DOMAIN):
        coordinator = getattr(entry, "runtime_data", None)
        if coordinator is not None:
            return coordinator
    return None


def _guarded(command: str, failure_text: str) -> Callable[[_Handler], Callable[..., Awaitable[None]]]:
    """Wrap a handler: not_loaded without a coordinator; any exception becomes a sanitised unknown_error."""

    def decorator(func: _Handler) -> Callable[..., Awaitable[None]]:
        @wraps(func)
        async def wrapper(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
            warned: set[str] = hass.data.setdefault(_WARNED_KEY, set())
            coordinator = _coordinator(hass)
            if coordinator is None:
                connection.send_error(msg["id"], "not_loaded", "Alarmio Health is not set up.")
                return
            try:
                result = await func(hass, coordinator, msg)
            except Exception as err:  # noqa: BLE001 - nothing may escape a handler; class name only is logged
                key = f"{command}:{type(err).__name__}"
                if key not in warned:
                    warned.add(key)
                    _LOGGER.warning("Alarmio Health command '%s' failed (%s)", command, type(err).__name__)
                connection.send_error(msg["id"], "unknown_error", failure_text)
                return
            warned.difference_update({k for k in warned if k.startswith(f"{command}:")})
            connection.send_result(msg["id"], result)

        return wrapper

    return decorator


@callback
def async_register_commands(hass: HomeAssistant) -> None:
    """Register the panel commands once per hass."""
    if hass.data.get(_COMMANDS_KEY):
        return
    for command in (ws_summary, ws_history, ws_incidents, ws_run_e2e_test):
        websocket_api.async_register_command(hass, command)
    hass.data[_COMMANDS_KEY] = True


@websocket_api.websocket_command({vol.Required("type"): "alarmio_health/summary"})
@websocket_api.async_response
@_guarded("summary", "Could not build the summary. Check the Home Assistant log.")
async def ws_summary(hass: HomeAssistant, coordinator: AlarmioHealthCoordinator, msg: dict[str, Any]) -> dict[str, Any]:
    """The signal chain, sharing state and (only when sharing) the next diagnostics block."""
    result = build_summary(
        coordinator.data or {}, coordinator.tracker.open_incidents, coordinator.net, coordinator.verdict
    )
    result["integration_version"] = VERSION
    result["share_diagnostics"] = coordinator.share_diagnostics
    result["queued_heartbeats"] = coordinator.heartbeat.queued
    result["diagnostics_preview"] = await coordinator.diagnostics_preview() if coordinator.share_diagnostics else None
    return result


@websocket_api.websocket_command({vol.Required("type"): "alarmio_health/incidents"})
@websocket_api.async_response
@_guarded("incidents", "Could not read incidents. Check the Home Assistant log.")
async def ws_incidents(
    hass: HomeAssistant, coordinator: AlarmioHealthCoordinator, msg: dict[str, Any]
) -> dict[str, Any]:
    """All incidents, newest first."""
    ordered = sorted(coordinator.tracker.incidents, key=lambda i: i.opened_at, reverse=True)
    return {"incidents": [i.to_dict() for i in ordered]}


def _lookup_history(
    hass: HomeAssistant, entities: dict[str, str | None], latency_id: str | None, range_key: str
) -> tuple[dict[str, list[Any]], list[dict[str, Any]]]:
    """Recorder lookups; runs in the recorder executor. Returns (states by entity, long-term mean rows)."""
    end = dt_util.utcnow()
    start = end - RANGES[range_key]
    # The latency entity's detailed states are only used for 24h; longer ranges use hourly statistics instead.
    wanted = [e for e in (*entities.values(), latency_id if range_key == "24h" else None) if e]
    states: dict[str, list[Any]] = {}
    if wanted:
        states = get_significant_states(
            hass, start, end, wanted, include_start_time_state=True, significant_changes_only=False,
            no_attributes=True,
        )
    rows: list[dict[str, Any]] = []
    if latency_id and range_key != "24h":
        stats = statistics_during_period(hass, start, end, {latency_id}, "hour", None, {"mean"})
        rows = list(stats.get(latency_id, []))
    return states, rows


@websocket_api.websocket_command(
    {vol.Required("type"): "alarmio_health/history", vol.Required("range"): vol.In(list(RANGES))}
)
@websocket_api.async_response
@_guarded("history", "Could not read history. Check the Home Assistant log.")
async def ws_history(hass: HomeAssistant, coordinator: AlarmioHealthCoordinator, msg: dict[str, Any]) -> dict[str, Any]:
    """Status and latency series; empty with a warning when the recorder cannot answer."""
    entry_id = coordinator.config_entry.entry_id
    registry = er.async_get(hass)
    status_ids = {p: registry.async_get_entity_id("sensor", DOMAIN, f"{entry_id}_{p}_status") for p in PROBES}
    latency_id = registry.async_get_entity_id("sensor", DOMAIN, f"{entry_id}_alarmio_latency")
    if not latency_id and not any(status_ids.values()):
        return {"status": {}, "latency": []}  # nothing registered: no recorder query at all
    try:
        states, rows = await get_instance(hass).async_add_executor_job(
            _lookup_history, hass, status_ids, latency_id, msg["range"]
        )
    except Exception as err:  # noqa: BLE001 - the panel shows an empty state instead of an error
        _LOGGER.warning("Alarmio Health history unavailable (%s)", type(err).__name__)
        return {"status": {}, "latency": [], "warning": "history_unavailable"}
    status = {probe: shape_status_series(states.get(eid, [])) for probe, eid in status_ids.items() if eid}
    if msg["range"] == "24h":
        latency = shape_latency_series(states.get(latency_id, []) if latency_id else [])
    else:
        latency = shape_statistics_series(rows)
    return {"status": status, "latency": latency}


def _e2e_result(ok: bool, elapsed: float | None) -> dict[str, Any]:
    """Map a refresh outcome to a conservative status."""
    if elapsed is None:
        return {"status": "unknown", "latency_ms": None, "detail": "The foXaCe integration is not installed."}
    if not ok:
        return {
            "status": "down",
            "latency_ms": elapsed,
            "detail": "foXaCe could not refresh through Alarmio. Check the chain above.",
        }
    if elapsed > E2E_DEGRADED_MS:
        return {"status": "degraded", "latency_ms": elapsed, "detail": f"The round trip took {elapsed / 1000:.1f}s."}
    return {"status": "healthy", "latency_ms": elapsed, "detail": "Ajax, Alarmio and foXaCe answered."}


class _E2EGate:
    """Single-flight plus cooldown for the E2E test, which any logged-in user can trigger."""

    def __init__(self) -> None:
        self._task: asyncio.Task[dict[str, Any]] | None = None
        self._result: dict[str, Any] | None = None
        self._finished_at: float = 0.0

    async def _execute(self, coordinator: AlarmioHealthCoordinator) -> dict[str, Any]:
        result = _e2e_result(*await coordinator.adapter.async_refresh_foxace())
        self._result = result
        self._finished_at = _monotonic()
        return result

    async def run(self, hass: HomeAssistant, coordinator: AlarmioHealthCoordinator) -> dict[str, Any]:
        """Join a running test, else serve the cached result inside the cooldown, else start a new test."""
        if self._task is None or self._task.done():
            if self._result is not None and _monotonic() - self._finished_at < E2E_COOLDOWN_S:
                return {**self._result, "cached": True}
            self._task = hass.async_create_background_task(self._execute(coordinator), f"{DOMAIN}_e2e_test")
        return dict(await asyncio.shield(self._task))


@websocket_api.websocket_command({vol.Required("type"): "alarmio_health/run_e2e_test"})
@websocket_api.async_response
@_guarded("run_e2e_test", "The end-to-end test failed to run. Check the Home Assistant log.")
async def ws_run_e2e_test(
    hass: HomeAssistant, coordinator: AlarmioHealthCoordinator, msg: dict[str, Any]
) -> dict[str, Any]:
    """Force one foXaCe refresh through Alarmio and time it. Read-only: no arm or disarm."""
    gate: _E2EGate = hass.data.setdefault(_E2E_KEY, _E2EGate())
    return await gate.run(hass, coordinator)

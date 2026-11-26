"""Shared data types for Alarmio Health. No Home Assistant imports."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from enum import StrEnum


class Status(StrEnum):
    """Health status of a probe or chain link."""

    HEALTHY = "healthy"
    DEGRADED = "degraded"
    DOWN = "down"
    UNKNOWN = "unknown"


@dataclass(frozen=True, slots=True)
class ProbeResult:
    """Outcome of one probe run."""

    probe: str
    status: Status
    checked_at: datetime
    latency_ms: float | None = None
    detail: str = ""


@dataclass(frozen=True, slots=True)
class DeviceHealth:
    """Health fields read from one Ajax device."""

    name: str
    online: bool
    malfunctions: int
    battery_level: int | None
    signal_strength: int | None


@dataclass(frozen=True, slots=True)
class FoxaceSnapshot:
    """Read-only view of the foXaCe integration at one moment."""

    installed: bool
    version: str | None = None
    version_tested: bool = False
    proxy_mode: bool = False
    proxy_url: str | None = None
    update_ok: bool = True
    seconds_since_update: float | None = None
    sse_connected: bool | None = None
    armed: bool | None = None
    devices: tuple[DeviceHealth, ...] = ()

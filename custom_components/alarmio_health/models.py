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


@dataclass(frozen=True, slots=True)
class HopStats:
    """Round-trip statistics for one network hop (gateway, internet anchor or the Alarmio server)."""

    label: str
    method: str  # "icmp" or "tcp"
    sent: int
    received: int
    rtt_median_ms: float | None = None
    jitter_ms: float | None = None

    @property
    def loss_pct(self) -> float:
        """Percentage of probes that got no answer (0.0 when nothing was sent)."""
        return 0.0 if self.sent <= 0 else round(100.0 * (self.sent - self.received) / self.sent, 1)


@dataclass(frozen=True, slots=True)
class StageTimings:
    """Connect, TLS and wait times of one HTTP request, on this machine's clock. None = stage did not happen."""

    connect_ms: float | None = None
    tls_ms: float | None = None
    wait_ms: float | None = None


@dataclass(frozen=True, slots=True)
class EchoResult:
    """Outcome of one echo exchange with the Alarmio server."""

    state: str  # "ok" | "slow" | "lost" | "unavailable"
    server_ms: float | None = None
    queue_ms: float | None = None
    round_trip_ms: float | None = None
    ajax: dict[str, float | bool | None] | None = None
    sqs_lag_p95_ms: float | None = None
    timings: StageTimings = StageTimings()
    loss: tuple[str, ...] = ()  # earlier echoes settled by this reply: "request" | "reply" | "unknown"


@dataclass(frozen=True, slots=True)
class NetSnapshot:
    """Everything the blame rule looks at for one cycle."""

    gateway: HopStats | None
    internet: HopStats | None
    vps: HopStats | None
    loop_lag_ms: float | None
    icmp_mode: str
    proxy_mode: bool
    echo: EchoResult | None
    ajax_direct_ok: bool | None = None
    ajax_direct_ms: float | None = None


@dataclass(frozen=True, slots=True)
class Verdict:
    """Which hop is to blame (None when nothing is wrong), with a plain-language sentence and the numbers."""

    broken: str | None  # "ha_host" | "gateway" | "internet" | "route" | "alarmio" | "ajax_cloud" | None
    status: Status
    text: str
    numbers: dict[str, float | None]
    notes: tuple[str, ...] = ()

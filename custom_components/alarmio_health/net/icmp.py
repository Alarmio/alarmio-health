"""ICMP and TCP hop measurement. The ping/connect functions are injected so tests never open sockets."""

from __future__ import annotations

import asyncio
import logging
import statistics
import time
from collections.abc import Awaitable, Callable
from typing import Any

from ..models import HopStats

_LOGGER = logging.getLogger(__name__)
MODE_UNPRIVILEGED = "unprivileged"
MODE_PRIVILEGED = "privileged"
MODE_TCP = "tcp-fallback"
PingFn = Callable[..., Awaitable[Any]]


def load_async_ping() -> PingFn | None:
    """icmplib's `async_ping`, or None when icmplib is not installed (Home Assistant's ping integration provides it)."""
    try:
        from icmplib import async_ping
    except Exception:  # noqa: BLE001 - missing or broken icmplib means TCP timing instead
        return None
    return async_ping


async def detect_icmp_mode(ping: PingFn | None = None) -> str:
    """Try unprivileged ICMP, then privileged; otherwise report the TCP fallback. Never raises."""
    fn = ping if ping is not None else load_async_ping()
    if fn is None:
        return MODE_TCP
    for privileged, mode in ((False, MODE_UNPRIVILEGED), (True, MODE_PRIVILEGED)):
        try:
            await fn("127.0.0.1", count=1, timeout=1, privileged=privileged)
        except Exception as err:  # noqa: BLE001 - SocketPermissionError and anything else: try the next mode
            _LOGGER.debug("ICMP mode %s unavailable (%s)", mode, type(err).__name__)
            continue
        return mode
    return MODE_TCP


def _jitter(rtts: list[float]) -> float | None:
    if len(rtts) < 2:
        return None
    return round(statistics.fmean(abs(b - a) for a, b in zip(rtts, rtts[1:], strict=False)), 2)


async def ping_hop(
    label: str,
    host: str,
    mode: str,
    *,
    count: int = 5,
    interval: float = 0.2,
    timeout: float = 2.0,
    ping: PingFn | None = None,
) -> HopStats | None:
    """Ping one host. None means "no data" (TCP mode, or the ping itself failed); never raises."""
    if mode == MODE_TCP:
        return None
    fn = ping if ping is not None else load_async_ping()
    if fn is None:
        return None
    try:
        result = await fn(host, count=count, interval=interval, timeout=timeout, privileged=mode == MODE_PRIVILEGED)
        rtts = [float(r) for r in result.rtts]
        return HopStats(
            label, "icmp", int(result.packets_sent), int(result.packets_received),
            round(statistics.median(rtts), 2) if rtts else None,
            round(float(result.jitter), 2) if rtts else None,
        )
    except Exception as err:  # noqa: BLE001 - the address is deliberately not logged
        _LOGGER.debug("ICMP to the %s failed (%s)", label, type(err).__name__)
        return None


async def tcp_hop(
    label: str,
    host: str,
    port: int,
    *,
    count: int = 3,
    timeout: float = 2.0,
    connect: Callable[[str, int], Awaitable[Any]] | None = None,
) -> HopStats | None:
    """Time TCP connects. A refused connection is an answer (the host is alive); a timeout is a loss.

    TCP retransmits hide packet loss, so callers must not read loss from these hops.
    """
    opener = connect if connect is not None else asyncio.open_connection
    rtts: list[float] = []
    for _ in range(count):
        started = time.monotonic()
        writer: Any = None
        try:
            _reader, writer = await asyncio.wait_for(opener(host, port), timeout)
        except ConnectionRefusedError:
            rtts.append((time.monotonic() - started) * 1000)
            continue
        except (TimeoutError, OSError):
            continue
        except Exception as err:  # noqa: BLE001
            _LOGGER.debug("TCP timing to the %s failed (%s)", label, type(err).__name__)
            continue
        rtts.append((time.monotonic() - started) * 1000)
        try:
            writer.close()
            await writer.wait_closed()
        except Exception as err:  # noqa: BLE001 - closing is best effort
            _LOGGER.debug("Closing the TCP probe to the %s failed (%s)", label, type(err).__name__)
    return HopStats(
        label, "tcp", count, len(rtts),
        round(statistics.median(rtts), 2) if rtts else None, _jitter(rtts),
    )

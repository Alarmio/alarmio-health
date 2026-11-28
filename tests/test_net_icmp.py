"""ICMP capability detection and hop measurement, with injected ping and connect functions."""

import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.alarmio_health.net import icmp
from custom_components.alarmio_health.net.icmp import (
    MODE_PRIVILEGED,
    MODE_TCP,
    MODE_UNPRIVILEGED,
    detect_icmp_mode,
    ping_hop,
    tcp_hop,
)


class SocketPermissionError(Exception):
    """Same class name as icmplib's, which the detection must tolerate."""


def _host(sent: int, received: int, rtts: list[float], jitter: float = 0.4) -> SimpleNamespace:
    return SimpleNamespace(packets_sent=sent, packets_received=received, rtts=rtts, jitter=jitter)


async def test_detect_prefers_unprivileged() -> None:
    ping = AsyncMock(return_value=_host(1, 1, [0.1]))
    assert await detect_icmp_mode(ping) == MODE_UNPRIVILEGED
    assert ping.await_args.kwargs["privileged"] is False


async def test_detect_falls_back_to_privileged() -> None:
    async def ping(host, **kw):
        if not kw["privileged"]:
            raise SocketPermissionError
        return _host(1, 1, [0.1])

    assert await detect_icmp_mode(ping) == MODE_PRIVILEGED


async def test_detect_gives_up_to_tcp() -> None:
    ping = AsyncMock(side_effect=SocketPermissionError)
    assert await detect_icmp_mode(ping) == MODE_TCP


async def test_detect_without_icmplib_is_tcp(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(icmp, "load_async_ping", lambda: None)
    assert await detect_icmp_mode() == MODE_TCP


async def test_ping_hop_summarises_the_answers() -> None:
    ping = AsyncMock(return_value=_host(5, 4, [10.0, 12.0, 30.0, 11.0]))
    hop = await ping_hop("gateway", "192.0.2.1", MODE_UNPRIVILEGED, ping=ping)
    assert hop is not None
    assert (hop.label, hop.method, hop.sent, hop.received) == ("gateway", "icmp", 5, 4)
    assert hop.rtt_median_ms == 11.5 and hop.loss_pct == 20.0
    assert ping.await_args.kwargs["privileged"] is False and ping.await_args.kwargs["count"] == 5


async def test_ping_hop_with_no_answers_is_zero_received_not_none() -> None:
    hop = await ping_hop("vps", "203.0.113.9", MODE_PRIVILEGED, ping=AsyncMock(return_value=_host(5, 0, [])))
    assert hop is not None and hop.received == 0 and hop.rtt_median_ms is None and hop.jitter_ms is None


async def test_ping_hop_failure_is_no_data() -> None:
    assert await ping_hop("gateway", "192.0.2.1", MODE_UNPRIVILEGED, ping=AsyncMock(side_effect=OSError)) is None


async def test_ping_hop_in_tcp_mode_does_nothing() -> None:
    ping = AsyncMock()
    assert await ping_hop("gateway", "192.0.2.1", MODE_TCP, ping=ping) is None
    ping.assert_not_awaited()


def _writer() -> MagicMock:
    writer = MagicMock()
    writer.wait_closed = AsyncMock()
    return writer


async def test_tcp_hop_counts_answers_and_refusals_but_not_timeouts() -> None:
    outcomes = [(None, _writer()), ConnectionRefusedError(), TimeoutError()]

    async def connect(host, port):
        outcome = outcomes.pop(0)
        if isinstance(outcome, Exception):
            raise outcome
        return outcome

    hop = await tcp_hop("gateway", "192.0.2.1", 80, count=3, connect=connect)
    assert hop is not None
    assert (hop.method, hop.sent, hop.received) == ("tcp", 3, 2)
    assert hop.rtt_median_ms is not None


async def test_tcp_hop_all_lost() -> None:
    async def connect(host, port):
        raise OSError

    hop = await tcp_hop("internet", "1.1.1.1", 443, count=2, connect=connect)
    assert hop is not None and hop.received == 0 and hop.rtt_median_ms is None


async def test_tcp_hop_has_a_per_attempt_timeout() -> None:
    async def connect(host, port):
        await asyncio.sleep(5)

    hop = await tcp_hop("internet", "1.1.1.1", 443, count=1, timeout=0.05, connect=connect)
    assert hop is not None and hop.received == 0

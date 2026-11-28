"""Hop measurement orchestration, hop -> probe result, the direct Ajax probe and the net payload block."""

import json
from datetime import UTC, datetime
from types import SimpleNamespace
from unittest.mock import AsyncMock

import httpx

from custom_components.alarmio_health.models import EchoResult, HopStats, NetSnapshot, Status
from custom_components.alarmio_health.net.icmp import MODE_TCP, MODE_UNPRIVILEGED
from custom_components.alarmio_health.net.probes import (
    NetHops,
    ajaxcloud_result,
    gateway_result,
    internet_result,
    measure_network,
    net_block,
    probe_ajax_direct,
)

NOW = datetime(2026, 11, 28, 12, 0, tzinfo=UTC)


def _res(sent=5, received=5, rtts=(1.0, 2.0)) -> SimpleNamespace:
    return SimpleNamespace(packets_sent=sent, packets_received=received, rtts=list(rtts), jitter=0.2)


async def test_measure_runs_every_hop_and_skips_missing_hosts() -> None:
    ping = AsyncMock(return_value=_res())
    hops = await measure_network(mode=MODE_UNPRIVILEGED, gateway="192.0.2.1", anchor=None, vps="a.test", ping=ping)
    assert hops.gateway is not None and hops.vps is not None and hops.internet is None
    assert ping.await_count == 2


async def test_one_failing_hop_does_not_break_the_others() -> None:
    async def ping(host, **kw):
        if host == "bad":
            raise OSError
        return _res()

    hops = await measure_network(mode=MODE_UNPRIVILEGED, gateway="bad", anchor="1.1.1.1", vps=None, ping=ping)
    assert hops.gateway is None and hops.internet is not None


async def test_tcp_mode_uses_the_connect_function() -> None:
    async def connect(host, port):
        raise ConnectionRefusedError

    hops = await measure_network(
        mode=MODE_TCP, gateway="192.0.2.1", anchor="1.1.1.1", vps="a.test", tcp_connect=connect
    )
    assert hops.gateway is not None and hops.gateway.method == "tcp" and hops.gateway.received == 3


def test_gateway_result() -> None:
    ok = gateway_result(HopStats("gateway", "icmp", 5, 5, 0.4, 0.1), NOW)
    assert ok.probe == "gateway" and ok.status is Status.HEALTHY and ok.latency_ms == 0.4 and ok.detail == ""
    assert gateway_result(HopStats("gateway", "icmp", 5, 0), NOW).status is Status.DOWN
    unknown = gateway_result(None, NOW)
    assert unknown.status is Status.UNKNOWN and unknown.detail
    tcp = gateway_result(HopStats("gateway", "tcp", 3, 3, 2.0, 0.1), NOW)
    assert tcp.status is Status.HEALTHY and tcp.detail == ""  # healthy readings carry no text (no recorder churn)
    degraded = gateway_result(HopStats("gateway", "icmp", 5, 3, 1.0, 0.1), NOW)
    assert degraded.status is Status.DEGRADED and "3 of 5" in degraded.detail
    down_tcp = gateway_result(HopStats("gateway", "tcp", 3, 0), NOW)
    assert down_tcp.status is Status.DOWN and "did not answer" in down_tcp.detail
    silent = gateway_result(HopStats("gateway", "icmp", 5, 0), NOW, filtered=True)
    assert silent.status is Status.UNKNOWN and "pings" in silent.detail


def test_internet_result_disabled_and_unknown() -> None:
    off = internet_result(None, NOW, enabled=False)
    assert off.status is Status.UNKNOWN and "turned off" in off.detail
    healthy = internet_result(HopStats("internet", "icmp", 5, 5, 12.0, 0.1), NOW)
    assert healthy.status is Status.HEALTHY and healthy.detail == "" and healthy.latency_ms == 12.0
    silent = internet_result(HopStats("internet", "tcp", 3, 0), NOW, filtered=True)
    assert silent.status is Status.UNKNOWN and "connections" in silent.detail


def _net(**kw) -> NetSnapshot:
    base = dict(
        gateway=None, internet=None, vps=None, loop_lag_ms=None, icmp_mode="unprivileged", proxy_mode=True, echo=None
    )
    base.update(kw)
    return NetSnapshot(**base)


def test_ajaxcloud_from_the_server_report() -> None:
    good = _net(echo=EchoResult("ok", ajax={"calls": 40.0, "p95_ms": 900.0, "canary_ms": 180.0, "canary_ok": True}))
    r = ajaxcloud_result(good, NOW)
    assert r.status is Status.HEALTHY and r.latency_ms == 180.0 and r.detail == ""
    bad = _net(echo=EchoResult("ok", ajax={"canary_ok": False}))
    assert ajaxcloud_result(bad, NOW).status is Status.DEGRADED
    waiting = ajaxcloud_result(_net(echo=EchoResult("unavailable")), NOW)
    assert waiting.status is Status.UNKNOWN and "Alarmio" in waiting.detail


def test_ajaxcloud_direct_mode() -> None:
    fast = _net(proxy_mode=False, ajax_direct_ok=True, ajax_direct_ms=300.0)
    assert ajaxcloud_result(fast, NOW).status is Status.HEALTHY and ajaxcloud_result(fast, NOW).detail == ""
    assert ajaxcloud_result(_net(proxy_mode=False, ajax_direct_ok=False), NOW).status is Status.DOWN
    slow = _net(proxy_mode=False, ajax_direct_ok=True, ajax_direct_ms=4000.0)
    assert ajaxcloud_result(slow, NOW).status is Status.DEGRADED
    assert ajaxcloud_result(_net(proxy_mode=False), NOW).status is Status.UNKNOWN


async def test_direct_probe_any_answer_is_reachable() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.headers["connection"] == "close"
        return httpx.Response(404)

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        ok, total_ms, timings = await probe_ajax_direct(client, url="https://ajax.test/")
    assert ok is True and total_ms >= 0 and timings is not None


async def test_direct_probe_failure_is_unreachable() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("no")

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        ok, _ms, _t = await probe_ajax_direct(client, url="https://ajax.test/")
    assert ok is False


def test_net_block_has_numbers_but_never_hosts() -> None:
    hops = NetHops(HopStats("gateway", "icmp", 5, 5, 0.4, 0.1), HopStats("internet", "icmp", 5, 4, 12.0, 0.5), None)
    block = net_block(hops, 31.7, MODE_UNPRIVILEGED)
    assert block["gateway"] == {"sent": 5, "received": 5, "loss_pct": 0.0, "rtt_median_ms": 0.4, "jitter_ms": 0.1}
    assert block["internet"]["loss_pct"] == 20.0 and "vps" not in block
    assert block["loop_lag_max_ms"] == 31.7 and block["icmp"] == "unprivileged"
    assert len(block) <= 12
    text = json.dumps(block)
    assert "192." not in text and "1.1.1.1" not in text


def test_net_block_does_not_claim_loss_for_tcp_hops() -> None:
    hops = NetHops(HopStats("gateway", "tcp", 3, 2, 2.0, 0.1), None, None)
    assert net_block(hops, 0.0, MODE_TCP)["gateway"]["loss_pct"] is None


async def test_a_raising_hop_is_contained_by_measure_network(monkeypatch) -> None:
    from custom_components.alarmio_health.net import probes

    async def boom(*args, **kwargs):
        raise RuntimeError("x")

    monkeypatch.setattr(probes, "ping_hop", boom)
    hops = await measure_network(mode=MODE_UNPRIVILEGED, gateway="192.0.2.1", anchor=None, vps=None)
    assert hops == NetHops(None, None, None)


async def test_direct_probe_sends_no_credentials_and_attaches_the_recorder() -> None:
    captured: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        captured.append(request)
        return httpx.Response(200)

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        await probe_ajax_direct(client, url="https://ajax.test/")
    assert "authorization" not in captured[0].headers and "cookie" not in captured[0].headers
    assert "trace" in captured[0].extensions

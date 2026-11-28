"""Coordinator wiring of the network layer: hops, echo, blame and attribution."""

import asyncio
import json
from dataclasses import replace
from datetime import UTC, datetime
from unittest.mock import AsyncMock, MagicMock

import httpx
from homeassistant.core import HomeAssistant

from custom_components.alarmio_health import coordinator as module
from custom_components.alarmio_health.const import PROBES
from custom_components.alarmio_health.coordinator import AlarmioHealthCoordinator
from custom_components.alarmio_health.heartbeat import HeartbeatClient
from custom_components.alarmio_health.incidents import IncidentTracker
from custom_components.alarmio_health.models import DeviceHealth, FoxaceSnapshot, HopStats, Status
from custom_components.alarmio_health.net.probes import NetHops

NOW = datetime(2026, 11, 28, 12, 0, tzinfo=UTC)


def _snapshot(proxy_url: str | None = "https://a.test") -> FoxaceSnapshot:
    return FoxaceSnapshot(
        installed=True, version="0.39.0", version_tested=True, proxy_mode=proxy_url is not None, proxy_url=proxy_url,
        update_ok=True, seconds_since_update=10.0, sse_connected=True, armed=False,
        devices=(DeviceHealth("Door", True, 0, 90, 2),),
    )


def _build(hass, handler, snapshot=None, options=None) -> AlarmioHealthCoordinator:
    http = httpx.AsyncClient(transport=httpx.MockTransport(handler))
    adapter = MagicMock()
    adapter.snapshot = AsyncMock(return_value=snapshot or _snapshot())
    adapter.session_token.return_value = "tok"
    store = MagicMock()
    store.async_save = AsyncMock()
    entry = MagicMock()
    entry.options = options or {}
    return AlarmioHealthCoordinator(hass, entry, http, adapter, IncidentTracker(), store, HeartbeatClient(http))


def _server(bodies: list | None = None, server_ms: float = 3.0, health: bool = True):
    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/api/heartbeat":
            body = json.loads(request.content)
            if bodies is not None:
                bodies.append(body)
            echo = body.get("echo")
            reply: dict = {"ok": True}
            if echo:
                reply["echo"] = {"server_ms": server_ms, "queue_ms": 1, "seen": [{"id": echo["id"], "ago_ms": 2}],
                                 "ajax": {"calls": 40, "p95_ms": 900, "canary_ok": True, "canary_ms": 180}}
            return httpx.Response(200, json=reply)
        if not health:
            raise httpx.ConnectError("down")
        return httpx.Response(200, json={"ok": True})

    return handler


def _hops(monkeypatch, gateway=None, internet=None, vps=None, calls=None):
    async def measure(**kwargs):
        if calls is not None:
            calls.append(kwargs)
        return NetHops(gateway, internet, vps)

    monkeypatch.setattr(module, "measure_network", measure)


GOOD_GW = HopStats("gateway", "icmp", 5, 5, 0.4, 0.1)
GOOD_NET = HopStats("internet", "icmp", 5, 5, 12.0, 0.2)
GOOD_VPS = HopStats("vps", "icmp", 5, 5, 172.0, 0.5)


async def test_all_nine_probes_are_returned(hass: HomeAssistant, monkeypatch) -> None:
    _hops(monkeypatch, GOOD_GW, GOOD_NET, GOOD_VPS)
    data = await _build(hass, _server())._async_update_data()
    assert set(data) == set(PROBES) and len(PROBES) == 9
    assert data["gateway"].status is Status.HEALTHY and data["internet"].status is Status.HEALTHY
    assert data["ajaxcloud"].status is Status.HEALTHY


async def test_the_heartbeat_carries_the_echo_and_a_net_block_without_addresses(hass, monkeypatch) -> None:
    _hops(monkeypatch, GOOD_GW, GOOD_NET, GOOD_VPS)
    monkeypatch.setattr(module, "read_default_gateway", lambda: "192.0.2.1")
    bodies: list = []
    await _build(hass, _server(bodies))._async_update_data()
    body = bodies[-1]
    assert body["schema"] == 2 and body["echo"]["id"] and body["net"]["gateway"]["received"] == 5
    assert "192.168" not in json.dumps(body) and "1.1.1.1" not in json.dumps(body)


async def test_echo_reply_feeds_the_snapshot(hass, monkeypatch) -> None:
    _hops(monkeypatch, GOOD_GW, GOOD_NET, GOOD_VPS)
    c = _build(hass, _server(server_ms=3.0))
    await c._async_update_data()
    assert c.net is not None and c.net.echo is not None and c.net.echo.state == "ok"
    assert c.net.echo.server_ms == 3.0 and c.verdict is not None and c.verdict.broken is None


async def test_27_nov_evening_blames_the_route_not_alarmio(hass, monkeypatch) -> None:
    _hops(monkeypatch, GOOD_GW, GOOD_NET, HopStats("vps", "icmp", 5, 2, 180.0, 5.0))
    c = _build(hass, _server(server_ms=3.0))
    data = await c._async_update_data()
    assert c.verdict is not None and c.verdict.broken == "route"
    assert "3 of 5" in data["alarmio"].detail and "3 ms" in data["alarmio"].detail


def _lost_heartbeat_server():
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("down")

    return handler


async def test_gateway_down_turns_a_down_alarmio_probe_into_not_evaluated(hass, monkeypatch) -> None:
    # nothing later answers either (VPS silent, server unreachable), so a silent router really is down
    _hops(monkeypatch, HopStats("gateway", "icmp", 5, 0), GOOD_NET, HopStats("vps", "icmp", 5, 0))
    data = await _build(hass, _lost_heartbeat_server())._async_update_data()
    assert data["gateway"].status is Status.DOWN and "router" in data["gateway"].detail
    assert data["alarmio"].status is Status.UNKNOWN and "Not evaluated" in data["alarmio"].detail


async def test_options_reach_the_measurement(hass, monkeypatch) -> None:
    calls: list = []
    _hops(monkeypatch, calls=calls)
    monkeypatch.setattr(module, "read_default_gateway", lambda: "192.0.2.1")
    await _build(hass, _server(), options={"gateway": "10.0.0.1", "anchor_host": "9.9.9.9"})._async_update_data()
    assert calls[-1]["gateway"] == "10.0.0.1" and calls[-1]["anchor"] == "9.9.9.9"
    calls.clear()
    await _build(hass, _server(), options={"anchor_enabled": False})._async_update_data()
    assert calls[-1]["anchor"] is None and calls[-1]["gateway"] == "192.0.2.1"


async def test_lost_heartbeat_is_a_lost_echo(hass, monkeypatch) -> None:
    _hops(monkeypatch, GOOD_GW, GOOD_NET, GOOD_VPS)

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/api/heartbeat":
            raise httpx.ConnectError("lost")
        return httpx.Response(200, json={"ok": True})

    c = _build(hass, handler)
    await c._async_update_data()
    assert c.net is not None and c.net.echo is not None and c.net.echo.state == "lost"
    assert c.verdict is not None and c.verdict.broken == "route"


async def test_old_server_means_unavailable_not_lost(hass, monkeypatch) -> None:
    _hops(monkeypatch, GOOD_GW, GOOD_NET, GOOD_VPS)

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/api/heartbeat":
            body = json.loads(request.content)
            return httpx.Response(422) if body["schema"] == 2 else httpx.Response(200, json={"ok": True})
        return httpx.Response(200, json={"ok": True})

    c = _build(hass, handler)
    await c._async_update_data()
    assert c.net is not None and c.net.echo is not None and c.net.echo.state == "unavailable"
    assert c.verdict is not None and "server timing unavailable" in c.verdict.notes


async def test_direct_mode_has_no_vps_and_uses_the_direct_probe(hass, monkeypatch) -> None:
    calls: list = []
    _hops(monkeypatch, GOOD_GW, GOOD_NET, calls=calls)

    async def direct(client, **kw):
        from custom_components.alarmio_health.models import StageTimings
        return True, 250.0, StageTimings()

    monkeypatch.setattr(module, "probe_ajax_direct", direct)
    c = _build(hass, _server(), snapshot=_snapshot(proxy_url=None))
    data = await c._async_update_data()
    assert calls[-1]["vps"] is None
    assert c.net is not None and c.net.proxy_mode is False and c.net.ajax_direct_ok is True
    assert data["ajaxcloud"].status is Status.HEALTHY


async def test_a_failing_measurement_never_breaks_the_cycle(hass, monkeypatch) -> None:
    async def boom(**kwargs):
        raise RuntimeError("x")

    monkeypatch.setattr(module, "measure_network", boom)
    data = await _build(hass, _server())._async_update_data()
    assert set(data) == set(PROBES) and data["gateway"].status is Status.UNKNOWN


async def test_loop_lag_is_sent_and_blames_the_ha_host(hass, monkeypatch) -> None:
    _hops(monkeypatch, GOOD_GW, GOOD_NET, GOOD_VPS)
    bodies: list = []
    c = _build(hass, _server(bodies))
    c.sampler._max_ms = 400.0
    await c._async_update_data()
    assert bodies[-1]["net"]["loop_lag_max_ms"] == 400.0
    assert c.verdict is not None and c.verdict.broken is None  # one stalled minute is not blamed
    c.sampler._max_ms = 400.0
    await c._async_update_data()
    assert c.verdict is not None and c.verdict.broken == "ha_host"  # two in a row are


async def test_a_calm_minute_resets_the_stall_count(hass, monkeypatch) -> None:
    _hops(monkeypatch, GOOD_GW, GOOD_NET, GOOD_VPS)
    c = _build(hass, _server())
    for lag in (400.0, 5.0, 400.0):
        c.sampler._max_ms = lag
        await c._async_update_data()
        assert c.verdict is not None and c.verdict.broken is None
    c.sampler._max_ms = 400.0
    await c._async_update_data()
    assert c.verdict is not None and c.verdict.broken == "ha_host"


async def test_a_single_stall_does_not_hide_a_real_fault(hass, monkeypatch) -> None:
    _hops(monkeypatch, HopStats("gateway", "icmp", 5, 0), GOOD_NET, HopStats("vps", "icmp", 5, 0))

    def dead(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("down")

    c = _build(hass, dead)
    c.sampler._max_ms = 400.0
    await c._async_update_data()
    assert c.verdict is not None and c.verdict.broken == "gateway"  # the router is still reported


async def test_a_degraded_hop_needs_two_readings(hass, monkeypatch) -> None:
    _hops(monkeypatch, HopStats("gateway", "icmp", 5, 3, 1.0, 0.1), GOOD_NET, GOOD_VPS)
    c = _build(hass, _server())
    first = await c._async_update_data()
    second = await c._async_update_data()
    assert first["gateway"].status is Status.HEALTHY and second["gateway"].status is Status.DEGRADED


async def test_no_session_token_means_nothing_sent_so_unavailable_not_lost(hass, monkeypatch) -> None:
    _hops(monkeypatch, GOOD_GW, GOOD_NET, GOOD_VPS)
    bodies: list = []
    c = _build(hass, _server(bodies))
    c.adapter.session_token.return_value = None
    await c._async_update_data()
    assert bodies == []  # the heartbeat was never posted
    assert c.net is not None and c.net.echo is not None and c.net.echo.state == "unavailable"
    assert c.verdict is not None and c.verdict.broken != "route"


async def test_a_failing_blame_never_breaks_the_cycle(hass, monkeypatch) -> None:
    _hops(monkeypatch, GOOD_GW, GOOD_NET, GOOD_VPS)

    def boom(net):
        raise RuntimeError("secret 10.0.0.1")

    monkeypatch.setattr(module, "blame", boom)
    data = await _build(hass, _server())._async_update_data()
    assert set(data) == set(PROBES)
    for name in ("gateway", "internet", "ajaxcloud"):
        assert data[name].status is Status.UNKNOWN and "RuntimeError" in data[name].detail
        assert "10.0.0.1" not in data[name].detail


async def test_a_failing_net_block_still_sends_the_heartbeat(hass, monkeypatch) -> None:
    _hops(monkeypatch, GOOD_GW, GOOD_NET, GOOD_VPS)

    def boom(*a, **kw):
        raise RuntimeError("x")

    monkeypatch.setattr(module, "net_block", boom)
    bodies: list = []
    data = await _build(hass, _server(bodies))._async_update_data()
    assert len(bodies) == 1 and "echo" not in bodies[0] and "net" not in bodies[0]
    assert set(data) == set(PROBES)


async def test_a_non_https_proxy_means_nothing_sent_so_unavailable_not_route(hass, monkeypatch) -> None:
    _hops(monkeypatch, GOOD_GW, GOOD_NET, GOOD_VPS)
    c = _build(hass, _server(), snapshot=_snapshot(proxy_url="http://a.test"))
    await c._async_update_data()
    assert c.net is not None and c.net.echo is not None and c.net.echo.state == "unavailable"
    assert c.verdict is not None and c.verdict.broken is None


async def test_the_verdict_waits_for_the_debounce(hass, monkeypatch) -> None:
    _hops(monkeypatch, HopStats("gateway", "icmp", 5, 3, 1.0, 0.1), GOOD_NET, GOOD_VPS)
    c = _build(hass, _server())
    first = await c._async_update_data()
    assert first["gateway"].status is Status.HEALTHY and first["gateway"].detail == ""
    assert first["internet"].status is Status.HEALTHY and first["alarmio"].status is Status.HEALTHY
    second = await c._async_update_data()
    assert second["gateway"].status is Status.DEGRADED and second["gateway"].detail


async def test_a_router_that_ignores_pings_is_not_an_incident_when_the_echo_is_ok(hass, monkeypatch) -> None:
    _hops(monkeypatch, HopStats("gateway", "icmp", 5, 0), HopStats("internet", "icmp", 5, 0), GOOD_VPS)
    c = _build(hass, _server())
    for _ in range(4):  # well past the incident opening threshold
        data = await c._async_update_data()
    assert c.verdict is not None and c.verdict.broken is None
    assert "your router does not answer pings" in c.verdict.notes
    assert "the internet address does not answer pings" in c.verdict.notes
    assert data["gateway"].status is Status.UNKNOWN and data["internet"].status is Status.UNKNOWN
    assert not [i for i in c.tracker.open_incidents if i.probe in ("gateway", "internet")]


async def test_a_real_stream_down_stays_down_when_only_a_hop_is_silent(hass, monkeypatch) -> None:
    _hops(monkeypatch, HopStats("gateway", "icmp", 5, 0), GOOD_NET, GOOD_VPS)
    snap = _snapshot()
    snap = replace(snap, sse_connected=False, proxy_mode=True)
    c = _build(hass, _server(), snapshot=snap)
    data = await c._async_update_data()
    assert data["stream"].status is not Status.HEALTHY and data["stream"].status is not Status.UNKNOWN


async def test_a_loop_stall_does_not_hide_a_real_stream_down(hass, monkeypatch) -> None:
    _hops(monkeypatch, GOOD_GW, GOOD_NET, GOOD_VPS)
    c = _build(hass, _server(), snapshot=replace(_snapshot(), sse_connected=False))
    c.sampler._max_ms = 400.0
    data = await c._async_update_data()
    assert data["stream"].status in (Status.DOWN, Status.DEGRADED)  # a single stalled minute hides nothing
    c.sampler._max_ms = 400.0
    data = await c._async_update_data()
    assert c.verdict is not None and c.verdict.broken == "ha_host"
    assert data["stream"].status in (Status.DOWN, Status.DEGRADED)


async def test_the_summary_cause_waits_for_the_debounce(hass, monkeypatch) -> None:
    from custom_components.alarmio_health.summary import build_summary

    _hops(monkeypatch, HopStats("gateway", "icmp", 5, 3, 1.0, 0.1), GOOD_NET, GOOD_VPS)
    c = _build(hass, _server())
    data = await c._async_update_data()
    assert c.verdict is not None and c.verdict.broken is None
    assert build_summary(data, c.tracker.open_incidents, c.net, c.verdict)["cause"] == ""
    data = await c._async_update_data()
    assert c.verdict.broken == "gateway" and build_summary(data, c.tracker.open_incidents, c.net, c.verdict)["cause"]


async def test_a_lost_then_resent_echo_reconciles_as_unknown(hass, monkeypatch) -> None:
    _hops(monkeypatch, GOOD_GW, GOOD_NET, GOOD_VPS)
    got: list[str] = []
    state = {"fail": True}

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path != "/api/heartbeat":
            return httpx.Response(200, json={"ok": True})
        if state["fail"]:
            raise httpx.ConnectError("lost")
        echo = json.loads(request.content)["echo"]
        got.append(echo["id"])
        return httpx.Response(
            200, json={"ok": True, "echo": {"server_ms": 3, "seen": [{"id": i, "ago_ms": 5} for i in got]}}
        )

    c = _build(hass, handler)
    await c._async_update_data()
    assert c.net is not None and c.net.echo is not None and c.net.echo.state == "lost"
    state["fail"] = False
    await c._async_update_data()  # the queued copy is flushed first, so the server saw the lost id
    assert c.net.echo is not None and c.net.echo.state == "ok" and c.net.echo.loss == ("unknown",)


async def test_a_stalled_measurement_is_no_data_not_a_stalled_cycle(hass, monkeypatch, caplog) -> None:
    async def sleeper(**kwargs):
        await asyncio.sleep(5)

    monkeypatch.setattr(module, "measure_network", sleeper)
    monkeypatch.setattr(module, "MEASURE_TIMEOUT_S", 0.05)
    c = _build(hass, _server())
    data = await asyncio.wait_for(c._async_update_data(), 3)
    assert set(data) == set(PROBES) and data["gateway"].status is Status.UNKNOWN
    assert "step 'network' failed (TimeoutError)" in caplog.text


async def test_the_real_measurement_chain_feeds_the_heartbeat_net_block(hass, monkeypatch) -> None:
    """No stubs for the hop measurement: real detect/measure/ping_hop with only the ping function faked."""
    from types import SimpleNamespace

    from custom_components.alarmio_health.net import icmp, probes

    async def fake_ping(host, **kwargs):
        return SimpleNamespace(packets_sent=5, packets_received=5, rtts=[0.5, 0.6, 0.4, 0.5, 0.5], jitter=0.1)

    monkeypatch.setattr(icmp, "load_async_ping", lambda: fake_ping)
    monkeypatch.setattr(module, "measure_network", probes.measure_network)
    monkeypatch.setattr(module, "detect_icmp_mode", icmp.detect_icmp_mode)
    monkeypatch.setattr(module, "read_default_gateway", lambda: "192.0.2.1")
    bodies: list = []
    data = await _build(hass, _server(bodies))._async_update_data()
    net = bodies[-1]["net"]
    assert net["icmp"] == "unprivileged"
    for hop in ("gateway", "internet", "vps"):
        assert net[hop]["sent"] == 5 and net[hop]["received"] == 5 and net[hop]["rtt_median_ms"] == 0.5
    assert data["gateway"].status is Status.HEALTHY and data["internet"].status is Status.HEALTHY
    assert "192.0.2.1" not in json.dumps(bodies[-1])

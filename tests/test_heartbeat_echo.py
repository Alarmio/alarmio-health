"""Heartbeat echo/net payload, exchange capture and the schema-1 fallback."""

import json
from datetime import UTC, datetime

import httpx

from custom_components.alarmio_health.heartbeat import HeartbeatClient, build_payload, downgrade_to_schema1
from custom_components.alarmio_health.models import ProbeResult, Status

NOW = datetime(2026, 11, 28, 12, 0, tzinfo=UTC)
URL = "https://a.test"
RESULTS = {"alarmio": ProbeResult("alarmio", Status.HEALTHY, NOW, 100.0)}


def _payload(echo=("abcd1234efgh", 7), net=None) -> dict:
    return build_payload(
        RESULTS, version="0.2.0", now=NOW, share_diagnostics=False, snapshot=None, reconnects=0,
        ha_version="2026.11.3", net=net if net is not None else {"icmp": "unprivileged"}, echo=echo,
    )


def _client(handler) -> HeartbeatClient:
    return HeartbeatClient(httpx.AsyncClient(transport=httpx.MockTransport(handler)))


def test_payload_with_echo_is_schema_2() -> None:
    p = _payload()
    assert p["schema"] == 2 and p["echo"] == {"id": "abcd1234efgh", "seq": 7} and p["net"] == {"icmp": "unprivileged"}


def test_payload_without_echo_is_unchanged_schema_1() -> None:
    p = _payload(echo=None)
    assert p["schema"] == 1 and "echo" not in p and "net" not in p


def test_downgrade_removes_echo_and_net() -> None:
    d = downgrade_to_schema1(_payload())
    assert d["schema"] == 1 and "echo" not in d and "net" not in d and d["probes"]


async def test_reply_is_captured_for_the_current_post() -> None:
    seen: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        seen.append(request)
        return httpx.Response(200, json={"ok": True, "echo": {"server_ms": 3}})

    client = _client(handler)
    result = await client.send(URL, "tok", _payload(), NOW)
    assert result.status is Status.HEALTHY
    ex = client.last_exchange
    assert ex is not None and ex.status == 200 and ex.reply == {"ok": True, "echo": {"server_ms": 3}}
    assert ex.downgraded is False and ex.elapsed_s >= 0
    assert seen[0].headers["connection"] == "close"


async def test_non_json_reply_is_none() -> None:
    client = _client(lambda r: httpx.Response(200, content=b"not json"))
    await client.send(URL, "tok", _payload(), NOW)
    assert client.last_exchange is not None and client.last_exchange.reply is None


async def test_no_reply_means_no_exchange_and_it_resets_each_send() -> None:
    state = {"fail": False}

    def handler(request: httpx.Request) -> httpx.Response:
        if state["fail"]:
            raise httpx.ConnectError("down")
        return httpx.Response(200, json={"ok": True})

    client = _client(handler)
    await client.send(URL, "tok", _payload(), NOW)
    assert client.last_exchange is not None
    state["fail"] = True
    await client.send(URL, "tok", _payload(), NOW)
    assert client.last_exchange is None


async def test_422_falls_back_to_schema_1_and_remembers() -> None:
    bodies: list[dict] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        bodies.append(body)
        return httpx.Response(422) if body["schema"] == 2 else httpx.Response(200, json={"ok": True})

    client = _client(handler)
    result = await client.send(URL, "tok", _payload(), NOW)
    assert result.status is Status.HEALTHY
    assert [b["schema"] for b in bodies] == [2, 1] and "echo" not in bodies[1]
    assert client.last_exchange is not None and client.last_exchange.downgraded is True

    bodies.clear()
    await client.send(URL, "tok", _payload(), NOW)
    assert [b["schema"] for b in bodies] == [1]  # no second 422 for an hour

    client._schema2_blocked_until = 0.0  # the hour is over
    bodies.clear()
    await client.send(URL, "tok", _payload(), NOW)
    assert [b["schema"] for b in bodies][0] == 2


async def test_a_422_to_a_schema_1_body_is_still_permanent() -> None:
    client = _client(lambda r: httpx.Response(422))
    result = await client.send(URL, "tok", _payload(echo=None), NOW)
    assert result.status is Status.UNKNOWN


async def test_a_failed_retry_after_a_422_leaves_no_exchange() -> None:
    calls = {"n": 0}

    def handler(request: httpx.Request) -> httpx.Response:
        calls["n"] += 1
        if calls["n"] == 1:
            return httpx.Response(422)
        raise httpx.ConnectError("down")

    client = _client(handler)
    await client.send(URL, "tok", _payload(), NOW)
    assert client.last_exchange is None


async def test_current_attempted_false_for_a_non_https_proxy() -> None:
    client = _client(lambda request: httpx.Response(200, json={"ok": True}))
    await client.send("http://a.test", "tok", _payload(), NOW)
    assert client.current_attempted is False and client.last_exchange is None


async def test_current_attempted_false_when_the_queue_head_fails_first() -> None:
    state = {"fail": True}

    def handler(request: httpx.Request) -> httpx.Response:
        if state["fail"]:
            raise httpx.ConnectError("down")
        return httpx.Response(200, json={"ok": True})

    client = _client(handler)
    await client.send(URL, "tok", _payload(), NOW)  # fails and is queued
    assert client.current_attempted is True
    await client.send(URL, "tok", _payload(), NOW)  # queued head fails, current never posted
    assert client.current_attempted is False and client.last_exchange is None


async def test_current_attempted_true_on_a_transport_failure_of_the_current_post() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("down")

    client = _client(handler)
    await client.send(URL, "tok", _payload(), NOW)
    assert client.current_attempted is True and client.last_exchange is None


async def test_queued_flush_posts_also_ask_for_a_fresh_connection() -> None:
    seen: list[httpx.Request] = []
    state = {"fail": True}

    def handler(request: httpx.Request) -> httpx.Response:
        seen.append(request)
        if state["fail"]:
            raise httpx.ConnectError("down")
        return httpx.Response(200, json={"ok": True})

    client = _client(handler)
    await client.send(URL, "tok", _payload(), NOW)
    assert client.queued == 1
    state["fail"] = False
    seen.clear()
    await client.send(URL, "tok", _payload(), NOW)
    assert len(seen) == 2  # the queued flush, then the current one
    assert all(r.headers["connection"] == "close" for r in seen)

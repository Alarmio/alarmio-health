import json
import logging
import math
from collections.abc import Callable
from datetime import UTC, datetime, timedelta
from decimal import Decimal
from types import SimpleNamespace
from typing import Any

import httpx
import pytest

from custom_components.alarmio_health import heartbeat
from custom_components.alarmio_health.heartbeat import HeartbeatClient, build_payload
from custom_components.alarmio_health.models import DeviceHealth, FoxaceSnapshot, ProbeResult, Status

NOW = datetime(2026, 11, 26, 12, 0, tzinfo=UTC)
RESULTS = {"alarmio": ProbeResult("alarmio", Status.HEALTHY, NOW, 112.0, "")}
SNAP = FoxaceSnapshot(installed=True, version="0.39.0", proxy_mode=True, armed=True,
                      devices=(DeviceHealth("Front door", True, 0, 55, 2),))
URL = "https://a.test"


def _payload(share: bool) -> dict:
    return build_payload(
        RESULTS, version="0.1.0", now=NOW, share_diagnostics=share, snapshot=SNAP, reconnects=2,
        ha_version="2026.11.0",
    )


def test_minimal_payload_has_no_diagnostics() -> None:
    payload = _payload(False)
    assert payload["schema"] == 1
    assert payload["probes"] == [{"probe": "alarmio", "status": "healthy", "latency_ms": 112.0, "detail": ""}]
    assert payload["diagnostics"] is None


def test_diagnostics_payload_includes_device_detail_but_no_secrets() -> None:
    payload = _payload(True)
    diag = payload["diagnostics"]
    assert diag["reconnects"] == 2
    assert diag["foxace_version"] == "0.39.0"
    assert diag["devices"][0] == {"name": "Front door", "online": True, "malfunctions": 0, "battery": 55, "signal": 2}
    assert "token" not in repr(payload).lower()


def _client(handler: Callable[[httpx.Request], httpx.Response]) -> httpx.AsyncClient:
    return httpx.AsyncClient(transport=httpx.MockTransport(handler))


async def test_send_ok_sends_token_header() -> None:
    seen: dict = {}

    def handler(request: httpx.Request) -> httpx.Response:
        seen["token"] = request.headers["X-Session-Token"]
        seen["url"] = str(request.url)
        return httpx.Response(200, json={"ok": True})

    async with _client(handler) as c:
        result = await HeartbeatClient(c).send(URL, "tok", _payload(False), NOW)
    assert result.status is Status.HEALTHY
    assert seen == {"token": "tok", "url": "https://a.test/api/heartbeat"}


async def test_rejected_session_is_down_with_fix_on_third_consecutive_rejection() -> None:
    async with _client(lambda r: httpx.Response(401)) as c:
        hb = HeartbeatClient(c)
        results = [await hb.send(URL, "tok", _payload(False), NOW) for _ in range(3)]
    assert [r.status for r in results] == [Status.UNKNOWN, Status.UNKNOWN, Status.DOWN]
    assert "renewing the session" in results[0].detail
    assert "renewing the session" in results[1].detail
    assert "Sign in again" in results[2].detail


async def test_network_failure_queues_and_is_unknown() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("x", request=request)

    async with _client(handler) as c:
        hb = HeartbeatClient(c)
        result = await hb.send(URL, "tok", _payload(False), NOW)
    assert result.status is Status.UNKNOWN
    assert hb.queued == 1


async def test_queue_is_bounded_and_flushes_on_success() -> None:
    online = {"up": False}
    sent: list[int] = []

    def handler(request: httpx.Request) -> httpx.Response:
        if not online["up"]:
            raise httpx.ConnectError("x", request=request)
        sent.append(1)
        return httpx.Response(200, json={"ok": True})

    async with _client(handler) as c:
        hb = HeartbeatClient(c, max_queue=3)
        for _ in range(5):
            await hb.send(URL, "tok", _payload(False), NOW)
        assert hb.queued == 3
        online["up"] = True
        result = await hb.send(URL, "tok", _payload(False), NOW)
    assert result.status is Status.HEALTHY
    assert hb.queued == 0
    assert len(sent) == 4


async def test_missing_token_is_unknown_and_nothing_is_sent() -> None:
    calls: list[int] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(1)
        return httpx.Response(500)

    async with _client(handler) as c:
        hb = HeartbeatClient(c)
        result = await hb.send(URL, None, _payload(False), NOW)
        no_url = await hb.send(None, "tok", _payload(False), NOW)
    assert result.status is Status.UNKNOWN
    assert no_url.status is Status.UNKNOWN
    assert calls == []
    assert hb.queued == 0


# ---- beyond the brief ----


async def test_server_error_is_unknown_and_queued() -> None:
    async with _client(lambda r: httpx.Response(503)) as c:
        hb = HeartbeatClient(c)
        result = await hb.send(URL, "tok", _payload(False), NOW)
    assert result.status is Status.UNKNOWN
    assert "503" in result.detail
    assert hb.queued == 1


async def test_rate_limit_is_retryable_not_dropped() -> None:
    async with _client(lambda r: httpx.Response(429)) as c:
        hb = HeartbeatClient(c)
        result = await hb.send(URL, "tok", _payload(False), NOW)
    assert result.status is Status.UNKNOWN
    assert hb.queued == 1


async def test_forbidden_while_flushing_drops_payload_and_is_down_on_third_rejection() -> None:
    mode = {"fail": True}

    def handler(request: httpx.Request) -> httpx.Response:
        if mode["fail"]:
            raise httpx.ConnectError("x", request=request)
        return httpx.Response(403)

    async with _client(handler) as c:
        hb = HeartbeatClient(c)
        await hb.send(URL, "tok", _payload(False), NOW)
        mode["fail"] = False
        first = await hb.send(URL, "tok", _payload(False), NOW)
        second = await hb.send(URL, "tok", _payload(False), NOW)
        result = await hb.send(URL, "tok", _payload(False), NOW)
    assert first.status is Status.UNKNOWN
    assert second.status is Status.UNKNOWN
    assert result.status is Status.DOWN
    assert "Sign in again" in result.detail
    assert hb.queued == 3  # the rejected head was dropped on the third rejection, the current one queued


async def test_poisoned_head_payload_does_not_block_newer_payloads() -> None:
    state = {"mode": "down"}
    bodies: list[bytes] = []

    def handler(request: httpx.Request) -> httpx.Response:
        if state["mode"] == "down":
            raise httpx.ConnectError("x", request=request)
        bodies.append(request.content)
        if len(bodies) == 1:
            return httpx.Response(413)  # the oldest payload is permanently rejected
        return httpx.Response(200, json={"ok": True})

    async with _client(handler) as c:
        hb = HeartbeatClient(c)
        await hb.send(URL, "tok", _payload(False), NOW)
        await hb.send(URL, "tok", _payload(False), NOW)
        assert hb.queued == 2
        state["mode"] = "up"
        result = await hb.send(URL, "tok", _payload(False), NOW)
    assert result.status is Status.HEALTHY
    assert hb.queued == 0
    assert len(bodies) == 3


async def test_current_payload_permanently_rejected_is_unknown_and_dropped() -> None:
    async with _client(lambda r: httpx.Response(400)) as c:
        hb = HeartbeatClient(c)
        result = await hb.send(URL, "tok", _payload(False), NOW)
    assert result.status is Status.UNKNOWN
    assert "400" in result.detail
    assert hb.queued == 0


async def test_failed_flush_of_older_payload_is_never_healthy() -> None:
    state = {"mode": "down"}

    def handler(request: httpx.Request) -> httpx.Response:
        if state["mode"] == "down":
            raise httpx.ConnectError("x", request=request)
        return httpx.Response(502)

    async with _client(handler) as c:
        hb = HeartbeatClient(c)
        await hb.send(URL, "tok", _payload(False), NOW)
        state["mode"] = "bad-gateway"
        result = await hb.send(URL, "tok", _payload(False), NOW)
    assert result.status is Status.UNKNOWN
    assert hb.queued == 2


async def test_unserialisable_payload_never_raises_and_is_not_queued() -> None:
    payload = _payload(False)
    payload["integration_version"] = object()  # not rescued by dropping diagnostics
    async with _client(lambda r: httpx.Response(200)) as c:
        hb = HeartbeatClient(c)
        result = await hb.send(URL, "tok", payload, NOW)
        good = await hb.send(URL, "tok", _payload(False), NOW)
    assert result.status is Status.UNKNOWN
    assert "TypeError" in result.detail
    assert hb.queued == 0
    assert good.status is Status.HEALTHY


async def test_nan_payload_never_raises() -> None:
    payload = _payload(False)
    payload["probes"][0]["latency_ms"] = float("nan")
    bodies: list[bytes] = []

    def handler(request: httpx.Request) -> httpx.Response:
        bodies.append(request.content)
        return httpx.Response(200)

    async with _client(handler) as c:
        result = await HeartbeatClient(c).send(URL, "tok", payload, NOW)
    assert result.status is Status.HEALTHY  # probes re-sanitised, so the always-on tier is delivered
    assert json.loads(bodies[0])["probes"][0]["latency_ms"] is None


async def test_unexpected_exception_type_is_unknown_and_queued() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        raise RuntimeError("boom tok-secret")

    async with _client(handler) as c:
        hb = HeartbeatClient(c)
        result = await hb.send(URL, "tok-secret", _payload(False), NOW)
    assert result.status is Status.UNKNOWN
    assert "RuntimeError" in result.detail
    assert hb.queued == 1


async def test_response_without_usable_status_code_is_unknown() -> None:
    class Weird:
        status_code = None

    class FakeClient:
        async def post(self, *args: Any, **kwargs: Any) -> Weird:
            return Weird()

    hb = HeartbeatClient(FakeClient())  # type: ignore[arg-type]
    result = await hb.send(URL, "tok", _payload(False), NOW)
    assert result.status is Status.UNKNOWN
    assert hb.queued == 1


async def test_token_and_messages_never_leak(caplog: pytest.LogCaptureFixture) -> None:
    caplog.set_level(logging.DEBUG, logger=heartbeat.__name__)
    secret = "tok-secret"  # noqa: S105
    results: list[ProbeResult] = []

    def make(kind: str) -> Callable[[httpx.Request], httpx.Response]:
        def handler(request: httpx.Request) -> httpx.Response:
            if kind == "net":
                raise httpx.ConnectError(f"{secret} {request.url}", request=request)
            if kind == "boom":
                raise RuntimeError(secret)
            return httpx.Response({"401": 401, "5xx": 500, "400": 400}[kind], text=secret)

        return handler

    for kind in ("401", "5xx", "400", "net", "boom"):
        async with _client(make(kind)) as c:
            results.append(await HeartbeatClient(c).send(URL, secret, _payload(True), NOW))
    broken = _payload(True)
    broken["integration_version"] = object()  # serialisation-failure path
    async with _client(lambda r: httpx.Response(200)) as c:
        results.append(await HeartbeatClient(c).send(URL, secret, broken, NOW))
    assert len(results) == 6
    assert secret not in caplog.text  # whole log output, including third-party loggers
    own = "\n".join(r.getMessage() for r in caplog.records if r.name == heartbeat.__name__)
    assert own
    assert secret not in own
    assert "a.test" not in own
    for r in results:
        assert secret not in r.detail
        assert "a.test" not in r.detail


async def test_failure_logged_once_per_kind_and_again_after_recovery(caplog: pytest.LogCaptureFixture) -> None:
    state = {"up": False}

    def handler(request: httpx.Request) -> httpx.Response:
        if not state["up"]:
            raise httpx.ConnectError("x", request=request)
        return httpx.Response(200)

    def warnings() -> list[str]:
        return [r.message for r in caplog.records if r.levelno == logging.WARNING]

    caplog.set_level(logging.WARNING)
    async with _client(handler) as c:
        hb = HeartbeatClient(c)
        for _ in range(3):
            await hb.send(URL, "tok", _payload(False), NOW)
        assert len(warnings()) == 1
        state["up"] = True
        assert (await hb.send(URL, "tok", _payload(False), NOW)).status is Status.HEALTHY
        state["up"] = False
        await hb.send(URL, "tok", _payload(False), NOW)
    assert len(warnings()) == 2


def test_build_payload_survives_odd_devices(caplog: pytest.LogCaptureFixture) -> None:
    heartbeat._BUILD_FAILURES_LOGGED.clear()
    caplog.set_level(logging.WARNING)
    bad = FoxaceSnapshot(installed=True, version="0.39.0", devices=(object(),))  # type: ignore[arg-type]
    for _ in range(2):
        payload = build_payload(
            RESULTS, version="0.1.0", now=NOW, share_diagnostics=True, snapshot=bad, reconnects=0, ha_version="x"
        )
        assert payload["diagnostics"] is None
        assert payload["schema"] == 1
        assert payload["probes"][0]["probe"] == "alarmio"
    warned = [r.message for r in caplog.records if r.levelno == logging.WARNING]
    assert len(warned) == 1
    assert "AttributeError" in warned[0]


def test_build_payload_survives_odd_results() -> None:
    heartbeat._BUILD_FAILURES_LOGGED.clear()
    payload = build_payload(
        {"x": object()},  # type: ignore[dict-item]
        version="0.1.0", now=NOW, share_diagnostics=False, snapshot=None, reconnects=0, ha_version="x",
    )
    assert payload["probes"] == []
    assert payload["diagnostics"] is None


# ---- review fixes: bounded flush, poisoned heads, sanitising ----


def _at(n: int, **extra: Any) -> dict:
    """A payload with a distinct sent_at so request order can be asserted."""
    payload = _payload(False)
    payload["sent_at"] = (NOW + timedelta(minutes=n)).isoformat()
    payload.update(extra)
    return payload


def _order(bodies: list[bytes]) -> list[str]:
    return [json.loads(b)["sent_at"] for b in bodies]


def _ts(n: int) -> str:
    return (NOW + timedelta(minutes=n)).isoformat()


async def test_deterministically_failing_head_is_dropped_after_three_attempts() -> None:
    bodies: list[bytes] = []
    poison = _ts(1)

    def handler(request: httpx.Request) -> httpx.Response:
        bodies.append(request.content)
        if json.loads(request.content)["sent_at"] == poison:
            return httpx.Response(503)
        return httpx.Response(200)

    async with _client(handler) as c:
        hb = HeartbeatClient(c)
        await hb.send(URL, "tok", _at(1), NOW)  # fails as current, queued
        for n in (2, 3):
            assert (await hb.send(URL, "tok", _at(n), NOW)).status is Status.UNKNOWN
        assert _order(bodies).count(poison) == 3
        result = await hb.send(URL, "tok", _at(4), NOW)
    assert result.status is Status.HEALTHY
    assert hb.queued == 0
    # 4th call: the poisoned head's 3rd (last) attempt, then the next queued payloads, current last.
    assert _order(bodies)[3:] == [poison, _ts(2), _ts(3), _ts(4)]
    assert _order(bodies).count(poison) == 4  # 1 as current + 3 as head; never retried after the drop


async def test_flush_is_capped_per_send(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(heartbeat, "MAX_FLUSH_PER_SEND", 4)
    monkeypatch.setattr(heartbeat, "MAX_HEAD_ATTEMPTS", 1000)  # isolate the cap from head dropping
    state = {"up": False}
    bodies: list[bytes] = []

    def handler(request: httpx.Request) -> httpx.Response:
        if not state["up"]:
            raise httpx.ConnectError("x", request=request)
        bodies.append(request.content)
        return httpx.Response(200)

    async with _client(handler) as c:
        hb = HeartbeatClient(c, max_queue=100)
        for n in range(25):
            await hb.send(URL, "tok", _at(n), NOW)
        assert hb.queued == 25
        state["up"] = True
        result = await hb.send(URL, "tok", _at(100), NOW)
    assert result.status is Status.UNKNOWN
    assert "Catching up" in result.detail
    assert _order(bodies) == [_ts(n) for n in range(4)]
    assert hb.queued == 25 - 4 + 1  # current payload queued behind the rest


async def test_flush_deadline_stops_flushing(monkeypatch: pytest.MonkeyPatch) -> None:
    clock = {"t": 0.0}
    monkeypatch.setattr(heartbeat, "time", SimpleNamespace(monotonic=lambda: clock["t"]))
    state = {"up": False}
    bodies: list[bytes] = []

    def handler(request: httpx.Request) -> httpx.Response:
        if not state["up"]:
            raise httpx.ConnectError("x", request=request)
        bodies.append(request.content)
        clock["t"] += 100.0
        return httpx.Response(200)

    async with _client(handler) as c:
        hb = HeartbeatClient(c)
        for n in range(3):
            await hb.send(URL, "tok", _at(n), NOW)
        state["up"] = True
        result = await hb.send(URL, "tok", _at(9), NOW)
    assert result.status is Status.UNKNOWN
    assert _order(bodies) == [_ts(0)]
    assert hb.queued == 3  # two unsent queued payloads + the current one


async def test_request_timeout_never_exceeds_remaining_budget(monkeypatch: pytest.MonkeyPatch) -> None:
    clock = {"t": 0.0}
    monkeypatch.setattr(heartbeat, "time", SimpleNamespace(monotonic=lambda: clock["t"]))
    timeouts: list[float] = []
    state = {"up": False}

    class Spy:
        async def post(self, url: str, **kwargs: Any) -> httpx.Response:
            if not state["up"]:
                raise httpx.ConnectError("x")
            timeouts.append(kwargs["timeout"])
            clock["t"] += 20.0
            return httpx.Response(200)

    hb = HeartbeatClient(Spy())  # type: ignore[arg-type]
    for n in range(4):
        await hb.send(URL, "tok", _at(n), NOW)
    state["up"] = True
    await hb.send(URL, "tok", _at(9), NOW)
    assert timeouts == [10.0, 5.0]  # budget 25s: 10 then 5, then exhausted
    assert all(t <= 10.0 for t in timeouts)


async def test_healthy_latency_times_only_the_current_post(monkeypatch: pytest.MonkeyPatch) -> None:
    clock = {"t": 0.0}
    monkeypatch.setattr(heartbeat, "time", SimpleNamespace(monotonic=lambda: clock["t"]))
    state = {"up": False}

    def handler(request: httpx.Request) -> httpx.Response:
        if not state["up"]:
            raise httpx.ConnectError("x", request=request)
        clock["t"] += 3.0
        return httpx.Response(200)

    async with _client(handler) as c:
        hb = HeartbeatClient(c)
        await hb.send(URL, "tok", _at(0), NOW)
        await hb.send(URL, "tok", _at(1), NOW)
        state["up"] = True
        result = await hb.send(URL, "tok", _at(2), NOW)
    assert result.status is Status.HEALTHY
    assert result.latency_ms == pytest.approx(3000.0)


async def test_trailing_slash_in_proxy_url_is_stripped() -> None:
    seen: list[str] = []

    def handler(request: httpx.Request) -> httpx.Response:
        seen.append(str(request.url))
        return httpx.Response(200)

    async with _client(handler) as c:
        await HeartbeatClient(c).send("https://a.test/", "tok", _payload(False), NOW)
    assert seen == ["https://a.test/api/heartbeat"]


@pytest.mark.parametrize("bad", [float("nan"), float("inf"), float("-inf"), "fast"])
def test_build_payload_sanitises_latency(bad: Any) -> None:
    results = {"alarmio": ProbeResult("alarmio", Status.HEALTHY, NOW, bad, "ok")}
    payload = build_payload(
        results, version="0.1.0", now=NOW, share_diagnostics=False, snapshot=None, reconnects=0, ha_version="x"
    )
    json.dumps(payload, allow_nan=False)
    assert payload["probes"][0]["latency_ms"] is None


def test_build_payload_truncates_and_coerces_strings() -> None:
    results = {"a": ProbeResult("p" * 50, Status.HEALTHY, NOW, 1.0, "d" * 500)}
    payload = build_payload(
        results, version="0.1.0", now=NOW, share_diagnostics=False, snapshot=None, reconnects=0, ha_version="x"
    )
    assert len(payload["probes"][0]["probe"]) == 32
    assert len(payload["probes"][0]["detail"]) == 300


@pytest.mark.parametrize("odd", [Decimal("55.5"), NOW, float("nan")])
def test_build_payload_coerces_non_json_diagnostics(odd: Any) -> None:
    snap = FoxaceSnapshot(installed=True, version="0.39.0", devices=(DeviceHealth("Door", True, 0, odd, 2),))
    payload = build_payload(
        RESULTS, version="0.1.0", now=NOW, share_diagnostics=True, snapshot=snap, reconnects=0, ha_version="x"
    )
    json.dumps(payload, allow_nan=False)
    assert payload["schema"] == 1
    assert payload["probes"][0]["probe"] == "alarmio"
    battery = payload["diagnostics"]["devices"][0]["battery"]
    assert battery is None or isinstance(battery, str)
    assert not (isinstance(battery, float) and math.isnan(battery))


def test_build_payload_falls_back_to_minimal_with_real_timestamp() -> None:
    heartbeat._BUILD_FAILURES_LOGGED.clear()
    payload = build_payload(
        RESULTS, version=object(), now=NOW, share_diagnostics=False, snapshot=None, reconnects=0, ha_version="x"
    )  # type: ignore[arg-type]
    json.dumps(payload, allow_nan=False)
    assert payload["sent_at"] == NOW.isoformat()
    bad_now = build_payload(
        RESULTS, version="v", now=None, share_diagnostics=False, snapshot=None, reconnects=0, ha_version="x"
    )  # type: ignore[arg-type]
    assert bad_now["sent_at"] == "1970-01-01T00:00:00+00:00"
    json.dumps(bad_now, allow_nan=False)


async def test_send_drops_unserialisable_diagnostics_but_delivers_the_rest() -> None:
    payload = _payload(True)
    payload["diagnostics"]["reconnects"] = float("nan")
    bodies: list[bytes] = []

    def handler(request: httpx.Request) -> httpx.Response:
        bodies.append(request.content)
        return httpx.Response(200)

    async with _client(handler) as c:
        result = await HeartbeatClient(c).send(URL, "tok", payload, NOW)
    assert result.status is Status.HEALTHY
    body = json.loads(bodies[0])
    assert body["diagnostics"] is None
    assert body["probes"][0]["probe"] == "alarmio"


# ---- final review fixes ----


def _big_snapshot(count: int) -> FoxaceSnapshot:
    devices = tuple(
        DeviceHealth(f"Sensor number {i:04d} in the long named room", i % 50 != 0, 0, 20 + i % 70, 1 + i % 3)
        for i in range(count)
    )
    return FoxaceSnapshot(installed=True, version="0.39.0", proxy_mode=True, armed=False, devices=devices)


def _compact(payload: dict) -> bytes:
    return json.dumps(payload, separators=(",", ":"), allow_nan=False, ensure_ascii=False).encode()


def test_large_installation_payload_is_trimmed_worst_first() -> None:
    snap = _big_snapshot(400)
    payload = build_payload(
        RESULTS, version="0.1.0", now=NOW, share_diagnostics=True, snapshot=snap, reconnects=0, ha_version="x"
    )
    assert len(_compact(payload)) <= heartbeat.MAX_PAYLOAD_BYTES
    diag = payload["diagnostics"]
    kept = diag["devices"]
    assert diag["devices_truncated"] == 400 - len(kept) > 0
    offline = [d for d in snap.devices if not d.online]
    assert all(not d["online"] for d in kept[: len(offline)])  # every offline device kept, listed first
    batteries = [d["battery"] for d in kept if d["online"]]
    assert batteries == sorted(batteries)  # then lowest battery first


def test_small_installation_is_not_marked_truncated() -> None:
    assert "devices_truncated" not in _payload(True)["diagnostics"]


def test_payload_without_diagnostics_is_unchanged_by_trimming() -> None:
    payload = build_payload(
        RESULTS, version="0.1.0", now=NOW, share_diagnostics=False, snapshot=_big_snapshot(400), reconnects=0,
        ha_version="x",
    )
    assert payload["diagnostics"] is None
    assert set(payload) == {"schema", "sent_at", "integration_version", "probes", "diagnostics"}


def test_diagnostics_dropped_when_it_cannot_fit_even_without_devices(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(heartbeat, "MAX_PAYLOAD_BYTES", 150)
    payload = build_payload(
        RESULTS, version="0.1.0", now=NOW, share_diagnostics=True, snapshot=_big_snapshot(5), reconnects=0,
        ha_version="x" * 50,
    )
    assert payload["diagnostics"] is None


async def test_wire_body_uses_compact_separators() -> None:
    bodies: list[bytes] = []

    def handler(request: httpx.Request) -> httpx.Response:
        bodies.append(request.content)
        assert request.headers["Content-Type"] == "application/json"
        return httpx.Response(200)

    payload = _payload(True)
    async with _client(handler) as c:
        await HeartbeatClient(c).send(URL, "tok", payload, NOW)
    assert bodies[0] == _compact(payload)
    assert b", " not in bodies[0]
    assert b'": ' not in bodies[0]


async def test_413_retries_once_without_diagnostics_and_is_healthy(caplog: pytest.LogCaptureFixture) -> None:
    bodies: list[dict] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        bodies.append(body)
        return httpx.Response(413 if body["diagnostics"] is not None else 200)

    async with _client(handler) as c:
        hb = HeartbeatClient(c)
        with caplog.at_level(logging.WARNING, logger=heartbeat.__name__):
            first = await hb.send(URL, "tok", _payload(True), NOW)
            second = await hb.send(URL, "tok", _payload(True), NOW)
    assert first.status is Status.HEALTHY
    assert second.status is Status.HEALTHY
    assert [b["diagnostics"] is None for b in bodies] == [False, True, False, True]  # never cached as failing
    assert hb.queued == 0
    warnings = [r.getMessage() for r in caplog.records if r.levelno == logging.WARNING]
    assert len(warnings) == 2  # once per episode: the warn-once mark is cleared by the success in between
    assert all("a.test" not in w and "payload-too-large" in w for w in warnings)


async def test_413_without_diagnostics_is_dropped_not_retried_again() -> None:
    calls: list[int] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(1)
        return httpx.Response(413)

    async with _client(handler) as c:
        hb = HeartbeatClient(c)
        result = await hb.send(URL, "tok", _payload(False), NOW)
    assert calls == [1]
    assert result.status is Status.UNKNOWN
    assert hb.queued == 0


async def test_rejection_counter_resets_on_success() -> None:
    state = {"code": 401}

    async def run() -> list[Status]:
        def handler(request: httpx.Request) -> httpx.Response:
            return httpx.Response(state["code"])

        async with _client(handler) as c:
            hb = HeartbeatClient(c)
            out = [(await hb.send(URL, "tok", _payload(False), NOW)).status for _ in range(2)]
            state["code"] = 200
            out.append((await hb.send(URL, "tok", _payload(False), NOW)).status)
            state["code"] = 401
            out += [(await hb.send(URL, "tok", _payload(False), NOW)).status for _ in range(2)]
        return out

    assert await run() == [Status.UNKNOWN, Status.UNKNOWN, Status.HEALTHY, Status.UNKNOWN, Status.UNKNOWN]


async def test_server_and_network_errors_do_not_advance_rejection_counter() -> None:
    codes = iter([401, 401, 503, "net", 401])

    def handler(request: httpx.Request) -> httpx.Response:
        code = next(codes)
        if code == "net":
            raise httpx.ConnectError("x", request=request)
        return httpx.Response(code)

    async with _client(handler) as c:
        hb = HeartbeatClient(c)
        out = [(await hb.send(URL, "tok", _payload(False), NOW)).status for _ in range(3)]
        assert out == [Status.UNKNOWN] * 3
        assert hb._rejections == 2  # noqa: SLF001
        assert hb.queued >= 1


async def test_redirect_is_not_followed_and_is_retryable() -> None:
    calls: list[str] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(str(request.url))
        return httpx.Response(307, headers={"Location": "https://evil.test/api/heartbeat"})

    client = httpx.AsyncClient(transport=httpx.MockTransport(handler), follow_redirects=True)
    async with client as c:
        hb = HeartbeatClient(c)
        result = await hb.send(URL, "tok", _payload(False), NOW)
    assert calls == ["https://a.test/api/heartbeat"]
    assert result.status is Status.UNKNOWN
    assert hb.queued == 1


@pytest.mark.parametrize("url", ["http://alarmio.example", "http://192.168.1.5:8200", "ftp://a.test"])
async def test_non_https_url_is_refused_and_token_not_sent(url: str, caplog: pytest.LogCaptureFixture) -> None:
    calls: list[int] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(1)
        return httpx.Response(200)

    async with _client(handler) as c:
        hb = HeartbeatClient(c)
        with caplog.at_level(logging.WARNING, logger=heartbeat.__name__):
            result = await hb.send(url, "tok", _payload(False), NOW)
            await hb.send(url, "tok", _payload(False), NOW)
    assert calls == []
    assert result.status is Status.UNKNOWN
    assert "not HTTPS" in result.detail
    warnings = [r.getMessage() for r in caplog.records if r.levelno == logging.WARNING]
    assert len(warnings) == 1
    assert "alarmio.example" not in warnings[0]


@pytest.mark.parametrize("url", ["http://localhost:8200", "http://127.0.0.1:8200", "http://[::1]:8200", URL])
async def test_loopback_and_https_urls_are_allowed(url: str) -> None:
    async with _client(lambda r: httpx.Response(200)) as c:
        result = await HeartbeatClient(c).send(url, "tok", _payload(False), NOW)
    assert result.status is Status.HEALTHY

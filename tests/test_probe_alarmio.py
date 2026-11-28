import ssl
from datetime import UTC, datetime

import httpx
import pytest

from custom_components.alarmio_health.models import Status
from custom_components.alarmio_health.probes.alarmio import classify_tls, probe_alarmio, probe_tls

NOW = datetime(2026, 11, 26, 12, 0, tzinfo=UTC)


def _client(handler) -> httpx.AsyncClient:
    return httpx.AsyncClient(transport=httpx.MockTransport(handler))


async def test_healthy_on_200() -> None:
    async with _client(lambda r: httpx.Response(200, json={"status": "ok"})) as c:
        result = await probe_alarmio(c, "https://alarmio.test", lambda: NOW)
    assert result.status is Status.HEALTHY
    assert result.latency_ms is not None


async def test_reachability_get_asks_for_a_fresh_connection() -> None:
    seen: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        seen.append(request)
        return httpx.Response(200, json={"status": "ok"})

    async with _client(handler) as c:
        await probe_alarmio(c, "https://alarmio.test", lambda: NOW)
    assert seen[0].headers["connection"] == "close"


async def test_degraded_when_slower_than_threshold() -> None:
    async with _client(lambda r: httpx.Response(200, json={"status": "ok"})) as c:
        result = await probe_alarmio(c, "https://alarmio.test", lambda: NOW, degraded_ms=0.0)
    assert result.status is Status.DEGRADED


async def test_down_on_http_error_status() -> None:
    async with _client(lambda r: httpx.Response(503)) as c:
        result = await probe_alarmio(c, "https://alarmio.test", lambda: NOW)
    assert result.status is Status.DOWN
    assert "503" in result.detail


async def test_down_on_timeout_with_actionable_detail() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ReadTimeout("slow", request=request)

    async with _client(handler) as c:
        result = await probe_alarmio(c, "https://alarmio.test", lambda: NOW)
    assert result.status is Status.DOWN
    assert "did not answer" in result.detail
    assert "status.alarmio.net" not in result.detail
    assert result.detail == (
        "Alarmio did not answer within 10s. Check your internet connection and try again later."
    )


async def test_down_on_connection_error() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("refused", request=request)

    async with _client(handler) as c:
        result = await probe_alarmio(c, "https://alarmio.test", lambda: NOW)
    assert result.status is Status.DOWN
    assert "internet" in result.detail


async def test_unknown_when_foxace_is_in_direct_mode() -> None:
    async with _client(lambda r: httpx.Response(200)) as c:
        result = await probe_alarmio(c, None, lambda: NOW)
    assert result.status is Status.UNKNOWN


@pytest.mark.parametrize(
    ("days", "status"),
    [(60.0, Status.HEALTHY), (10.0, Status.DEGRADED), (-1.0, Status.DOWN)],
)
def test_classify_tls(days: float, status: Status) -> None:
    assert classify_tls(days, NOW).status is status


class _FakeSSL:
    def __init__(self, cert: dict[str, str]) -> None:
        self._cert = cert

    def getpeercert(self) -> dict[str, str]:
        return self._cert


class _FakeWriter:
    def __init__(self, cert: dict[str, str], wait_closed_error: Exception | None = None) -> None:
        self._ssl = _FakeSSL(cert)
        self._wait_closed_error = wait_closed_error
        self.closed = False
        self.waited = False

    def get_extra_info(self, name: str) -> _FakeSSL:
        return self._ssl

    def close(self) -> None:
        self.closed = True

    async def wait_closed(self) -> None:
        self.waited = True
        if self._wait_closed_error:
            raise self._wait_closed_error


def _patch_connection(monkeypatch: pytest.MonkeyPatch, writer: _FakeWriter) -> None:
    async def fake(*args: object, **kwargs: object) -> tuple[None, _FakeWriter]:
        return None, writer

    monkeypatch.setattr("custom_components.alarmio_health.probes.alarmio.asyncio.open_connection", fake)


async def test_tls_invalid_port_returns_unknown() -> None:
    result = await probe_tls("https://example.test:99999", lambda: NOW)
    assert result.status is Status.UNKNOWN


async def test_tls_malformed_cert_date_returns_unknown(monkeypatch: pytest.MonkeyPatch) -> None:
    writer = _FakeWriter({"notAfter": "not a date"})
    _patch_connection(monkeypatch, writer)
    result = await probe_tls("https://example.test", lambda: NOW)
    assert result.status is Status.UNKNOWN
    assert writer.closed and writer.waited


async def test_tls_connection_closed_on_happy_path(monkeypatch: pytest.MonkeyPatch) -> None:
    writer = _FakeWriter({"notAfter": "Jan  1 00:00:00 2099 GMT"})
    _patch_connection(monkeypatch, writer)
    result = await probe_tls("https://example.test", lambda: NOW)
    assert result.status is Status.HEALTHY
    assert writer.closed and writer.waited


async def test_tls_wait_closed_error_does_not_escape(monkeypatch: pytest.MonkeyPatch) -> None:
    writer = _FakeWriter({"notAfter": "Jan  1 00:00:00 2099 GMT"}, wait_closed_error=OSError("boom"))
    _patch_connection(monkeypatch, writer)
    result = await probe_tls("https://example.test", lambda: NOW)
    assert result.status is Status.HEALTHY


async def test_health_redirect_is_not_followed() -> None:
    calls: list[str] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(str(request.url))
        return httpx.Response(307, headers={"Location": "https://evil.test/api/health"})

    client = httpx.AsyncClient(transport=httpx.MockTransport(handler), follow_redirects=True)
    async with client as c:
        result = await probe_alarmio(c, "https://alarmio.test", lambda: NOW)
    assert calls == ["https://alarmio.test/api/health"]
    assert result.status is Status.DOWN
    assert "307" in result.detail


async def test_tls_uses_the_supplied_context(monkeypatch: pytest.MonkeyPatch) -> None:
    seen: dict[str, object] = {}

    async def fake(*args: object, **kwargs: object) -> tuple[None, _FakeWriter]:
        seen.update(kwargs)
        return None, _FakeWriter({"notAfter": "Jan  1 00:00:00 2099 GMT"})

    monkeypatch.setattr("custom_components.alarmio_health.probes.alarmio.asyncio.open_connection", fake)
    monkeypatch.setattr(
        "custom_components.alarmio_health.probes.alarmio.ssl.create_default_context",
        lambda *a, **k: pytest.fail("a context was created although one was supplied"),
    )
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    result = await probe_tls("https://example.test", lambda: NOW, ssl_context=context)
    assert result.status is Status.HEALTHY
    assert seen["ssl"] is context

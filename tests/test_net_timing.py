"""Staged timing from httpcore trace events, and against a real local server."""

import asyncio

import httpx
import pytest

from custom_components.alarmio_health.models import StageTimings
from custom_components.alarmio_health.net.timing import StageRecorder


async def test_stages_from_fake_events() -> None:
    clock = iter([0.0, 0.1, 0.1, 0.3, 0.3, 0.8]).__next__
    rec = StageRecorder(clock=clock)
    for event in (
        "connection.connect_tcp.started", "connection.connect_tcp.complete",
        "connection.start_tls.started", "connection.start_tls.complete",
        "http11.receive_response_headers.started", "http11.receive_response_headers.complete",
    ):
        await rec(event, {})
    t = rec.timings()
    assert t.connect_ms == pytest.approx(100) and t.tls_ms == pytest.approx(200) and t.wait_ms == pytest.approx(500)


async def test_unrelated_and_failed_events_are_ignored() -> None:
    rec = StageRecorder(clock=iter([0.0, 1.0]).__next__)
    await rec("http11.send_request_headers.started", {})
    await rec("connection.connect_tcp.started", {})
    await rec("connection.connect_tcp.failed", {})
    assert rec.timings() == StageTimings()


async def _serve(delay: float) -> tuple[asyncio.AbstractServer, int]:
    async def handle(reader: asyncio.StreamReader, writer: asyncio.StreamWriter) -> None:
        await reader.readuntil(b"\r\n\r\n")
        await asyncio.sleep(delay)
        writer.write(b"HTTP/1.1 200 OK\r\nContent-Length: 2\r\nConnection: close\r\n\r\nok")
        await writer.drain()
        writer.close()

    server = await asyncio.start_server(handle, "127.0.0.1", 0)
    return server, server.sockets[0].getsockname()[1]


@pytest.mark.usefixtures("socket_enabled")
async def test_real_request_has_connect_and_wait_but_no_tls() -> None:
    server, port = await _serve(0.2)
    try:
        rec = StageRecorder()
        async with httpx.AsyncClient() as client:
            response = await client.get(f"http://127.0.0.1:{port}/", extensions={"trace": rec})
        assert response.status_code == 200
        t = rec.timings()
        assert t.connect_ms is not None and t.connect_ms < 1000
        assert t.tls_ms is None
        assert t.wait_ms is not None and t.wait_ms >= 150
    finally:
        server.close()
        await server.wait_closed()


@pytest.mark.usefixtures("socket_enabled")
async def test_a_reused_connection_reports_no_connect() -> None:
    async def handle(reader: asyncio.StreamReader, writer: asyncio.StreamWriter) -> None:
        try:
            while True:
                await reader.readuntil(b"\r\n\r\n")
                writer.write(b"HTTP/1.1 200 OK\r\nContent-Length: 2\r\n\r\nok")
                await writer.drain()
        except (asyncio.IncompleteReadError, ConnectionError):
            writer.close()

    server = await asyncio.start_server(handle, "127.0.0.1", 0)
    port = server.sockets[0].getsockname()[1]
    try:
        async with httpx.AsyncClient() as client:
            await client.get(f"http://127.0.0.1:{port}/")
            rec = StageRecorder()
            await client.get(f"http://127.0.0.1:{port}/", extensions={"trace": rec})
        assert rec.timings().connect_ms is None
    finally:
        server.close()
        await server.wait_closed()

"""Probes that check the Alarmio proxy from the subscriber's side."""

from __future__ import annotations

import asyncio
import logging
import ssl
import time
from collections.abc import Callable
from datetime import datetime
from urllib.parse import urlparse

import httpx

from ..models import ProbeResult, Status

_LOGGER = logging.getLogger(__name__)
TLS_WARN_DAYS = 14.0


async def probe_alarmio(
    client: httpx.AsyncClient,
    proxy_url: str | None,
    now: Callable[[], datetime],
    degraded_ms: float = 1000.0,
    timeout: float = 10.0,
) -> ProbeResult:
    """GET {proxy_url}/api/health and time it."""
    checked_at = now()
    if not proxy_url:
        return ProbeResult(
            "alarmio", Status.UNKNOWN, checked_at, detail="foXaCe is not using Alarmio (direct mode)."
        )
    started = time.perf_counter()
    try:
        response = await client.get(f"{proxy_url}/api/health", timeout=timeout, follow_redirects=False)
    except httpx.TimeoutException:
        return ProbeResult(
            "alarmio",
            Status.DOWN,
            checked_at,
            detail=f"Alarmio did not answer within {timeout:.0f}s. Check your internet connection and try again later.",
        )
    except httpx.HTTPError as err:
        _LOGGER.debug("Alarmio probe failed: %s", type(err).__name__)
        return ProbeResult(
            "alarmio",
            Status.DOWN,
            checked_at,
            detail=f"Cannot reach Alarmio ({type(err).__name__}). Check your internet connection.",
        )
    latency_ms = (time.perf_counter() - started) * 1000
    if response.status_code != 200:
        return ProbeResult(
            "alarmio", Status.DOWN, checked_at, latency_ms, f"Alarmio answered HTTP {response.status_code}."
        )
    if latency_ms > degraded_ms:
        return ProbeResult(
            "alarmio", Status.DEGRADED, checked_at, latency_ms, f"Alarmio is slow ({latency_ms:.0f} ms)."
        )
    return ProbeResult("alarmio", Status.HEALTHY, checked_at, latency_ms)


def classify_tls(days_remaining: float, checked_at: datetime) -> ProbeResult:
    """Map certificate days remaining to a status."""
    if days_remaining < 0:
        return ProbeResult("tls", Status.DOWN, checked_at, detail="Alarmio's certificate has expired.")
    if days_remaining <= TLS_WARN_DAYS:
        return ProbeResult(
            "tls", Status.DEGRADED, checked_at, detail=f"Alarmio's certificate expires in {days_remaining:.0f} days."
        )
    return ProbeResult("tls", Status.HEALTHY, checked_at)


def _tls_unknown(checked_at: datetime, err: Exception) -> ProbeResult:
    """Log only the exception class (never the URL) and return an UNKNOWN result."""
    _LOGGER.debug("TLS probe failed: %s", type(err).__name__)
    return ProbeResult(
        "tls", Status.UNKNOWN, checked_at, detail=f"Could not read the certificate ({type(err).__name__})."
    )


async def probe_tls(
    proxy_url: str | None,
    now: Callable[[], datetime],
    timeout: float = 10.0,
    *,
    ssl_context: ssl.SSLContext | None = None,
) -> ProbeResult:
    """Read the server certificate expiry. Not run for plain-http URLs. Never raises.

    Pass a shared `ssl_context` (verification on) to avoid loading the CA bundle on every call; without one a
    default context is created lazily.
    """
    checked_at = now()
    try:
        parsed = urlparse(proxy_url or "")
        port = parsed.port or 443
    except ValueError as err:
        return _tls_unknown(checked_at, err)
    if parsed.scheme != "https" or not parsed.hostname:
        return ProbeResult("tls", Status.UNKNOWN, checked_at, detail="No HTTPS Alarmio URL to check.")
    try:
        context = ssl_context or ssl.create_default_context()
        _, writer = await asyncio.wait_for(
            asyncio.open_connection(parsed.hostname, port, ssl=context, server_hostname=parsed.hostname),
            timeout=timeout,
        )
    except (TimeoutError, OSError, ssl.SSLError, ValueError) as err:
        return _tls_unknown(checked_at, err)
    try:
        ssl_object = writer.get_extra_info("ssl_object")
        cert = ssl_object.getpeercert() if ssl_object else None
        if not cert or "notAfter" not in cert:
            return ProbeResult("tls", Status.UNKNOWN, checked_at, detail="Alarmio sent no readable certificate.")
        days = (ssl.cert_time_to_seconds(cert["notAfter"]) - time.time()) / 86400
    except (OSError, ValueError, ssl.SSLError) as err:
        return _tls_unknown(checked_at, err)
    finally:
        writer.close()
        try:
            await writer.wait_closed()
        except (OSError, ssl.SSLError) as err:
            _LOGGER.debug("TLS probe close failed: %s", type(err).__name__)
    return classify_tls(days, checked_at)

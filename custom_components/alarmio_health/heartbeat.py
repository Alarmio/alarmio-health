"""Heartbeat to the Alarmio VPS (always-on minimal tier, opt-in diagnostics tier).

Nothing in this module raises to its caller, and nothing logs or returns tokens, URLs, payload contents or
exception messages: only exception class names.
"""

from __future__ import annotations

import json
import logging
import math
import time
from collections import deque
from dataclasses import dataclass
from datetime import datetime
from typing import Any
from urllib.parse import urlparse

import httpx

from .models import FoxaceSnapshot, ProbeResult, StageTimings, Status
from .net.timing import StageRecorder

_LOGGER = logging.getLogger(__name__)
SCHEMA = 1
SCHEMA_ECHO = 2
SCHEMA2_RETRY_AFTER_S = 3600.0
_RENEWING_DETAIL = "Alarmio is renewing the session. foXaCe does this automatically."
_NOT_HTTPS_DETAIL = "Alarmio URL is not HTTPS, so the session token was not sent."
_LOOPBACK_HOSTS = frozenset({"localhost", "127.0.0.1", "::1"})
REJECTIONS_BEFORE_DOWN = 3  # consecutive 401/403 answers before the session is reported DOWN
MAX_PAYLOAD_BYTES = 12 * 1024  # the server rejects bodies over 16 KiB with 413; stay well below
_REJECTED_DETAIL = "Alarmio rejected the session. Sign in again in the foXaCe integration settings."
_BUILD_FAILURES_LOGGED: set[str] = set()
MAX_HEAD_ATTEMPTS = 3  # consecutive retryable failures of the queue head before it is dropped
MAX_FLUSH_PER_SEND = 10  # queued payloads flushed per send() call
FLUSH_DEADLINE_S = 25.0  # total time budget for one send() call
_REQUEST_TIMEOUT_S = 10.0
_CATCH_UP_DETAIL = "Catching up on queued heartbeats."
_EPOCH = "1970-01-01T00:00:00+00:00"


def _log_build_failure(part: str, err: Exception) -> None:
    """Log a build_payload failure once per (part, exception class)."""
    key = f"{part}:{type(err).__name__}"
    if key not in _BUILD_FAILURES_LOGGED:
        _BUILD_FAILURES_LOGGED.add(key)
        _LOGGER.warning("Heartbeat %s could not be built (%s); sending without it", part, type(err).__name__)


def _classify(status_code: int) -> str:
    """Classify an HTTP status: ok, rejected (401/403), permanent (other 4xx except 429) or retry."""
    if 200 <= status_code < 300:
        return "ok"
    if status_code in (401, 403):
        return "rejected"
    if 400 <= status_code < 500 and status_code != 429:
        return "permanent"
    return "retry"


def _jsonable(value: Any, depth: int = 0) -> Any:
    """Coerce `value` to something `json.dumps(allow_nan=False)` accepts: non-finite floats become None."""
    if value is None or isinstance(value, (bool, int, str)):
        return value
    if isinstance(value, float):
        return value if math.isfinite(value) else None
    if depth > 6:
        return str(value)
    if isinstance(value, dict):
        return {str(k): _jsonable(v, depth + 1) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [_jsonable(v, depth + 1) for v in value]
    return str(value)


def _latency(value: Any) -> float | None:
    """A finite number, or None."""
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None
    return float(value) if math.isfinite(value) else None


def _probe_entry(probe: Any, status: Any, latency: Any, detail: Any) -> dict[str, Any]:
    """One sanitised probe entry."""
    return {
        "probe": str(probe)[:32],
        "status": str(getattr(status, "value", status)),
        "latency_ms": _latency(latency),
        "detail": str(detail)[:300],
    }


def _sanitise_probes(probes: Any) -> list[dict[str, Any]]:
    """Re-sanitise an already-built probes list (used on payloads handed straight to `send`). Never raises."""
    try:
        return [
            _probe_entry(p.get("probe", ""), p.get("status", ""), p.get("latency_ms"), p.get("detail", ""))
            for p in probes
            if isinstance(p, dict)
        ]
    except Exception:  # noqa: BLE001
        return []


def _encode(payload: Any) -> bytes:
    """Compact, strict UTF-8 JSON: exactly what goes on the wire."""
    return json.dumps(payload, separators=(",", ":"), allow_nan=False, ensure_ascii=False).encode()


def _device_badness(device: dict[str, Any]) -> tuple[bool, float, float]:
    """Sort key, worst first: offline, then lowest battery, then lowest signal (unknown sorts as best)."""
    def number(value: Any) -> float:
        return float(value) if isinstance(value, (int, float)) and not isinstance(value, bool) else math.inf

    return (bool(device.get("online")), number(device.get("battery")), number(device.get("signal")))


def _fit_diagnostics(payload: dict[str, Any]) -> None:
    """Trim `diagnostics["devices"]` worst-first until the compact body fits MAX_PAYLOAD_BYTES (in place).

    Adds `devices_truncated` with the number dropped; drops diagnostics entirely if even zero devices do not fit.
    """
    diag = payload.get("diagnostics")
    if not isinstance(diag, dict) or len(_encode(payload)) <= MAX_PAYLOAD_BYTES:
        return
    devices = sorted(diag.get("devices") or [], key=_device_badness)
    total = len(devices)
    lo, hi = 0, total  # largest keep-count in [lo, hi] that fits
    while lo < hi:
        mid = (lo + hi + 1) // 2
        payload["diagnostics"] = {**diag, "devices": devices[:mid], "devices_truncated": total - mid}
        if len(_encode(payload)) <= MAX_PAYLOAD_BYTES:
            lo = mid
        else:
            hi = mid - 1
    payload["diagnostics"] = {**diag, "devices": devices[:lo], "devices_truncated": total - lo}
    if len(_encode(payload)) > MAX_PAYLOAD_BYTES:
        payload["diagnostics"] = None


def _encode_error(payload: Any) -> Exception | None:
    """Return the error raised when serialising `payload` strictly, or None if it serialises."""
    try:
        _encode(payload)
    except Exception as err:  # noqa: BLE001
        return err
    return None


@dataclass(frozen=True, slots=True)
class Exchange:
    """The answer to the current heartbeat POST: HTTP status, parsed reply, stage timings and elapsed time."""

    status: int
    reply: dict[str, Any] | None
    timings: StageTimings
    elapsed_s: float
    downgraded: bool = False


def downgrade_to_schema1(payload: dict[str, Any]) -> dict[str, Any]:
    """The same heartbeat as a schema-1 body: no echo, no net."""
    return {**{k: v for k, v in payload.items() if k not in ("echo", "net")}, "schema": SCHEMA}


def build_payload(
    results: dict[str, ProbeResult],
    *,
    version: str,
    now: datetime,
    share_diagnostics: bool,
    snapshot: FoxaceSnapshot | None,
    reconnects: int,
    ha_version: str,
    net: dict[str, Any] | None = None,
    echo: tuple[str, int] | None = None,
) -> dict[str, Any]:
    """Build the heartbeat body. Diagnostics are included only when the user opted in.

    Never raises and always returns a strictly JSON-serialisable payload: values are sanitised, and as a last
    resort diagnostics, then everything but the schema header, are dropped (logged once by class name).
    """
    failed = False
    diagnostics: dict[str, Any] | None = None
    if share_diagnostics and snapshot is not None:
        try:
            diagnostics = _jsonable({
                "reconnects": reconnects,
                "ha_version": ha_version,
                "foxace_version": snapshot.version,
                "proxy_mode": snapshot.proxy_mode,
                "armed": snapshot.armed,
                "devices": [
                    {"name": d.name, "online": d.online, "malfunctions": d.malfunctions,
                     "battery": d.battery_level, "signal": d.signal_strength}
                    for d in snapshot.devices
                ],
            })
        except Exception as err:  # noqa: BLE001 - must never break the coordinator
            _log_build_failure("diagnostics", err)
            diagnostics = None
            failed = True
    probes: list[dict[str, Any]] = []
    try:
        probes = [_probe_entry(r.probe, r.status, r.latency_ms, r.detail) for r in results.values()]
    except Exception as err:  # noqa: BLE001
        _log_build_failure("probes", err)
        probes = []
        failed = True
    try:
        sent_at = now.isoformat()
    except Exception as err:  # noqa: BLE001
        _log_build_failure("timestamp", err)
        sent_at = _EPOCH
        failed = True
    try:
        version_text = str(version)
    except Exception as err:  # noqa: BLE001
        _log_build_failure("version", err)
        version_text = ""
        failed = True
    payload: dict[str, Any] = {
        "schema": SCHEMA,
        "sent_at": sent_at,
        "integration_version": version_text,
        "probes": probes,
        "diagnostics": diagnostics,
    }
    if echo is not None:
        try:
            payload["schema"] = SCHEMA_ECHO
            payload["echo"] = {"id": str(echo[0]), "seq": int(echo[1])}
            payload["net"] = _jsonable(net or {})
        except Exception as echo_err:  # noqa: BLE001 - never break the heartbeat over the echo
            _log_build_failure("echo", echo_err)
            payload["schema"] = SCHEMA
            payload.pop("echo", None)
            payload.pop("net", None)
            failed = True
    err = _encode_error(payload)
    if err is None:
        try:
            _fit_diagnostics(payload)
        except Exception as fit_err:  # noqa: BLE001
            _log_build_failure("size", fit_err)
            payload["diagnostics"] = None
            failed = True
    else:
        _log_build_failure("payload", err)
        failed = True
        payload["diagnostics"] = None
        if _encode_error(payload) is not None:
            payload = {"schema": SCHEMA, "sent_at": sent_at, "integration_version": version_text,
                       "probes": [], "diagnostics": None}
    if not failed:
        _BUILD_FAILURES_LOGGED.clear()
    return payload


class HeartbeatClient:
    """Sends heartbeats; queues them (bounded) while Alarmio is unreachable. `send` never raises."""

    def __init__(self, client: httpx.AsyncClient, max_queue: int = 100) -> None:
        self._client = client
        self._queue: deque[dict[str, Any]] = deque(maxlen=max_queue)
        self._logged: set[str] = set()
        self._head: dict[str, Any] | None = None  # the payload the failure counter below refers to
        self._head_fails = 0
        self._rejections = 0  # consecutive 401/403 answers; reset by any confirmed 2xx
        self.last_exchange: Exchange | None = None
        self.current_attempted = False  # True once the current payload was actually POSTed this send
        self._schema2_blocked_until = 0.0

    @property
    def queued(self) -> int:
        """Number of payloads waiting to be delivered."""
        return len(self._queue)

    def _warn_once(self, kind: str, message: str) -> None:
        """Log a WARNING the first time `kind` fails; `kind` is re-armed after a successful send."""
        if kind not in self._logged:
            self._logged.add(kind)
            _LOGGER.warning(message, kind)

    def _unknown(self, now: datetime, kind: str, detail: str) -> ProbeResult:
        """Log (once per kind) and return an UNKNOWN session result."""
        self._warn_once(kind, "Heartbeat not delivered (%s)")
        return ProbeResult("session", Status.UNKNOWN, now, detail=detail)

    def _catch_up(self, now: datetime, payload: dict[str, Any]) -> ProbeResult:
        """Stop flushing: keep the current payload queued and report UNKNOWN."""
        self._queue.append(payload)
        return self._unknown(now, "catch-up", _CATCH_UP_DETAIL)

    def _head_failed(self) -> bool:
        """Count a retryable failure of the queue head; drop it (and return True) at MAX_HEAD_ATTEMPTS."""
        head = self._queue[0]
        self._head_fails = self._head_fails + 1 if head is self._head else 1
        self._head = head
        if self._head_fails < MAX_HEAD_ATTEMPTS:
            return False
        self._queue.popleft()
        self._head, self._head_fails = None, 0
        self._warn_once("drop-head", "Heartbeat payload undeliverable after repeated attempts (%s); dropped")
        return True

    def _delivered_head(self) -> None:
        """A queued payload was delivered (or permanently rejected): reset the head failure counter."""
        self._queue.popleft()
        self._head, self._head_fails = None, 0

    @staticmethod
    def _encodable(payload: dict[str, Any]) -> tuple[dict[str, Any] | None, Exception | None]:
        """The payload to send: as given, or without diagnostics and with probes re-sanitised. None if hopeless."""
        err = _encode_error(payload)
        if err is None:
            return payload, None
        try:
            rescued = {**payload, "diagnostics": None, "probes": _sanitise_probes(payload.get("probes"))}
        except Exception:  # noqa: BLE001
            return None, err
        return (rescued, None) if _encode_error(rescued) is None else (None, err)

    async def send(
        self, proxy_url: str | None, token: str | None, payload: dict[str, Any], now: datetime
    ) -> ProbeResult:
        """Send queued payloads then this one. Returns the `session` probe result; never raises."""
        try:
            return await self._send(proxy_url, token, payload, now)
        except Exception as err:  # noqa: BLE001 - last-resort guard, class name only
            name = type(err).__name__
            return self._unknown(now, name, f"Not reporting to Alarmio ({name}). Will retry.")

    async def _send(
        self, proxy_url: str | None, token: str | None, payload: dict[str, Any], now: datetime
    ) -> ProbeResult:
        """Implementation of `send`; may raise, the caller guards it."""
        self.last_exchange = None
        self.current_attempted = False
        if not proxy_url or not token:
            return ProbeResult("session", Status.UNKNOWN, now, detail="No Alarmio session available yet.")
        if not self._https_ok(proxy_url):
            return self._unknown(now, "not-https", _NOT_HTTPS_DETAIL)
        encodable, error = self._encodable(payload)
        if encodable is None:
            # Can never be delivered, so queueing it would only poison the queue.
            name = type(error).__name__
            return self._unknown(now, f"serialise:{name}", f"Heartbeat could not be encoded ({name}); skipped.")
        payload = encodable
        started = time.monotonic()
        url = f"{proxy_url.rstrip('/')}/api/heartbeat"
        # Oldest first. Older payloads are retried; the current one is queued only if it could not be delivered.
        flushed = 0
        while self._queue:
            remaining = FLUSH_DEADLINE_S - (time.monotonic() - started)
            if flushed >= MAX_FLUSH_PER_SEND or remaining <= 0:
                return self._catch_up(now, payload)
            flushed += 1
            outcome = await self._attempt(url, token, self._queue[0], now, min(_REQUEST_TIMEOUT_S, remaining))
            kind = "retry" if isinstance(outcome, ProbeResult) else _classify(outcome)
            renewing: ProbeResult | None = None
            if kind == "rejected":
                rejection, final = self._rejection(now)
                if not final:
                    kind, renewing = "retry", rejection
            if kind == "retry":
                if self._head_failed():
                    continue  # poisoned head dropped; carry on with the next payload
                self._queue.append(payload)
                if renewing is not None:
                    return renewing
                return outcome if isinstance(outcome, ProbeResult) else self._retryable(now, outcome)
            self._delivered_head()
            if kind == "ok":
                self._rejections = 0
            if kind == "rejected":
                self._queue.append(payload)  # never sent; keep it for after the user signs in again
                return rejection
            if kind == "permanent":
                self._warn_once("http-4xx", "Heartbeat payload permanently rejected (%s); dropped")
        remaining = FLUSH_DEADLINE_S - (time.monotonic() - started)
        if remaining <= 0:
            return self._catch_up(now, payload)
        post_started = time.monotonic()
        outcome = await self._attempt(url, token, payload, now, min(_REQUEST_TIMEOUT_S, remaining), capture=True)
        latency_ms = (time.monotonic() - post_started) * 1000
        if isinstance(outcome, ProbeResult):
            self._queue.append(payload)
            return outcome
        kind = _classify(outcome)
        if outcome == 413 and payload.get("diagnostics") is not None:
            self._warn_once("payload-too-large", "Heartbeat payload too large (%s); retrying without diagnostics")
            payload = {**payload, "diagnostics": None}
            outcome = await self._attempt(url, token, payload, now, _REQUEST_TIMEOUT_S, capture=True)
            if isinstance(outcome, ProbeResult):
                self._queue.append(payload)
                return outcome
            kind = _classify(outcome)
        if kind == "rejected":
            rejection, final = self._rejection(now)
            if not final:
                self._queue.append(payload)  # keep it: foXaCe renews the session by itself
            return rejection
        if kind == "permanent":
            self._warn_once("http-4xx", "Heartbeat payload permanently rejected (%s); dropped")
            return ProbeResult(
                "session", Status.UNKNOWN, now, detail=f"Alarmio refused the heartbeat (HTTP {outcome})."
            )
        if kind == "retry":
            self._queue.append(payload)
            return self._retryable(now, outcome)
        self._logged.clear()
        self._rejections = 0
        return ProbeResult("session", Status.HEALTHY, now, latency_ms)

    async def _attempt(
        self, url: str, token: str, body: dict[str, Any], now: datetime, timeout: float, capture: bool = False
    ) -> int | ProbeResult:
        """POST one payload, downgrading schema-2 bodies to schema 1 while the server is known not to accept them."""
        downgraded = False
        if body.get("schema") == SCHEMA_ECHO and time.monotonic() < self._schema2_blocked_until:
            body = downgrade_to_schema1(body)
            downgraded = True
        outcome = await self._post(url, token, body, now, timeout, capture, downgraded)
        if outcome == 422 and body.get("schema") == SCHEMA_ECHO:
            self._schema2_blocked_until = time.monotonic() + SCHEMA2_RETRY_AFTER_S
            self._warn_once(
                "schema2-rejected",
                "Alarmio does not support timing echoes yet (%s); sending the basic heartbeat for an hour",
            )
            outcome = await self._post(url, token, downgrade_to_schema1(body), now, timeout, capture, downgraded=True)
        return outcome

    async def _post(
        self,
        url: str,
        token: str,
        body: dict[str, Any],
        now: datetime,
        timeout: float,
        capture: bool = False,
        downgraded: bool = False,
    ) -> int | ProbeResult:
        """POST one body. Returns the HTTP status code, or an UNKNOWN result if the call itself failed."""
        # Connection: close on every POST, so none can reuse a pooled connection that died during an outage.
        headers = {"X-Session-Token": token, "Content-Type": "application/json", "Connection": "close"}
        extensions: dict[str, Any] = {}
        recorder: StageRecorder | None = None
        if capture:
            self.current_attempted = True
            recorder = StageRecorder()
            extensions["trace"] = recorder
        started = time.monotonic()
        try:
            response = await self._client.post(
                url,
                content=_encode(body),
                headers=headers,
                timeout=timeout,
                follow_redirects=False,  # never carry the session token to another host
                extensions=extensions or None,
            )
            status = int(response.status_code)
            if recorder is not None:
                self.last_exchange = Exchange(
                    status, self._reply(response, status), recorder.timings(), time.monotonic() - started, downgraded
                )
            return status
        except Exception as err:  # noqa: BLE001 - network errors and anything unexpected
            if recorder is not None:
                self.last_exchange = None  # no reply came back for this send, whatever an earlier try returned
            name = type(err).__name__
            return self._unknown(now, name, f"Not reporting to Alarmio ({name}). Will retry.")

    @staticmethod
    def _reply(response: httpx.Response, status: int) -> dict[str, Any] | None:
        """The parsed JSON object of a 2xx answer, else None."""
        if not 200 <= status < 300:
            return None
        try:
            data = response.json()
        except ValueError:
            return None
        return data if isinstance(data, dict) else None

    def _rejection(self, now: datetime) -> tuple[ProbeResult, bool]:
        """Count a 401/403. Returns the result and whether it is final (DOWN) rather than a renewal in progress."""
        self._rejections += 1
        if self._rejections < REJECTIONS_BEFORE_DOWN:
            return self._unknown(now, "session-renewing", _RENEWING_DETAIL), False
        self._warn_once("session-rejected", "Heartbeat rejected by Alarmio (%s)")
        return ProbeResult("session", Status.DOWN, now, detail=_REJECTED_DETAIL), True

    @staticmethod
    def _https_ok(proxy_url: str) -> bool:
        """The session token may only go to an https URL, or to a loopback host for development."""
        try:
            parsed = urlparse(proxy_url)
            if parsed.scheme.lower() == "https":
                return bool(parsed.hostname)
            return parsed.scheme.lower() == "http" and (parsed.hostname or "").lower() in _LOOPBACK_HOSTS
        except ValueError:
            return False

    def _retryable(self, now: datetime, status_code: int) -> ProbeResult:
        """A retryable HTTP answer (429, 5xx, unexpected 1xx/3xx): UNKNOWN."""
        kind = "http-429" if status_code == 429 else "http-error"
        return self._unknown(now, kind, f"Alarmio answered HTTP {status_code} to the heartbeat.")

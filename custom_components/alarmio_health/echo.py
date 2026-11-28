"""Echo ids, reply parsing and loss reconciliation for the heartbeat echo. Pure Python."""

from __future__ import annotations

import math
import secrets
from collections import deque
from dataclasses import dataclass
from typing import Any

from .models import EchoResult, StageTimings

_AJAX_NUMBERS = ("calls", "p50_ms", "p95_ms", "err_5xx", "rate_limited", "canary_ms", "canary_age_s")


@dataclass(frozen=True, slots=True)
class EchoRequest:
    """The id and sequence number sent in one heartbeat."""

    id: str
    seq: int


def _num(value: Any) -> float | None:
    """A finite, non-negative number (booleans are not numbers), else None."""
    if isinstance(value, bool) or not isinstance(value, int | float):
        return None
    return float(value) if math.isfinite(value) and value >= 0 else None


def _clean_ajax(raw: Any) -> dict[str, float | bool | None] | None:
    """Keep only the known keys, with numbers or booleans."""
    if not isinstance(raw, dict):
        return None
    clean: dict[str, float | bool | None] = {}
    for key in _AJAX_NUMBERS:
        if key in raw and (number := _num(raw[key])) is not None:
            clean[key] = number
    if "canary_ok" in raw and (raw["canary_ok"] is None or isinstance(raw["canary_ok"], bool)):
        clean["canary_ok"] = raw["canary_ok"]
    return clean


class EchoTracker:
    """Hands out echo ids and turns replies into `EchoResult`s, working out which direction lost earlier echoes."""

    def __init__(self, deadline_s: float = 5.0, max_unresolved: int = 8) -> None:
        self._deadline_s = deadline_s
        self._seq = 0
        self._unresolved: deque[str] = deque(maxlen=max_unresolved)
        self._resent: set[str] = set()

    def begin(self) -> EchoRequest:
        """A new echo id (random, 11 URL-safe characters) and the next sequence number (wraps at 2**31)."""
        self._seq = (self._seq + 1) % 2**31
        return EchoRequest(secrets.token_urlsafe(8), self._seq)

    def mark_resent(self, request_id: str) -> None:
        """The payload carrying this id is queued and will be sent again, so the server will list the id as seen
        even if the first request never arrived: the direction of that loss can no longer be told."""
        if request_id in self._unresolved:
            self._resent.add(request_id)
        self._resent &= set(self._unresolved)

    def unavailable(self, request: EchoRequest, timings: StageTimings | None = None) -> EchoResult:
        """The server answered but does not do echoes (old server): nothing to reconcile."""
        return EchoResult("unavailable", timings=timings or StageTimings())

    def complete(
        self, request: EchoRequest, reply_echo: dict[str, Any] | None, elapsed_s: float | None, timings: StageTimings
    ) -> EchoResult:
        """Record the outcome. `elapsed_s=None` means no reply came back at all."""
        if reply_echo is None or elapsed_s is None:
            self._unresolved.append(request.id)
            return EchoResult("lost", timings=timings)
        seen = reply_echo.get("seen")
        seen_ids = {s.get("id") for s in seen if isinstance(s, dict)} if isinstance(seen, list) else None
        loss: list[str] = []
        for earlier in list(self._unresolved):
            if seen_ids is None or earlier in self._resent:
                loss.append("unknown")
            else:
                loss.append("reply" if earlier in seen_ids else "request")
        self._unresolved.clear()
        self._resent.clear()
        server_ms = _num(reply_echo.get("server_ms"))
        round_trip = None
        if server_ms is not None and timings.wait_ms is not None and timings.wait_ms >= server_ms:
            round_trip = round(timings.wait_ms - server_ms, 1)
        return EchoResult(
            "slow" if elapsed_s > self._deadline_s else "ok",
            server_ms=server_ms,
            queue_ms=_num(reply_echo.get("queue_ms")),
            round_trip_ms=round_trip,
            ajax=_clean_ajax(reply_echo.get("ajax")),
            sqs_lag_p95_ms=_num(reply_echo.get("sqs_lag_p95_ms")),
            timings=timings,
            loss=tuple(loss),
        )

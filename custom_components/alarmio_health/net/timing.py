"""Per-stage HTTP timing from httpcore's trace extension (connect, TLS, wait for the first reply byte)."""

from __future__ import annotations

import time
from collections.abc import Callable
from typing import Any

from ..models import StageTimings

_STAGES = ("connect_tcp", "start_tls", "receive_response_headers")


class StageRecorder:
    """Pass as `extensions={"trace": recorder}`. Must be async: httpx's async client awaits it."""

    def __init__(self, clock: Callable[[], float] = time.monotonic) -> None:
        self._clock = clock
        self._started: dict[str, float] = {}
        self._ms: dict[str, float] = {}

    async def __call__(self, event: str, info: dict[str, Any]) -> None:
        for stage in _STAGES:
            if event.endswith(f"{stage}.started"):
                self._started[stage] = self._clock()
                return
            if event.endswith(f"{stage}.complete"):
                began = self._started.get(stage)
                if began is not None:
                    self._ms[stage] = (self._clock() - began) * 1000
                return

    def timings(self) -> StageTimings:
        """The stages seen so far; a stage that did not happen (reused connection, no TLS) is None."""
        return StageTimings(
            connect_ms=self._ms.get("connect_tcp"),
            tls_ms=self._ms.get("start_tls"),
            wait_ms=self._ms.get("receive_response_headers"),
        )

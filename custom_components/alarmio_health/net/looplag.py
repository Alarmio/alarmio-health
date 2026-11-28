"""Measures how late the event loop wakes a sleeping task: a stalled Home Assistant shows up here."""

from __future__ import annotations

import asyncio
import time
from collections.abc import Awaitable, Callable


class LoopLagSampler:
    """Sleeps in short steps and remembers the worst lateness until `take_max_ms` is called."""

    def __init__(
        self,
        interval: float = 0.25,
        clock: Callable[[], float] = time.monotonic,
        sleep: Callable[[float], Awaitable[object]] = asyncio.sleep,
    ) -> None:
        self._interval = interval
        self._clock = clock
        self._sleep = sleep
        self._max_ms = 0.0

    async def sample_once(self) -> None:
        """One sleep and one measurement."""
        expected = self._clock() + self._interval
        await self._sleep(self._interval)
        late_ms = max(0.0, (self._clock() - expected) * 1000)
        if late_ms > self._max_ms:
            self._max_ms = late_ms

    async def run(self) -> None:
        """Sample until cancelled."""
        while True:
            await self.sample_once()

    def take_max_ms(self) -> float:
        """The worst lateness since the last call (milliseconds); resets the maximum."""
        value, self._max_ms = self._max_ms, 0.0
        return value

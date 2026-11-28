"""The event-loop lag sampler, including a real blocked loop (positive control)."""

import asyncio
import contextlib
import time

from custom_components.alarmio_health.net.looplag import LoopLagSampler


async def test_lateness_is_measured_and_reset() -> None:
    ticks = iter([0.0, 0.5])
    sampler = LoopLagSampler(interval=0.25, clock=lambda: next(ticks), sleep=lambda _s: asyncio.sleep(0))
    await sampler.sample_once()
    assert sampler.take_max_ms() == 250.0
    assert sampler.take_max_ms() == 0.0


async def test_an_early_wake_is_not_negative() -> None:
    ticks = iter([0.0, 0.1])
    sampler = LoopLagSampler(interval=0.25, clock=lambda: next(ticks), sleep=lambda _s: asyncio.sleep(0))
    await sampler.sample_once()
    assert sampler.take_max_ms() == 0.0


async def test_keeps_the_maximum() -> None:
    ticks = iter([0.0, 0.30, 1.0, 1.26])
    sampler = LoopLagSampler(interval=0.25, clock=lambda: next(ticks), sleep=lambda _s: asyncio.sleep(0))
    await sampler.sample_once()
    await sampler.sample_once()
    assert round(sampler.take_max_ms()) == 50


async def test_detects_a_really_blocked_loop() -> None:
    sampler = LoopLagSampler(interval=0.05)
    task = asyncio.create_task(sampler.run())
    await asyncio.sleep(0.15)
    sampler.take_max_ms()  # discard start-up noise
    time.sleep(0.4)  # block the loop on purpose
    await asyncio.sleep(0.15)
    lag = sampler.take_max_ms()
    task.cancel()
    with contextlib.suppress(asyncio.CancelledError):
        await task
    assert lag > 200

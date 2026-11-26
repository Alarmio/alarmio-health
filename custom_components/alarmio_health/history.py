"""Pure shaping of recorder data for the panel history command (no recorder access here)."""

from __future__ import annotations

import math
from collections.abc import Iterable, Sequence
from datetime import UTC, datetime
from typing import Any

MAX_LATENCY_POINTS = 500
MAX_STATUS_EVENTS = 1000


_VALID_STATUSES = frozenset({"healthy", "degraded", "down", "unknown"})


def _status_of(raw: Any) -> str:
    """The recorder state as a panel status; anything else (unavailable, None, empty, non-str) is unknown."""
    return raw if isinstance(raw, str) and raw in _VALID_STATUSES else "unknown"


def shape_status_series(states: Iterable[Any]) -> list[dict[str, str]]:
    """Return [{"t", "s"}] with unrecognised states mapped to "unknown" and consecutive duplicates dropped.

    Keeps the latest MAX_STATUS_EVENTS.
    """
    series: list[dict[str, str]] = []
    for state in states:
        status = _status_of(state.state)
        if series and series[-1]["s"] == status:
            continue
        series.append({"t": state.last_changed.isoformat(), "s": status})
    return series[-MAX_STATUS_EVENTS:]


def downsample_max(points: Sequence[dict[str, Any]], max_points: int) -> list[dict[str, Any]]:
    """Reduce to at most max_points by keeping the highest-latency point of each bucket, so spikes survive."""
    if len(points) <= max_points:
        return list(points)
    size = math.ceil(len(points) / max_points)
    return [max(points[i : i + size], key=lambda p: p["ms"]) for i in range(0, len(points), size)]


def _finite(value: Any) -> float | None:
    """value as a finite float, or None (unknown, unavailable, non-numeric, nan, inf)."""
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return number if math.isfinite(number) else None


def shape_latency_series(states: Iterable[Any], max_points: int = MAX_LATENCY_POINTS) -> list[dict[str, Any]]:
    """Return [{"t", "ms"}] from detailed states, skipping non-numeric values, downsampled."""
    points = [
        {"t": s.last_changed.isoformat(), "ms": ms} for s in states if (ms := _finite(s.state)) is not None
    ]
    return downsample_max(points, max_points)


def shape_statistics_series(
    rows: Iterable[dict[str, Any]], max_points: int = MAX_LATENCY_POINTS
) -> list[dict[str, Any]]:
    """Return [{"t", "ms"}] from hourly long-term statistics rows (their `mean`), downsampled."""
    points = [
        {"t": datetime.fromtimestamp(row["start"], UTC).isoformat(), "ms": ms}
        for row in rows
        if (ms := _finite(row.get("mean"))) is not None
    ]
    return downsample_max(points, max_points)

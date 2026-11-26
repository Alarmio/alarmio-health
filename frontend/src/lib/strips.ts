import type { Status } from "./types";

/** "Worst" for a bucket: down > degraded > healthy > unknown. */
const SEVERITY: Record<Status, number> = { unknown: 0, healthy: 1, degraded: 2, down: 3 };

interface Parsed { time: number; s: Status }

/** The server maps odd recorder states to "unknown", but the panel does not trust that: anything else becomes "unknown". */
export function normaliseStatus(value: unknown): Status {
  return value === "healthy" || value === "degraded" || value === "down" || value === "unknown" ? value : "unknown";
}

/**
 * Turns state-change events into `buckets` equal time slots between `start` (inclusive) and `end` (exclusive).
 * A state holds until the next change; before the first event a slot is "unknown";
 * inside a slot the worst state that was active wins. Events before `start` set the initial state,
 * events at or after `end` and events with unparseable timestamps are ignored.
 */
export function buildStrip(events: { t: string; s: Status }[], start: Date, end: Date, buckets: number): Status[] {
  const from = start.getTime();
  const to = end.getTime();
  if (!Number.isFinite(buckets) || buckets <= 0 || !Number.isFinite(from) || !Number.isFinite(to) || from >= to) return [];
  const count = Math.floor(buckets);
  const sorted: Parsed[] = events
    .map((e) => ({ time: new Date(e.t).getTime(), s: normaliseStatus(e.s) }))
    .filter((e) => Number.isFinite(e.time) && e.time < to)
    .sort((a, b) => a.time - b.time);

  let index = 0;
  let current: Status = "unknown";
  while (index < sorted.length && (sorted[index]?.time ?? Infinity) < from) {
    current = sorted[index]?.s ?? current;
    index++;
  }

  const span = to - from;
  const out: Status[] = [];
  for (let b = 0; b < count; b++) {
    const slotStart = from + (span * b) / count;
    const slotEnd = from + (span * (b + 1)) / count;
    const nextTime = sorted[index]?.time;
    // The carried state only counts if it lasts a non-zero time inside this slot.
    let worst: Status = nextTime !== undefined && nextTime <= slotStart ? "unknown" : current;
    for (let e = sorted[index]; e !== undefined && e.time < slotEnd; e = sorted[index]) {
      current = e.s;
      if (SEVERITY[current] > SEVERITY[worst]) worst = current;
      index++;
    }
    out.push(worst);
  }
  return out;
}

/** Share of known buckets that were up (degraded counts as up). `null` when nothing is known. */
export function uptimePercent(strip: Status[]): number | null {
  const known = strip.map(normaliseStatus).filter((s) => s !== "unknown");
  if (known.length === 0) return null;
  return (known.filter((s) => s !== "down").length / known.length) * 100;
}

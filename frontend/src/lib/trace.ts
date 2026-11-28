import type { SegmentId, TraceSegment } from "./types";

export const SEGMENT_LABEL: Record<SegmentId, string> = {
  gateway: "Router", internet: "Internet", route: "Route to Alarmio", alarmio: "Alarmio", ajax: "Ajax cloud",
};
const FULL: readonly SegmentId[] = ["gateway", "internet", "route", "alarmio", "ajax"];
const DIRECT: readonly SegmentId[] = ["gateway", "internet", "ajax"];
export const MIN_SHARE = 0.08;

export interface LaidOut { id: SegmentId; label: string; ms: number | null; share: number }

/** Which segments a trace should show: all five through Alarmio, or three in direct mode. */
export function expectedSegments(proxyMode: boolean): readonly SegmentId[] {
  return proxyMode ? FULL : DIRECT;
}

/**
 * Widths as shares that sum to 1. A measured segment gets its proportion of the total but never less than MIN_SHARE,
 * so a 0.4 ms router hop stays visible; a segment with no value is a dashed placeholder of MIN_SHARE.
 */
export function layoutTrace(segments: TraceSegment[], proxyMode: boolean): LaidOut[] {
  const byId = new Map(segments.map((s) => [s.id, s.ms] as const));
  const order = expectedSegments(proxyMode);
  const valid = (ms: number | undefined): ms is number => ms !== undefined && Number.isFinite(ms) && ms >= 0;
  const total = order.reduce((sum, id) => {
    const ms = byId.get(id);
    return sum + (valid(ms) ? ms : 0);
  }, 0);
  const raw = order.map((id) => {
    const ms = byId.get(id);
    const known = valid(ms);
    return {
      id, label: SEGMENT_LABEL[id], ms: known ? ms : null,
      share: known && total > 0 ? Math.max(MIN_SHARE, ms / total) : MIN_SHARE,
    };
  });
  const sum = raw.reduce((s, r) => s + r.share, 0);
  return raw.map((r) => ({ ...r, share: r.share / sum }));
}

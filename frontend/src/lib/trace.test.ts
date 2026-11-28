import { describe, expect, it } from "vitest";
import { expectedSegments, layoutTrace, MIN_SHARE } from "./trace";
import type { TraceSegment } from "./types";

const FULL: TraceSegment[] = [
  { id: "gateway", ms: 0.4 }, { id: "internet", ms: 12 }, { id: "route", ms: 180 }, { id: "alarmio", ms: 3 }, { id: "ajax", ms: 180 },
];
const sum = (xs: { share: number }[]): number => xs.reduce((s, x) => s + x.share, 0);

describe("layoutTrace", () => {
  it("lays out five segments proportionally with a visible minimum", () => {
    const out = layoutTrace(FULL, true);
    expect(out.map((o) => o.id)).toEqual(["gateway", "internet", "route", "alarmio", "ajax"]);
    expect(out.map((o) => o.label)).toEqual(["Router", "Internet", "Route to Alarmio", "Alarmio", "Ajax cloud"]);
    expect(sum(out)).toBeCloseTo(1);
    for (const o of out) expect(o.share).toBeGreaterThanOrEqual(MIN_SHARE / 1.5);
    const largest = [...out].sort((a, b) => b.share - a.share).slice(0, 2).map((o) => o.id).sort();
    expect(largest).toEqual(["ajax", "route"]);
  });

  it("shows missing segments as null placeholders with the minimum share", () => {
    const out = layoutTrace(FULL.filter((s) => s.id !== "alarmio" && s.id !== "ajax"), true);
    const missing = out.filter((o) => o.id === "alarmio" || o.id === "ajax");
    expect(missing.map((o) => o.ms)).toEqual([null, null]);
    expect(sum(out)).toBeCloseTo(1);
    const gateway = out.find((o) => o.id === "gateway");
    expect(missing[0]?.share).toBeCloseTo(gateway?.share ?? -1);
  });

  it("returns three segments in direct mode", () => {
    const out = layoutTrace(FULL, false);
    expect(out.map((o) => o.id)).toEqual(["gateway", "internet", "ajax"]);
    expect(expectedSegments(false)).toHaveLength(3);
    expect(sum(out)).toBeCloseTo(1);
  });

  it("gives equal shares when every value is missing", () => {
    const out = layoutTrace([], true);
    expect(out).toHaveLength(5);
    for (const o of out) { expect(o.ms).toBeNull(); expect(o.share).toBeCloseTo(0.2); }
  });

  it("treats negative and NaN values as missing", () => {
    const out = layoutTrace([{ id: "gateway", ms: -1 }, { id: "internet", ms: Number.NaN }, { id: "route", ms: 50 }], true);
    expect(out.find((o) => o.id === "gateway")?.ms).toBeNull();
    expect(out.find((o) => o.id === "internet")?.ms).toBeNull();
    expect(out.find((o) => o.id === "route")?.ms).toBe(50);
  });
});

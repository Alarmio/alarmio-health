import { describe, expect, it } from "vitest";
import { buildStrip, uptimePercent } from "./strips";
import type { Status } from "./types";

const start = new Date("2026-11-26T00:00:00Z");
const end = new Date("2026-11-26T04:00:00Z");
const ev = (t: string, s: Status) => ({ t, s });

describe("buildStrip", () => {
  it("carries each state forward until the next change", () => {
    const strip = buildStrip([ev("2026-11-26T00:00:00Z", "healthy"), ev("2026-11-26T02:00:00Z", "down")], start, end, 4);
    expect(strip).toEqual(["healthy", "healthy", "down", "down"]);
  });
  it("is unknown before the first recorded state", () => {
    expect(buildStrip([ev("2026-11-26T02:00:00Z", "healthy")], start, end, 4)).toEqual(["unknown", "unknown", "healthy", "healthy"]);
  });
  it("marks a bucket down if any down state falls inside it", () => {
    const events = [ev("2026-11-26T00:00:00Z", "healthy"), ev("2026-11-26T00:20:00Z", "down"), ev("2026-11-26T00:40:00Z", "healthy")];
    expect(buildStrip(events, start, end, 4)[0]).toBe("down");
  });
  it("ranks worst as down > degraded > healthy > unknown inside a bucket", () => {
    const events = [ev("2026-11-26T00:10:00Z", "healthy"), ev("2026-11-26T00:20:00Z", "degraded"), ev("2026-11-26T00:30:00Z", "healthy")];
    expect(buildStrip(events, start, end, 4)[0]).toBe("degraded");
    expect(buildStrip([ev("2026-11-26T00:30:00Z", "healthy")], start, end, 4)[0]).toBe("healthy");
  });
  it("does not let a zero-length carried state win when a change lands on the bucket edge", () => {
    const events = [ev("2026-11-26T00:00:00Z", "down"), ev("2026-11-26T01:00:00Z", "healthy")];
    expect(buildStrip(events, start, end, 4)).toEqual(["down", "healthy", "healthy", "healthy"]);
  });
  it("sorts unsorted events", () => {
    const events = [ev("2026-11-26T02:00:00Z", "down"), ev("2026-11-26T00:00:00Z", "healthy")];
    expect(buildStrip(events, start, end, 4)).toEqual(["healthy", "healthy", "down", "down"]);
  });
  it("skips events with invalid timestamps", () => {
    const events = [ev("not a date", "down"), ev("", "down"), ev("2026-11-26T00:00:00Z", "healthy")];
    expect(buildStrip(events, start, end, 4)).toEqual(["healthy", "healthy", "healthy", "healthy"]);
  });
  it("uses events before start as the initial state", () => {
    expect(buildStrip([ev("2026-11-25T20:00:00Z", "degraded")], start, end, 4)).toEqual(["degraded", "degraded", "degraded", "degraded"]);
  });
  it("uses the latest event before start when there are several", () => {
    const events = [ev("2026-11-25T10:00:00Z", "down"), ev("2026-11-25T20:00:00Z", "healthy")];
    expect(buildStrip(events, start, end, 2)).toEqual(["healthy", "healthy"]);
  });
  it("ignores events at or after end", () => {
    const events = [ev("2026-11-26T00:00:00Z", "healthy"), ev("2026-11-26T04:00:00Z", "down"), ev("2026-11-27T00:00:00Z", "down")];
    expect(buildStrip(events, start, end, 4)).toEqual(["healthy", "healthy", "healthy", "healthy"]);
  });
  it("keeps a state across several empty buckets", () => {
    expect(buildStrip([ev("2026-11-26T00:00:00Z", "degraded")], start, end, 8)).toEqual(Array(8).fill("degraded"));
  });
  it("returns [] for non-positive or non-integer-safe bucket counts and bad ranges", () => {
    expect(buildStrip([], start, end, 0)).toEqual([]);
    expect(buildStrip([], start, end, -3)).toEqual([]);
    expect(buildStrip([], end, start, 4)).toEqual([]);
    expect(buildStrip([], start, start, 4)).toEqual([]);
    expect(buildStrip([], new Date("nope"), end, 4)).toEqual([]);
  });
  it("is all unknown with no events", () => {
    expect(buildStrip([], start, end, 3)).toEqual(["unknown", "unknown", "unknown"]);
  });
});

describe("uptimePercent", () => {
  it("ignores unknown buckets and counts degraded as up", () => {
    expect(uptimePercent(["healthy", "degraded", "down", "unknown"])).toBeCloseTo(66.67, 1);
  });
  it("is null when nothing is known", () => {
    expect(uptimePercent(["unknown"])).toBeNull();
    expect(uptimePercent([])).toBeNull();
  });
  it("is 100 when everything known is up", () => {
    expect(uptimePercent(["healthy", "unknown", "degraded"])).toBe(100);
  });
});

describe("unrecognised states (runtime defence)", () => {
  const raw = (s: unknown) => ({ t: "2026-11-26T00:00:00Z", s }) as unknown as { t: string; s: Status };
  it("treats unavailable as unknown", () => {
    const strip = buildStrip([raw("unavailable")], start, end, 4);
    expect(strip).toEqual(["unknown", "unknown", "unknown", "unknown"]);
    expect(uptimePercent(["healthy", "unknown", "down"])).toBe(50);
  });
  it("treats null and numbers as unknown, never counted as up", () => {
    for (const bad of [null, 3, undefined, "UP"]) {
      const strip = buildStrip([raw(bad)], start, end, 4);
      expect(strip.every((s) => s === "unknown")).toBe(true);
      expect(uptimePercent(strip)).toBeNull();
    }
  });
  it("uptimePercent ignores unrecognised values in a strip", () => {
    const strip = ["healthy", "unavailable", null, 5, "down"] as unknown as Status[];
    expect(uptimePercent(strip)).toBe(50);
  });
  it("a bad state mid-series does not hide a later down", () => {
    const strip = buildStrip([ev("2026-11-26T00:00:00Z", "healthy"), raw("unavailable") && { t: "2026-11-26T01:00:00Z", s: "unavailable" as unknown as Status }, ev("2026-11-26T02:00:00Z", "down")], start, end, 4);
    expect(strip).toEqual(["healthy", "unknown", "down", "down"]);
  });
});

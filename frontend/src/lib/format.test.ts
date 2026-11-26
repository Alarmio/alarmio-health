import { describe, expect, it } from "vitest";
import { axisTicks, latencyFull, latencyTick } from "./format";

const at = (y: number, mo: number, d: number, h = 0, mi = 0): number => new Date(y, mo - 1, d, h, mi).getTime();
const fmt = (o: Intl.DateTimeFormatOptions, t: number): string => new Intl.DateTimeFormat(undefined, o).format(t);

describe("latencyTick", () => {
  const t = at(2026, 11, 24, 14, 30);
  it("24h shows the time of day only", () => {
    expect(latencyTick(t, "24h")).toBe(fmt({ hour: "2-digit", minute: "2-digit" }, t));
  });
  it("7d shows weekday and day", () => {
    expect(latencyTick(t, "7d")).toBe(fmt({ weekday: "short", day: "numeric" }, t));
    expect(latencyTick(t, "7d")).toMatch(/24/);
  });
  it("30d shows day and month", () => {
    expect(latencyTick(t, "30d")).toBe(fmt({ day: "numeric", month: "short" }, t));
    expect(latencyTick(t, "30d")).toMatch(/24/);
  });
});

describe("latencyFull", () => {
  it("shows the full date and time", () => {
    const t = at(2026, 11, 24, 14, 30);
    expect(latencyFull(t)).toBe(fmt({ weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }, t));
  });
});

describe("axisTicks", () => {
  it.each([["24h", 86_400_000], ["7d", 7 * 86_400_000], ["30d", 30 * 86_400_000]] as const)("%s: sorted, inside the domain, 3 to 9 ticks and no duplicate labels", (range, span) => {
    const max = at(2026, 11, 26, 13, 17);
    const min = max - span;
    const ticks = axisTicks(min, max, range);
    expect(ticks.length).toBeGreaterThanOrEqual(3);
    expect(ticks.length).toBeLessThanOrEqual(9);
    expect([...ticks].sort((a, b) => a - b)).toEqual(ticks);
    expect(ticks.every((x) => x >= min && x <= max)).toBe(true);
    const labels = ticks.map((x) => latencyTick(x, range));
    expect(new Set(labels).size).toBe(labels.length);
  });
  it("returns nothing for an empty or inverted domain", () => {
    expect(axisTicks(5, 5, "24h")).toEqual([]);
    expect(axisTicks(9, 5, "7d")).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";
import { verdict } from "./verdict";
import type { Link } from "./types";

const link = (id: Link["id"], status: Link["status"], detail = ""): Link => ({
  id, label: { ajax: "Ajax hub", alarmio: "Alarmio", foxace: "foXaCe", ha: "Home Assistant" }[id],
  status, latency_ms: null, detail,
});
const NOW = new Date("2026-11-26T12:00:00Z");
const healthy = [link("ajax", "healthy"), link("alarmio", "healthy"), link("foxace", "healthy"), link("ha", "healthy")];

describe("verdict", () => {
  it("says events are reaching HA when everything is healthy", () => {
    expect(verdict(healthy, null, NOW)).toEqual({ tone: "healthy", headline: "Alarm events are reaching Home Assistant", hint: "" });
  });

  it("names the first failing link and how long ago it stopped", () => {
    const links = [link("ajax", "healthy"), link("alarmio", "down", "Alarmio did not answer."), link("foxace", "down"), link("ha", "healthy")];
    const v = verdict(links, "2026-11-26T11:46:00Z", NOW);
    expect(v.tone).toBe("down");
    expect(v.headline).toBe("Events stopped at Alarmio 14 min ago");
    expect(v.hint).toBe("Alarmio did not answer.");
  });

  it("omits the time when the start of the outage is unknown", () => {
    const links = [link("ajax", "healthy"), link("alarmio", "healthy"), link("foxace", "down", "x"), link("ha", "healthy")];
    expect(verdict(links, null, NOW).headline).toBe("Events stopped at foXaCe");
  });

  it("flags degraded links without claiming a failure", () => {
    const links = [link("ajax", "degraded", "1 low battery."), ...healthy.slice(1)];
    const v = verdict(links, null, NOW);
    expect(v.tone).toBe("degraded");
    expect(v.headline).toBe("Alarm events are reaching Home Assistant, but Ajax hub needs attention");
    expect(v.hint).toBe("1 low battery.");
  });

  it("says there is not enough data when everything is unknown", () => {
    const unknown = healthy.map((l) => ({ ...l, status: "unknown" as const }));
    expect(verdict(unknown, null, NOW).tone).toBe("unknown");
  });

  it("formats hours for long outages", () => {
    const links = [link("ajax", "healthy"), link("alarmio", "down", "x"), link("foxace", "healthy"), link("ha", "healthy")];
    expect(verdict(links, "2026-11-26T09:30:00Z", NOW).headline).toBe("Events stopped at Alarmio 2 h 30 min ago");
  });
});

describe("verdict edge cases", () => {
  const downAlarmio = [link("ajax", "healthy"), link("alarmio", "down", "x"), link("foxace", "healthy"), link("ha", "healthy")];

  it("drops the time suffix for an unparseable downSince, never NaN", () => {
    const v = verdict(downAlarmio, "not a date", NOW);
    expect(v.headline).toBe("Events stopped at Alarmio");
    expect(v.headline).not.toContain("NaN");
  });

  it("drops the time suffix for an empty downSince string", () => {
    expect(verdict(downAlarmio, "", NOW).headline).toBe("Events stopped at Alarmio");
  });

  it("says 'just now' for a downSince in the future", () => {
    expect(verdict(downAlarmio, "2026-11-26T12:05:00Z", NOW).headline).toBe("Events stopped at Alarmio just now");
  });

  it("says 'just now' for an outage under one minute old", () => {
    expect(verdict(downAlarmio, "2026-11-26T11:59:30Z", NOW).headline).toBe("Events stopped at Alarmio just now");
  });

  it("says 1 min ago at exactly one minute", () => {
    expect(verdict(downAlarmio, "2026-11-26T11:59:00Z", NOW).headline).toBe("Events stopped at Alarmio 1 min ago");
  });

  it("formats whole hours without minutes", () => {
    expect(verdict(downAlarmio, "2026-11-26T10:00:00Z", NOW).headline).toBe("Events stopped at Alarmio 2 h ago");
  });

  it("is not healthy when there are no links at all", () => {
    expect(verdict([], null, NOW)).toEqual({ tone: "unknown", headline: "Not enough data yet to tell", hint: "Checks run every minute." });
  });

  it("is not healthy when only the HA link is present", () => {
    expect(verdict([link("ha", "healthy")], null, NOW).tone).toBe("unknown");
  });

  it("gives an empty hint when the down link has no detail", () => {
    const links = [link("ajax", "healthy"), link("alarmio", "healthy"), link("foxace", "down"), link("ha", "healthy")];
    expect(verdict(links, null, NOW).hint).toBe("");
  });

  it("names the first down link in chain order even if a later one is down too", () => {
    const links = [link("ajax", "down", "hub offline"), link("alarmio", "down", "b"), link("foxace", "down", "c"), link("ha", "healthy")];
    const v = verdict(links, null, NOW);
    expect(v.headline).toBe("Events stopped at Ajax hub");
    expect(v.hint).toBe("hub offline");
  });

  it("a down link outranks an earlier degraded one", () => {
    const links = [link("ajax", "degraded", "d"), link("alarmio", "down", "x"), link("foxace", "healthy"), link("ha", "healthy")];
    expect(verdict(links, null, NOW).tone).toBe("down");
  });

  it("stays healthy when only the HA link is unknown", () => {
    const links = [link("ajax", "healthy"), link("alarmio", "healthy"), link("foxace", "healthy"), link("ha", "unknown")];
    expect(verdict(links, null, NOW).tone).toBe("healthy");
  });

  it("is not healthy when a non-HA link is unknown and the rest are healthy", () => {
    const links = [link("ajax", "healthy"), link("alarmio", "unknown"), link("foxace", "healthy"), link("ha", "healthy")];
    expect(verdict(links, null, NOW)).toEqual({ tone: "unknown", headline: "Not enough data yet to tell", hint: "Checks run every minute." });
  });

  it("reports a degraded link ahead of an unknown one", () => {
    const links = [link("ajax", "degraded", "d"), link("alarmio", "unknown"), link("foxace", "healthy"), link("ha", "healthy")];
    expect(verdict(links, null, NOW)).toEqual({
      tone: "degraded",
      headline: "Ajax hub needs attention and Alarmio cannot be checked",
      hint: "d",
    });
  });

  it("uses the first degraded and first unknown link in chain order", () => {
    const links = [link("ajax", "unknown"), link("alarmio", "degraded", "slow"), link("foxace", "degraded", "x"), link("ha", "healthy")];
    expect(verdict(links, null, NOW)).toEqual({
      tone: "degraded",
      headline: "Alarmio needs attention and Ajax hub cannot be checked",
      hint: "slow",
    });
  });

  it("keeps the delivery claim when degraded and only the HA link is unknown", () => {
    const links = [link("ajax", "degraded", "d"), link("alarmio", "healthy"), link("foxace", "healthy"), link("ha", "unknown")];
    expect(verdict(links, null, NOW).headline).toBe("Alarm events are reaching Home Assistant, but Ajax hub needs attention");
  });

  it("combines a degraded HA link with a non-HA unknown link", () => {
    const links = [link("ajax", "healthy"), link("alarmio", "unknown"), link("foxace", "healthy"), link("ha", "degraded", "ha detail")];
    const v = verdict(links, null, NOW);
    expect(v.tone).toBe("degraded");
    expect(v.headline).toBe("Home Assistant needs attention and Alarmio cannot be checked");
    expect(v.hint).toBe("ha detail");
  });
});

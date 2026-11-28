import { describe, expect, it } from "vitest";
import { summaryVerdict, verdict } from "./verdict";
import type { Link, Summary } from "./types";

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

describe("summaryVerdict", () => {
  const base = (over: Partial<Summary>): Summary => ({
    links: healthy, probes: {}, down_since: null, share_diagnostics: false, queued_heartbeats: 0, diagnostics_preview: null,
    chain: [], trace: { blamed: null, segments: [] }, cause: "", cause_status: "unknown", integration_version: "0.2.0", ...over,
  });
  const downLinks = [link("ajax", "healthy"), link("alarmio", "down", "Alarmio did not answer."), link("foxace", "healthy"), link("ha", "healthy")];

  it("uses the blame headline and the cause as the hint", () => {
    const s = base({ trace: { blamed: "route", segments: [] }, cause: "The route took 180 ms.", cause_status: "degraded" });
    expect(summaryVerdict(s, NOW)).toEqual({ tone: "degraded", headline: "The route to Alarmio is unreliable", hint: "The route took 180 ms." });
  });

  it("says down for a blamed gateway", () => {
    const s = base({ trace: { blamed: "gateway", segments: [] }, cause: "No reply.", cause_status: "down" });
    expect(summaryVerdict(s, NOW).headline).toBe("Your router is not answering");
    expect(summaryVerdict(s, NOW).tone).toBe("down");
  });

  it("falls back to the legacy verdict without blame", () => {
    expect(summaryVerdict(base({}), NOW)).toEqual(verdict(healthy, null, NOW));
    const s = base({ links: downLinks, down_since: "2026-11-26T11:46:00Z" });
    expect(summaryVerdict(s, NOW)).toEqual(verdict(downLinks, "2026-11-26T11:46:00Z", NOW));
  });

  it.each(["healthy", "unknown"] as const)("falls back when blamed but cause_status is %s", (cause_status) => {
    const s = base({ links: downLinks, trace: { blamed: "alarmio", segments: [] }, cause: "x", cause_status });
    expect(summaryVerdict(s, NOW)).toEqual(verdict(downLinks, null, NOW));
  });

  it("reads healthy in direct mode when the link view is unknown but every evaluated chain node is healthy", () => {
    const links = [link("ajax", "healthy"), link("alarmio", "unknown"), link("foxace", "healthy"), link("ha", "healthy")];
    const node = (id: "ajax_hub" | "gateway"): Summary["chain"][number] => ({ id, label: id, status: "healthy", latency_ms: 1, detail: "", evaluated: true });
    const s = base({ links, chain: [node("ajax_hub"), node("gateway")], cause_status: "healthy" });
    expect(summaryVerdict(s, NOW).tone).toBe("healthy");
    expect(summaryVerdict(base({ links, chain: [], cause_status: "healthy" }), NOW).tone).toBe("unknown");
  });

  it("does not override an unknown link view in proxy mode or when another link is not healthy", () => {
    const node = (id: "alarmio" | "gateway"): Summary["chain"][number] => ({ id, label: id, status: "healthy", latency_ms: 1, detail: "", evaluated: true });
    const proxyLinks = [link("ajax", "healthy"), link("alarmio", "healthy"), link("foxace", "unknown"), link("ha", "healthy")];
    expect(summaryVerdict(base({ links: proxyLinks, chain: [node("alarmio"), node("gateway")], cause_status: "healthy" }), NOW).tone).toBe("unknown");
    const directLinks = [link("ajax", "healthy"), link("alarmio", "unknown"), link("foxace", "unknown"), link("ha", "healthy")];
    expect(summaryVerdict(base({ links: directLinks, chain: [node("gateway")], cause_status: "healthy" }), NOW).tone).toBe("unknown");
  });
  describe("review fixes", () => {
    type N = Summary["chain"][number];
    const cn = (id: N["id"], status: N["status"] = "healthy", evaluated = true): N => ({ id, label: id, status, latency_ms: 1, detail: "", evaluated });
    const directChain = (over: Partial<Record<N["id"], N>> = {}): N[] =>
      (["ajax_hub", "ajax_cloud", "internet", "gateway", "ha"] as const).map((id) => over[id] ?? cn(id));
    const directLinks = (over: Partial<Record<Link["id"], Link["status"]>> = {}): Link[] =>
      (["ajax", "alarmio", "foxace", "ha"] as const).map((id) => link(id, over[id] ?? (id === "alarmio" ? "unknown" : "healthy"), id === "alarmio" ? "not used" : ""));

    it("a degraded blame does not hide a down legacy link", () => {
      const links = [link("ajax", "healthy"), link("alarmio", "healthy"), link("foxace", "down", "No events."), link("ha", "healthy")];
      const s = base({ links, trace: { blamed: "alarmio", segments: [] }, cause: "slow", cause_status: "degraded" });
      expect(summaryVerdict(s, NOW)).toEqual(verdict(links, null, NOW));
      expect(summaryVerdict(s, NOW).headline).toBe("Events stopped at foXaCe");
      const ha = base({ links, trace: { blamed: "ha_host", segments: [] }, cause: "busy", cause_status: "degraded" });
      expect(summaryVerdict(ha, NOW).headline).toBe("Events stopped at foXaCe");
    });

    it("a down blame keeps its own headline over a down link", () => {
      const links = [link("ajax", "healthy"), link("alarmio", "healthy"), link("foxace", "down"), link("ha", "healthy")];
      const s = base({ links, trace: { blamed: "gateway", segments: [] }, cause: "No reply.", cause_status: "down" });
      expect(summaryVerdict(s, NOW).headline).toBe("Your router is not answering");
    });

    it("direct mode never says Alarmio cannot be checked", () => {
      const s = base({ links: directLinks({ ajax: "degraded" }), chain: directChain(), cause_status: "healthy" });
      const v = summaryVerdict(s, NOW);
      expect(v.headline).toBe("Alarm events are reaching Home Assistant, but Ajax hub needs attention");
      expect(v.headline).not.toContain("Alarmio");
    });

    it("direct mode reads healthy when the router or the internet check is unknown", () => {
      for (const id of ["gateway", "internet"] as const) {
        const s = base({ links: directLinks(), chain: directChain({ [id]: cn(id, "unknown") }), cause_status: "healthy" });
        expect(summaryVerdict(s, NOW).tone).toBe("healthy");
      }
    });

    it("direct mode stays unknown for an unknown Ajax cloud and is not overridden by a degraded router", () => {
      const cloud = base({ links: directLinks(), chain: directChain({ ajax_cloud: cn("ajax_cloud", "unknown") }), cause_status: "healthy" });
      expect(summaryVerdict(cloud, NOW).tone).toBe("unknown");
      const gw = base({ links: directLinks(), chain: directChain({ gateway: cn("gateway", "degraded") }), cause_status: "healthy" });
      expect(summaryVerdict(gw, NOW).tone).toBe("unknown");
    });
  });
});

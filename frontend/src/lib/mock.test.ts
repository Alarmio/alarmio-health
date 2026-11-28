import { afterEach, describe, expect, it, vi } from "vitest";
import { createMockApi, SCENARIOS, type Scenario } from "./mock";

afterEach(() => vi.useRealTimers());

describe("createMockApi", () => {
  it("serves four links per data scenario and an empty state for empty", async () => {
    for (const s of ["healthy", "degraded", "down", "empty"] as const) {
      expect((await createMockApi(s).summary()).links).toHaveLength(4);
    }
    expect(await createMockApi("empty").incidents()).toEqual([]);
    expect((await createMockApi("empty").history("24h")).latency).toEqual([]);
  });
  it("down has an ongoing incident and a down link", async () => {
    const api = createMockApi("down");
    expect((await api.summary()).links.some((l) => l.status === "down")).toBe(true);
    expect((await api.incidents()).some((i) => i.closed_at === null)).toBe(true);
  });
  it("error rejects every call", async () => {
    const api = createMockApi("error");
    await expect(api.summary()).rejects.toThrow();
    await expect(api.history("24h")).rejects.toThrow();
    await expect(api.incidents()).rejects.toThrow();
    await expect(api.runE2E()).rejects.toThrow();
  });
  it("slow resolves only after 1500 ms", async () => {
    vi.useFakeTimers();
    let done = false;
    void createMockApi("slow").summary().then(() => { done = true; });
    await vi.advanceTimersByTimeAsync(1499);
    expect(done).toBe(false);
    await vi.advanceTimersByTimeAsync(2);
    expect(done).toBe(true);
  });

  describe("echo chain data", () => {
    const withData = SCENARIOS.filter((s): s is Scenario => s !== "error");
    it("exposes the three new scenario names", () => {
      for (const s of ["route", "gateway", "direct"] as const) expect(SCENARIOS).toContain(s);
    });
    it("every scenario carries chain, trace, cause, cause_status and version", async () => {
      for (const s of withData) {
        const sum = await createMockApi(s).summary();
        expect(Array.isArray(sum.chain), s).toBe(true);
        expect(sum.trace, s).toBeDefined();
        expect(typeof sum.cause, s).toBe("string");
        expect(sum.cause_status, s).toBeDefined();
        expect(sum.integration_version, s).toBe("0.2.0");
      }
    });
    it("a blamed scenario has a cause and a degraded or down status", async () => {
      for (const s of withData) {
        const sum = await createMockApi(s).summary();
        if (sum.trace.blamed === null) continue;
        expect(sum.cause.length, s).toBeGreaterThan(0);
        expect(["degraded", "down"], s).toContain(sum.cause_status);
      }
    });
    it("nodes that were not evaluated are unknown, empty of latency and say so", async () => {
      for (const s of withData) {
        for (const n of (await createMockApi(s).summary()).chain.filter((c) => !c.evaluated)) {
          expect([s, n.id, n.status, n.detail, n.latency_ms]).toEqual([s, n.id, "unknown", "Not evaluated", null]);
        }
      }
    });
    it("healthy has six healthy evaluated nodes and no blame", async () => {
      const sum = await createMockApi("healthy").summary();
      expect(sum.chain.map((n) => n.id)).toEqual(["ajax_hub", "ajax_cloud", "alarmio", "internet", "gateway", "ha"]);
      expect(sum.chain.every((n) => n.status === "healthy" && n.evaluated)).toBe(true);
      expect(sum.trace.blamed).toBeNull();
      expect(sum.cause_status).toBe("healthy");
    });
    it("route blames the route while Alarmio itself answered fast", async () => {
      const sum = await createMockApi("route").summary();
      expect(sum.trace.blamed).toBe("route");
      expect(sum.cause).toContain("3 of 5");
      expect(sum.chain.every((n) => n.evaluated)).toBe(true);
      expect(sum.trace.segments.find((x) => x.id === "alarmio")?.ms).toBe(3);
      expect(sum.links.find((l) => l.id === "alarmio")?.status).toBe("degraded");
      const inc = await createMockApi("route").incidents();
      expect(inc.some((i) => i.probe === "alarmio" && i.closed_at !== null && i.detail.includes("3 of 5"))).toBe(true);
    });
    it("gateway evaluates only the router and Home Assistant", async () => {
      const sum = await createMockApi("gateway").summary();
      expect(sum.chain.filter((n) => !n.evaluated).map((n) => n.id).sort()).toEqual(["ajax_cloud", "ajax_hub", "alarmio", "internet"]);
      expect(sum.chain.find((n) => n.id === "gateway")?.status).toBe("down");
      expect(sum.chain.find((n) => n.id === "ha")?.status).toBe("healthy");
      expect(sum.trace.segments).toEqual([]);
      expect(sum.trace.blamed).toBe("gateway");
    });
    it("direct has no Alarmio node or segments", async () => {
      const sum = await createMockApi("direct").summary();
      expect(sum.chain).toHaveLength(5);
      expect(sum.chain.some((n) => n.id === "alarmio")).toBe(false);
      expect(sum.trace.segments.some((x) => x.id === "route" || x.id === "alarmio")).toBe(false);
      expect(sum.links.find((l) => l.id === "alarmio")?.status).toBe("unknown");
    });
    it("down stops at Alarmio; degraded blames Alarmio; empty is blank", async () => {
      const down = await createMockApi("down").summary();
      expect(down.chain.filter((n) => !n.evaluated).map((n) => n.id).sort()).toEqual(["ajax_cloud", "ajax_hub"]);
      expect(down.chain.find((n) => n.id === "alarmio")?.status).toBe("down");
      expect((await createMockApi("degraded").summary()).trace.blamed).toBe("alarmio");
      const empty = await createMockApi("empty").summary();
      expect(empty.chain).toEqual([]);
      expect(empty.cause_status).toBe("unknown");
    });
    it("history includes the new probes", async () => {
      const h = await createMockApi("route").history("24h");
      for (const p of ["gateway", "internet", "ajaxcloud"]) expect(h.status[p]?.[0]?.s).toBe("healthy");
      expect(h.status.alarmio?.some((e) => e.s === "degraded")).toBe(true);
      expect((await createMockApi("gateway").history("24h")).status.gateway?.some((e) => e.s === "down")).toBe(true);
    });
  });
});

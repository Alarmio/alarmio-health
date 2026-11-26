import { describe, expect, it, vi } from "vitest";
import { createHassApi } from "./api";

describe("createHassApi", () => {
  it("calls the websocket commands with the right types and range", async () => {
    const callWS = vi.fn().mockResolvedValue({ incidents: [] });
    const api = createHassApi(() => ({ callWS }));
    await api.incidents();
    expect(callWS).toHaveBeenCalledWith({ type: "alarmio_health/incidents" });
    callWS.mockResolvedValue({ status: {}, latency: [] });
    await api.history("7d");
    expect(callWS).toHaveBeenCalledWith({ type: "alarmio_health/history", range: "7d" });
    await api.summary();
    expect(callWS).toHaveBeenCalledWith({ type: "alarmio_health/summary" });
    await api.runE2E();
    expect(callWS).toHaveBeenCalledWith({ type: "alarmio_health/run_e2e_test" });
  });
  it("unwraps the incidents list", async () => {
    const list = [{ id: "a", probe: "alarmio", opened_at: "x", closed_at: null, detail: "d" }];
    const api = createHassApi(() => ({ callWS: vi.fn().mockResolvedValue({ incidents: list }) }));
    await expect(api.incidents()).resolves.toEqual(list);
  });
  it("reads hass at call time, so later hass updates are used", async () => {
    let current = { callWS: vi.fn().mockResolvedValue({ incidents: [] }) };
    const api = createHassApi(() => current);
    const next = { callWS: vi.fn().mockResolvedValue({ incidents: [] }) };
    current = next;
    await api.incidents();
    expect(next.callWS).toHaveBeenCalledTimes(1);
  });
  it("rejects clearly when hass is missing", async () => {
    const api = createHassApi(() => null);
    await expect(api.summary()).rejects.toThrow(/not connected/i);
    await expect(api.runE2E()).rejects.toThrow(/not connected/i);
  });
  it("propagates websocket errors with a readable message", async () => {
    const api = createHassApi(() => ({ callWS: vi.fn().mockRejectedValue({ code: "unknown_command", message: "Unknown command." }) }));
    await expect(api.summary()).rejects.toThrow("Unknown command.");
    const api2 = createHassApi(() => ({ callWS: vi.fn().mockRejectedValue(new Error("boom")) }));
    await expect(api2.summary()).rejects.toThrow("boom");
    const api3 = createHassApi(() => ({ callWS: vi.fn().mockRejectedValue("weird") }));
    await expect(api3.summary()).rejects.toThrow(/could not reach/i);
  });
  it("keeps the generic call() helper", async () => {
    const callWS = vi.fn().mockResolvedValue("ok");
    const api = createHassApi(() => ({ callWS }));
    await expect(api.call("summary", { a: 1 })).resolves.toBe("ok");
    expect(callWS).toHaveBeenCalledWith({ type: "alarmio_health/summary", a: 1 });
  });
});

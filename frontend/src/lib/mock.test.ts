import { afterEach, describe, expect, it, vi } from "vitest";
import { createMockApi } from "./mock";

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
});

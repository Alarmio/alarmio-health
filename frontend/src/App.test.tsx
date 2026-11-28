// @vitest-environment jsdom
import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { App, REFRESH_MS } from "./App";
import type { Api } from "./lib/api";
import { createMockApi } from "./lib/mock";
import type { History, Range } from "./lib/types";
import { installDomMatchers, stubResizeObserver } from "./test-utils";

beforeAll(() => {
  stubResizeObserver();
  installDomMatchers();
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
});
beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const flush = async (): Promise<void> => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0);
  });
};
const tickRefresh = async (): Promise<void> => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(REFRESH_MS);
  });
};
const wrap = (over: Partial<Api>): Api => ({ ...createMockApi("healthy"), ...over });

describe("App echo chain wiring", () => {
  const load = async (name: Parameters<typeof createMockApi>[0]): Promise<void> => {
    render(<App api={createMockApi(name)} />);
    await flush();
  };
  const chainItems = (): HTMLElement[] => within(screen.getByRole("list", { name: "Alarm signal chain" })).getAllByRole("listitem");
  it("blames the route with the cause sentence, six hops and the trace", async () => {
    await load("route");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The route to Alarmio is unreliable");
    expect(screen.getAllByText(/Packets to Alarmio were lost \(3 of 5 pings\)\. Alarmio itself answered in 3 ms\./).length).toBeGreaterThan(0);
    expect(chainItems()).toHaveLength(6);
    expect(screen.getByRole("heading", { level: 2, name: "Last check" })).toBeInTheDocument();
  });
  it("names the router when the gateway is down", async () => {
    await load("gateway");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Your router is not answering");
  });
  it("keeps the healthy headline and shows six hops", async () => {
    await load("healthy");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Alarm events are reaching Home Assistant");
    expect(chainItems()).toHaveLength(6);
  });
  it("falls back to the legacy four-item chain without a Last check section", async () => {
    await load("empty");
    expect(chainItems()).toHaveLength(4);
    expect(screen.queryByRole("heading", { name: "Last check" })).toBeNull();
  });
  it("shows the version line and keeps one h1 and one status region", async () => {
    await load("healthy");
    expect(screen.getByText(/^Alarmio Health 0\.2\.0( \/ foXaCe \d[\d.]*)?$/)).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });
});

describe("App", () => {
  it("shows a loading state, then the verdict as the only h1", async () => {
    render(<App api={createMockApi("healthy")} />);
    expect(screen.getByText(/Loading health data/)).toBeInTheDocument();
    await flush();
    const h1 = screen.getAllByRole("heading", { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]).toHaveTextContent("Alarm events are reaching Home Assistant");
    expect(screen.getByRole("list", { name: "Alarm signal chain" })).toBeInTheDocument();
  });

  it("shows the error state when everything fails and there is no data", async () => {
    render(<App api={createMockApi("error")} />);
    await flush();
    const region = screen.getByRole("status");
    expect(region).toHaveTextContent("Could not load health data");
    expect(region).toHaveTextContent("The mock API is set to fail.");
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Try again" })).toBeEnabled();
  });

  it("keeps earlier data and shows a notice when a later refresh fails", async () => {
    let fail = false;
    const healthy = createMockApi("healthy");
    const api = wrap({ summary: () => (fail ? Promise.reject(new Error("offline")) : healthy.summary()) });
    render(<App api={api} />);
    await flush();
    fail = true;
    await tickRefresh();
    expect(screen.getByText("Last update failed. Showing earlier data.")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })[0]).toHaveTextContent("Alarm events are reaching Home Assistant");
    fail = false;
    await tickRefresh();
    expect(screen.queryByText("Last update failed. Showing earlier data.")).toBeNull();
  });

  it("shows the history notice in the uptime and chart sections", async () => {
    const api = wrap({ history: () => Promise.resolve<History>({ status: {}, latency: [], warning: "history_unavailable" }) });
    render(<App api={api} />);
    await flush();
    expect(screen.getAllByText("History is not available yet. Home Assistant's recorder may be starting.")).toHaveLength(2);
    expect(screen.queryByText(/No latency readings yet/)).toBeNull();
  });

  it("says history may be out of date when it fails after it had loaded", async () => {
    let fail = false;
    const healthy = createMockApi("healthy");
    render(<App api={wrap({ history: (r) => (fail ? Promise.reject(new Error("offline")) : healthy.history(r)) })} />);
    await flush();
    expect(screen.queryByText("History may be out of date.")).toBeNull();
    fail = true;
    await tickRefresh();
    expect(screen.getAllByText("History may be out of date.")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Uptime" })).toBeInTheDocument();
    fail = false;
    await tickRefresh();
    expect(screen.queryByText("History may be out of date.")).toBeNull();
  });

  it("keeps the status live region mounted from loading to loaded", async () => {
    render(<App api={createMockApi("healthy")} />);
    const region = screen.getByRole("status");
    expect(screen.queryAllByRole("heading", { level: 1 })).toHaveLength(0);
    await flush();
    expect(screen.getByRole("status")).toBe(region);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("times a hung call out after 30 s with a readable message and keeps polling", async () => {
    const never = (): Promise<never> => new Promise(() => {});
    render(<App api={wrap({ summary: never })} />);
    await flush();
    expect(screen.getByText(/Loading health data/)).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(30_000);
    });
    expect(screen.getByRole("status")).toHaveTextContent("The request timed out.");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("a hung call does not stall later loads", async () => {
    const summary = vi.fn(() => new Promise<never>(() => {}));
    render(<App api={wrap({ summary })} />);
    await flush();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(30_000);
    });
    await tickRefresh();
    expect(summary.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it("a failing incidents call only affects the incidents section", async () => {
    render(<App api={wrap({ incidents: () => Promise.reject(new Error("nope")) })} />);
    await flush();
    expect(screen.getByText(/Incidents could not be loaded/)).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })[0]).toHaveTextContent("Alarm events are reaching");
    expect(screen.getByRole("list", { name: "Alarm signal chain" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Uptime" })).toBeInTheDocument();
  });

  it("never overlaps two loads", async () => {
    let release: () => void = () => {};
    const summary = vi.fn(() => new Promise<Awaited<ReturnType<Api["summary"]>>>((resolve) => {
      release = () => void createMockApi("healthy").summary().then(resolve);
    }));
    render(<App api={wrap({ summary })} />);
    await flush();
    await act(async () => { await vi.advanceTimersByTimeAsync(10_000); });
    await act(async () => { await vi.advanceTimersByTimeAsync(10_000); });
    expect(summary).toHaveBeenCalledTimes(1);
    release();
    await flush();
    await tickRefresh();
    expect(summary).toHaveBeenCalledTimes(2);
  });

  it("ignores a stale response after the range changed", async () => {
    const calls: { range: Range; resolve: (h: History) => void }[] = [];
    const history = vi.fn((range: Range) => new Promise<History>((resolve) => { calls.push({ range, resolve }); }));
    render(<App api={wrap({ history })} />);
    await flush();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await user.click(screen.getByRole("tab", { name: "7d" }));
    await flush();
    expect(calls.map((c) => c.range)).toEqual(["24h", "7d"]);
    const stale: History = { status: {}, latency: [], warning: "history_unavailable" };
    await act(async () => calls[0]?.resolve(stale));
    expect(screen.queryByText(/History is not available yet/)).toBeNull();
    await act(async () => calls[1]?.resolve({ status: {}, latency: [] }));
    expect(screen.getByText(/No latency readings yet/)).toBeInTheDocument();
  });

  it("stops polling after unmount", async () => {
    const summary = vi.fn(createMockApi("healthy").summary);
    const { unmount } = render(<App api={wrap({ summary })} />);
    await flush();
    const before = summary.mock.calls.length;
    unmount();
    await tickRefresh();
    expect(summary.mock.calls.length).toBe(before);
  });
});

describe("App header", () => {
  it("shows no menu button by default and one when narrow, keeping a single h1", async () => {
    const { container, rerender } = render(<App api={createMockApi("healthy")} />);
    await flush();
    expect(container.querySelector("ha-menu-button")).toBeNull();
    rerender(<App api={createMockApi("healthy")} narrow registerMenu={() => {}} />);
    await flush();
    expect(container.querySelectorAll("ha-menu-button").length).toBe(1);
    expect(container.querySelectorAll("h1").length).toBe(1);
  });
});

// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { AppHeader } from "./AppHeader";
import { Controls } from "./Controls";
import { DeviceList, sortDevices } from "./DeviceList";
import { IncidentList } from "./IncidentList";
import { LatencyChart } from "./LatencyChart";
import { SignalChain } from "./SignalChain";
import { UptimeStrips } from "./UptimeStrips";
import { Verdict } from "./Verdict";
import { Wordmark } from "./Wordmark";
import { useState } from "react";
import type { DeviceDiag, Diagnostics, Link, Range } from "@/lib/types";
import { installDomMatchers, stubResizeObserver } from "@/test-utils";
import { statusColor } from "@/theme/tokens";

beforeAll(() => {
  stubResizeObserver();
  installDomMatchers();
});
afterEach(cleanup);

const link = (id: Link["id"], label: string, status: Link["status"], latency_ms: number | null = null): Link => ({ id, label, status, latency_ms, detail: "" });
const chain = [link("ajax", "Ajax hub", "healthy", 34), link("alarmio", "Alarmio", "down"), link("foxace", "foXaCe", "unknown"), link("ha", "Home Assistant", "healthy", 12.4)];
const dev = (name: string, o: Partial<DeviceDiag> = {}): DeviceDiag => ({ name, online: true, malfunctions: 0, battery: 80, signal: 2, ...o });
const diag = (devices: DeviceDiag[]): Diagnostics => ({ reconnects: 0, ha_version: "1", foxace_version: null, proxy_mode: true, armed: null, devices });

describe("Wordmark", () => {
  it("keeps Alarm and io together", () => {
    const { container } = render(<Wordmark />);
    expect(container.textContent).toContain("Alarmio");
  });
});

describe("Verdict", () => {
  it("renders the headline as the h1 inside a polite status region", () => {
    render(<Verdict verdict={{ tone: "down", headline: "Events stopped at Alarmio", hint: "Check it." }} />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(within(status).getByRole("heading", { level: 1 })).toHaveTextContent("Events stopped at Alarmio");
    expect(status).toHaveTextContent("Check it.");
  });
  it("keeps the live region mounted while loading, then fills it", () => {
    const { rerender } = render(<Verdict verdict={null} />);
    const status = screen.getByRole("status");
    expect(screen.queryAllByRole("heading", { level: 1 })).toHaveLength(0);
    rerender(<Verdict verdict={{ tone: "healthy", headline: "All good", hint: "" }} />);
    expect(screen.getByRole("status")).toBe(status);
    expect(within(status).getByRole("heading", { level: 1 })).toHaveTextContent("All good");
  });
});

describe("SignalChain", () => {
  it("shows four nodes in order with latency in ms", () => {
    render(<SignalChain links={chain} />);
    const list = screen.getByRole("list", { name: "Alarm signal chain" });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items.map((i) => i.getAttribute("data-link"))).toEqual(["ajax", "alarmio", "foxace", "ha"]);
    expect(items[0]).toHaveTextContent("34 ms");
    expect(items[3]).toHaveTextContent("12 ms");
    expect(items[1]).not.toHaveTextContent("ms");
  });
  it("draws the connector after a down node dashed in the down colour, others solid", () => {
    const { container } = render(<SignalChain links={chain} />);
    const connectors = [...container.querySelectorAll<HTMLElement>("[data-connector]")];
    expect(connectors.map((c) => c.dataset.connector)).toEqual(["solid", "dashed", "solid"]);
    expect(connectors[1]?.style.borderStyle).toBe("dashed");
    expect(connectors[1]?.style.borderColor).toBe(statusColor.down.toLowerCase().replace(/^#(..)(..)(..)$/, (_m, r: string, g: string, b: string) => `rgb(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)})`));
  });
  it("gives every status its own icon shape", () => {
    const { container } = render(<SignalChain links={[...chain, link("ajax", "X", "degraded")]} />);
    const icons = new Map<string, string>();
    for (const el of container.querySelectorAll("[data-status-icon]")) {
      const status = el.getAttribute("data-status") ?? "";
      icons.set(status, el.getAttribute("data-status-icon") ?? "");
    }
    expect([...icons.keys()].sort()).toEqual(["degraded", "down", "healthy", "unknown"]);
    expect(new Set(icons.values()).size).toBe(4);
  });
  it("marks list roles explicitly", () => {
    render(<SignalChain links={chain} />);
    expect(screen.getByRole("list", { name: "Alarm signal chain" }).getAttribute("role")).toBe("list");
  });
});

describe("UptimeStrips", () => {
  const now = new Date("2026-11-26T12:00:00Z");
  const history = { status: { alarmio: [{ t: "2026-11-25T12:00:00Z", s: "healthy" as const }, { t: "2026-11-26T06:00:00Z", s: "down" as const }, { t: "2026-11-26T06:30:00Z", s: "healthy" as const }] }, latency: [] };
  it("calls onRangeChange from the tabs", async () => {
    const onRangeChange = vi.fn();
    render(<UptimeStrips history={history} range="24h" onRangeChange={onRangeChange} now={now} />);
    await userEvent.click(screen.getByRole("tab", { name: "7d" }));
    expect(onRangeChange).toHaveBeenCalledWith("7d");
  });
  it("moves between ranges with the arrow keys, independent of any click", async () => {
    function Harness() {
      const [range, setRange] = useState<Range>("24h");
      return <UptimeStrips history={history} range={range} onRangeChange={setRange} now={now} />;
    }
    render(<Harness />);
    const tab = (name: string): HTMLElement => screen.getByRole("tab", { name });
    expect(tab("24h")).toHaveAttribute("aria-selected", "true");
    tab("24h").focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(tab("7d")).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{ArrowLeft}");
    expect(tab("24h")).toHaveAttribute("aria-selected", "true");
  });
  it("has no dangling aria-controls on the tabs", () => {
    render(<UptimeStrips history={history} range="24h" onRangeChange={() => {}} now={now} />);
    for (const t of screen.getAllByRole("tab")) expect(t.hasAttribute("aria-controls")).toBe(false);
  });
  it("shows a percentage or an en dash per row, with a text summary", () => {
    const { container } = render(<UptimeStrips history={history} range="24h" onRangeChange={() => {}} now={now} />);
    const rows = [...container.querySelectorAll("[data-probe]")];
    expect(rows.map((r) => r.getAttribute("data-probe"))).toEqual(["alarmio", "stream", "foxace", "ajax"]);
    expect(rows[0]).toHaveTextContent(/9\d\.\d%/);
    expect(rows[1]).toHaveTextContent("–");
    expect(screen.getByText(/Alarmio: 9\d\.\d% up in the last 24 hours, 1 outage/)).toBeInTheDocument();
    expect(screen.getByText("Event stream: no data in the last 24 hours")).toBeInTheDocument();
  });
  it("shows the unavailable notice instead of strips", () => {
    const { container } = render(<UptimeStrips history={history} range="24h" onRangeChange={() => {}} unavailable />);
    expect(screen.getByText("History is not available yet. Home Assistant's recorder may be starting.")).toBeInTheDocument();
    expect(container.querySelector("[data-probe]")).toBeNull();
  });
});

describe("LatencyChart", () => {
  it("shows the empty state", () => {
    render(<LatencyChart points={[]} />);
    expect(screen.getByText("No latency readings yet. They appear after the first few checks.")).toBeInTheDocument();
  });
  it("labels the reference line and describes the chart", () => {
    render(<LatencyChart points={[{ t: "2026-11-26T10:00:00Z", ms: 100 }, { t: "2026-11-26T10:15:00Z", ms: 1300 }]} />);
    expect(screen.getByText(/Slow above 1000 ms/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Latest 1300 ms, highest 1300 ms/ })).toBeInTheDocument();
  });
  it("dates the axis on 7d", () => {
    const original = globalThis.ResizeObserver;
    class RO {
      private cb: ResizeObserverCallback;
      constructor(cb: ResizeObserverCallback) { this.cb = cb; }
      observe(target: Element): void {
        this.cb([{ target, contentRect: { width: 700, height: 208, x: 0, y: 0, top: 0, left: 0, right: 700, bottom: 208, toJSON: () => ({}) } } as ResizeObserverEntry], this as unknown as ResizeObserver);
      }
      unobserve(): void {}
      disconnect(): void {}
    }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = RO;
    try {
      const end = Date.now();
      const points = Array.from({ length: 168 }, (_, i) => ({ t: new Date(end - (167 - i) * 3_600_000).toISOString(), ms: 100 + (i % 7) }));
      const { container } = render(<LatencyChart points={points} range="7d" />);
      const ticks = [...container.querySelectorAll(".recharts-xAxis-tick-labels .recharts-cartesian-axis-tick-value")].map((n) => n.textContent ?? "");
      expect(ticks.length).toBeGreaterThanOrEqual(3);
      const expected = new Intl.DateTimeFormat(undefined, { weekday: "short", day: "numeric" });
      expect(ticks.every((t) => /\d/.test(t) && !t.includes(":"))).toBe(true);
      expect(ticks.some((t) => t === expected.format(end))).toBe(true);
      expect(new Set(ticks).size).toBe(ticks.length);
    } finally {
      (globalThis as { ResizeObserver?: unknown }).ResizeObserver = original;
    }
  });
  describe("sparse data", () => {
    const original = globalThis.ResizeObserver;
    beforeAll(() => {
      class RO {
        private cb: ResizeObserverCallback;
        constructor(cb: ResizeObserverCallback) { this.cb = cb; }
        observe(target: Element): void {
          this.cb([{ target, contentRect: { width: 700, height: 208, x: 0, y: 0, top: 0, left: 0, right: 700, bottom: 208, toJSON: () => ({}) } } as ResizeObserverEntry], this as unknown as ResizeObserver);
        }
        unobserve(): void {}
        disconnect(): void {}
      }
      (globalThis as { ResizeObserver?: unknown }).ResizeObserver = RO;
    });
    afterAll(() => {
      (globalThis as { ResizeObserver?: unknown }).ResizeObserver = original;
    });
    const labels = (c: HTMLElement): string[] =>
      [...c.querySelectorAll(".recharts-xAxis-tick-labels .recharts-cartesian-axis-tick-value")].map((n) => n.textContent ?? "");
    it("labels a single point", () => {
      const { container } = render(<LatencyChart points={[{ t: "2026-11-26T10:07:00Z", ms: 120 }]} />);
      expect(labels(container).length).toBeGreaterThanOrEqual(1);
    });
    it("labels two points 2 hours apart on 24h", () => {
      const { container } = render(<LatencyChart points={[{ t: "2026-11-26T08:07:00Z", ms: 120 }, { t: "2026-11-26T10:07:00Z", ms: 130 }]} range="24h" />);
      expect(labels(container).length).toBeGreaterThanOrEqual(2);
    });
    it("labels 3 days of data on 30d", () => {
      const end = Date.parse("2026-11-26T10:00:00Z");
      const points = Array.from({ length: 4 }, (_, i) => ({ t: new Date(end - (3 - i) * 86_400_000).toISOString(), ms: 100 + i }));
      const { container } = render(<LatencyChart points={points} range="30d" />);
      expect(labels(container).length).toBeGreaterThanOrEqual(2);
    });
  });
  it("shows the unavailable notice", () => {
    render(<LatencyChart points={[]} unavailable />);
    expect(screen.getByText(/History is not available yet/)).toBeInTheDocument();
  });
});

describe("IncidentList", () => {
  it("shows ongoing and closed durations", () => {
    render(<IncidentList incidents={[
      { id: "1", probe: "alarmio", opened_at: "2026-11-26T10:00:00Z", closed_at: null, detail: "Still down" },
      { id: "2", probe: "stream", opened_at: "2026-11-25T10:00:00Z", closed_at: "2026-11-25T10:17:00Z", detail: "" },
      { id: "3", probe: "foxace", opened_at: "2026-11-24T10:00:00Z", closed_at: "2026-11-24T11:05:00Z", detail: "" },
    ]} />);
    expect(screen.getByText("Ongoing")).toBeInTheDocument();
    expect(screen.getByText("17 min")).toBeInTheDocument();
    expect(screen.getByText("1 h 5 min")).toBeInTheDocument();
    expect(screen.getByText("Event stream")).toBeInTheDocument();
  });
  it("shows the empty state", () => {
    render(<IncidentList incidents={[]} />);
    expect(screen.getByText("No incidents in the last 90 days.")).toBeInTheDocument();
  });
  it("shows an inline notice and keeps earlier incidents", () => {
    render(<IncidentList incidents={[{ id: "2", probe: "stream", opened_at: "2026-11-25T10:00:00Z", closed_at: "2026-11-25T10:17:00Z", detail: "" }]} error="Incidents could not be loaded." />);
    expect(screen.getByText("Incidents could not be loaded.")).toBeInTheDocument();
    expect(screen.getByText("17 min")).toBeInTheDocument();
  });
});

describe("DeviceList", () => {
  it("sorts offline first, then lowest battery, then lowest signal", () => {
    const sorted = sortDevices([dev("ok", { battery: 90 }), dev("low", { battery: 10 }), dev("off", { online: false, battery: 99 }), dev("nobat", { battery: null }), dev("sig", { battery: 10, signal: 0 })]);
    expect(sorted.map((d) => d.name)).toEqual(["off", "sig", "low", "ok", "nobat"]);
  });
  it("asks to turn on sharing when it is off", () => {
    render(<DeviceList diagnostics={null} sharing={false} />);
    expect(screen.getByText("Turn on Share diagnostics to see device battery and signal here.")).toBeInTheDocument();
  });
  it("lists devices worst first with battery and signal", () => {
    render(<DeviceList diagnostics={diag([dev("Fine", { battery: 88, signal: 3 }), dev("Gone", { online: false, battery: 50, signal: null })])} sharing />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Gone");
    expect(items[0]).toHaveTextContent("Offline");
    expect(items[1]).toHaveTextContent("88%");
    expect(items[1]).toHaveTextContent("Signal 3");
  });
  it("gives the name its own line on narrow screens and keeps details on a second line", () => {
    render(<DeviceList diagnostics={diag([dev("Back yard motion", { online: false, malfunctions: 1, battery: 41, signal: null })])} sharing />);
    const item = screen.getAllByRole("listitem")[0] as HTMLElement;
    const name = item.querySelector("[data-device-name]");
    const head = item.querySelector("[data-device-head]");
    expect(name?.textContent).toBe("Back yard motion");
    expect(head?.className).toContain("basis-full");
    expect(head?.className).toContain("sm:basis-0");
    expect(head?.className).toContain("sm:flex-1");
    expect(head?.className).not.toMatch(/(^|\s)flex-1(\s|$)/);
  });
  it("puts the status icon and the name in one flex item so the icon shares the name's line", () => {
    render(<DeviceList diagnostics={diag([dev("Back yard motion", { online: false })])} sharing />);
    const item = screen.getAllByRole("listitem")[0] as HTMLElement;
    const wrapper = item.querySelector("[data-device-head]");
    expect(wrapper?.className).toContain("flex");
    expect(wrapper?.className).toContain("items-center");
    expect(wrapper?.className).toContain("gap-2");
    expect(wrapper?.className).toContain("basis-full");
    expect(wrapper?.className).toContain("sm:flex-1");
    expect(wrapper?.querySelector("[data-status-icon]")).not.toBeNull();
    expect(wrapper?.querySelector("[data-device-name]")?.textContent).toBe("Back yard motion");
  });
  it("renders devices with the same name", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<DeviceList diagnostics={diag([dev("Door", { battery: 10 }), dev("Door", { battery: 90 })])} sharing />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(spy.mock.calls.filter((c) => String(c[0]).includes("same key"))).toHaveLength(0);
    spy.mockRestore();
  });
  it("shows an empty state when sharing with no devices", () => {
    render(<DeviceList diagnostics={diag([])} sharing />);
    expect(screen.getByText(/No devices reported yet/)).toBeInTheDocument();
  });
});

describe("Controls", () => {
  const base = { sharing: false, preview: null, queued: 0 };
  it("disables the button while running, then shows the result", async () => {
    let resolve: (v: { status: "healthy"; latency_ms: number; detail: string }) => void = () => {};
    const onRunE2E = vi.fn(() => new Promise<{ status: "healthy"; latency_ms: number; detail: string }>((r) => { resolve = r; }));
    render(<Controls {...base} onRunE2E={onRunE2E} />);
    await userEvent.click(screen.getByRole("button", { name: "Run end-to-end test" }));
    const busy = screen.getByRole("button", { name: "Testing..." });
    expect(busy).toBeDisabled();
    resolve({ status: "healthy", latency_ms: 140, detail: "All answered." });
    expect(await screen.findByText(/All answered\./)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Run end-to-end test" })).toBeEnabled();
    expect(screen.queryByText(/last 30 seconds/)).toBeNull();
  });
  it("mentions a cached result", async () => {
    render(<Controls {...base} onRunE2E={() => Promise.resolve({ status: "degraded", latency_ms: null, detail: "Slow.", cached: true })} />);
    await userEvent.click(screen.getByRole("button", { name: "Run end-to-end test" }));
    expect(await screen.findByText("Showing a result from the last 30 seconds.")).toBeInTheDocument();
    expect(screen.getByText(/Slow\./)).toBeInTheDocument();
  });
  it("never claims healthy when the server said down", async () => {
    render(<Controls {...base} onRunE2E={() => Promise.resolve({ status: "down", latency_ms: null, detail: "foXaCe could not refresh." })} />);
    await userEvent.click(screen.getByRole("button", { name: "Run end-to-end test" }));
    await screen.findByText(/foXaCe could not refresh\./);
    expect(screen.queryByText(/Healthy/)).toBeNull();
  });
  it("shows an actionable error when the call rejects", async () => {
    render(<Controls {...base} onRunE2E={() => Promise.reject(new Error("Home Assistant is not connected."))} />);
    await userEvent.click(screen.getByRole("button", { name: "Run end-to-end test" }));
    expect(await screen.findByText(/The test could not run: Home Assistant is not connected\. Check that Home Assistant is connected, then try again\./)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Run end-to-end test" })).toBeEnabled();
  });
  it("has no switch and links to the integration settings", () => {
    render(<Controls {...base} onRunE2E={() => Promise.reject(new Error("x"))} />);
    expect(screen.queryByRole("switch")).toBeNull();
    expect(screen.getByRole("link", { name: "Change this in Settings > Devices & services > Alarmio Health." })).toHaveAttribute("href", "/config/integrations/integration/alarmio_health");
  });
  it("lists only the always-on fields when sharing is off", () => {
    const { container } = render(<Controls {...base} onRunE2E={() => Promise.reject(new Error("x"))} />);
    expect(screen.getByText("What is sent to Alarmio")).toBeInTheDocument();
    const text = container.textContent ?? "";
    expect(text).toContain("Always sent");
    for (const s of ["schema version", "time of the report", "integration version", "name, status, latency and a short failure reason", "device counts", "Alarmio identifies you from your session token"]) expect(text).toContain(s);
    expect(text).not.toContain("subscriber id");
    expect(text).not.toContain("delay");
    expect(text).not.toContain("home is likely occupied");
    expect(container.querySelector("pre")).toBeNull();
  });
  it("lists the extra fields when sharing is on, including the occupancy warning", () => {
    const { container } = render(<Controls sharing preview={diag([dev("Front door")])} queued={0} onRunE2E={() => Promise.reject(new Error("x"))} />);
    const text = container.textContent ?? "";
    expect(text).toContain("Also sent because sharing is on");
    for (const s of ["reconnect count", "Home Assistant version", "foXaCe version", "whether proxy mode is used", "whether the alarm is armed", "when the home is likely occupied", "device names, online state, malfunction count, battery and signal"]) expect(text).toContain(s);
    expect(text).not.toContain("subscriber id");
  });
  it("says how many devices were left out when the list was truncated", () => {
    const { container } = render(<Controls sharing preview={{ ...diag([dev("A"), dev("B")]), devices_truncated: 7 }} queued={0} onRunE2E={() => Promise.reject(new Error("x"))} />);
    expect(container.textContent).toContain("Showing the 2 devices with the most urgent problems; 7 more are not shown.");
  });
  it("describes the test button honestly", () => {
    const { container } = render(<Controls {...base} onRunE2E={() => Promise.reject(new Error("x"))} />);
    expect(container.textContent).toContain("Asks foXaCe to fetch fresh state from Ajax through Alarmio now, and times it. It does not send an alarm event.");
    expect(container.textContent).not.toContain("test event");
  });
  it("shows the exact preview JSON and device names when sharing is on", () => {
    const preview = diag([dev("Front door")]);
    const { container } = render(<Controls sharing preview={preview} queued={0} onRunE2E={() => Promise.reject(new Error("x"))} />);
    expect(container.querySelector("pre")?.textContent).toBe(JSON.stringify(preview, null, 2));
    expect(screen.getByText("Device names included: Front door.")).toBeInTheDocument();
  });
  it("shows queued heartbeats with the degraded colour", () => {
    render(<Controls {...base} queued={14} onRunE2E={() => Promise.reject(new Error("x"))} />);
    expect(screen.getByText("Not reporting to Alarmio. 14 updates waiting.")).toBeInTheDocument();
    expect(screen.getByTestId("queued-notice").style.borderColor).toBe("rgb(201, 138, 27)");
  });
  it("hides the queued notice at zero", () => {
    render(<Controls {...base} onRunE2E={() => Promise.reject(new Error("x"))} />);
    expect(screen.queryByTestId("queued-notice")).toBeNull();
  });
});

describe("DeviceList truncation", () => {
  it("shows the truncation line only when devices_truncated is present", () => {
    const { container, rerender } = render(<DeviceList sharing diagnostics={{ ...diag([dev("A")]), devices_truncated: 3 }} />);
    expect(container.textContent).toContain("Showing the 1 devices with the most urgent problems; 3 more are not shown.");
    rerender(<DeviceList sharing diagnostics={diag([dev("A")])} />);
    expect(container.textContent).not.toContain("more are not shown");
  });
});

describe("AppHeader", () => {
  it("renders no menu button when not narrow", () => {
    const { container } = render(<AppHeader narrow={false} registerMenu={() => {}} />);
    expect(container.querySelector("ha-menu-button")).toBeNull();
    expect(container.textContent).toContain("Alarm");
  });
  it("renders one menu button and registers it when narrow, without throwing for an unregistered element", () => {
    const seen: (HTMLElement | null)[] = [];
    const { container, unmount } = render(<AppHeader narrow registerMenu={(n) => seen.push(n)} />);
    expect(container.querySelectorAll("ha-menu-button").length).toBe(1);
    expect(seen[0]).toBe(container.querySelector("ha-menu-button"));
    unmount();
    expect(seen[seen.length - 1]).toBeNull();
  });
});

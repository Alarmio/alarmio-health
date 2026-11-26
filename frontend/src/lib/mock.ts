import type { Api } from "./api";
import type { History, Incident, Link, Range, Status, Summary } from "./types";

export type Scenario = "healthy" | "degraded" | "down" | "empty" | "error" | "slow" | "sparse";
export const SCENARIOS: readonly Scenario[] = ["healthy", "degraded", "down", "empty", "error", "slow", "sparse"];
export const SLOW_MS = 1500;

type Data = "healthy" | "degraded" | "down" | "empty";
const LABELS = { ajax: "Ajax hub", alarmio: "Alarmio", foxace: "foXaCe", ha: "Home Assistant" } as const;
type LinkKey = keyof typeof LABELS;

function links(statuses: Record<LinkKey, [Status, string]>, latency: Partial<Record<LinkKey, number>>): Link[] {
  return (Object.keys(LABELS) as LinkKey[]).map((id) => ({
    id, label: LABELS[id], status: statuses[id][0], detail: statuses[id][1], latency_ms: latency[id] ?? null,
  }));
}

function build(scenario: Data): { summary: Summary; incidents: Incident[]; history: (range: Range) => History } {
  const now = Date.now();
  const iso = (minutesAgo: number): string => new Date(now - minutesAgo * 60000).toISOString();
  const ok: [Status, string] = ["healthy", ""];
  const diag = {
    reconnects: 3, ha_version: "2026.11.0", foxace_version: "0.39.0", proxy_mode: true, armed: false,
    devices: [
      { name: "Front door", online: true, malfunctions: 0, battery: 88, signal: 2 },
      { name: "Garage door", online: true, malfunctions: 0, battery: 12, signal: 1 },
      { name: "Back yard motion", online: false, malfunctions: 1, battery: 41, signal: null },
      { name: "Hallway smoke", online: true, malfunctions: 0, battery: 64, signal: 3 },
    ],
  };
  const summaries: Record<Data, Summary> = {
    healthy: {
      links: links({ ajax: ok, alarmio: ok, foxace: ok, ha: ok }, { ajax: 34, alarmio: 112, foxace: 58 }),
      probes: {}, down_since: null, share_diagnostics: true, queued_heartbeats: 0, diagnostics_preview: diag,
    },
    degraded: {
      links: links({ ajax: ["degraded", "2 devices have low battery."], alarmio: ["degraded", "Alarmio answers slowly (1.2 s)."], foxace: ok, ha: ok }, { ajax: 41, alarmio: 1240, foxace: 60 }),
      probes: {}, down_since: null, share_diagnostics: true, queued_heartbeats: 0, diagnostics_preview: { ...diag, devices_truncated: 7 },
    },
    down: {
      links: links({
        ajax: ok,
        alarmio: ["down", "Alarmio did not answer within 10 s. Check your internet connection and try again later."],
        foxace: ["unknown", "Waiting for Alarmio."],
        ha: ok,
      }, { ajax: 36 }),
      probes: {}, down_since: iso(14), share_diagnostics: false, queued_heartbeats: 14, diagnostics_preview: null,
    },
    empty: {
      links: links({ ajax: ["unknown", ""], alarmio: ["unknown", ""], foxace: ["unknown", ""], ha: ok }, {}),
      probes: {}, down_since: null, share_diagnostics: false, queued_heartbeats: 0, diagnostics_preview: null,
    },
  };
  const incidents: Incident[] = scenario === "empty" ? [] : [
    ...(scenario === "down" ? [{ id: "c", probe: "alarmio", opened_at: iso(14), closed_at: null, detail: "Alarmio did not answer within 10 s." }] : []),
    { id: "a", probe: "stream", opened_at: iso(60 * 30), closed_at: iso(60 * 30 - 17), detail: "Event stream disconnected. foXaCe is retrying." },
    { id: "b", probe: "alarmio", opened_at: iso(60 * 72), closed_at: iso(60 * 72 - 5), detail: "Alarmio did not answer within 10 s." },
  ];
  const history = (range: Range): History => {
    const hours = range === "30d" ? 24 * 30 : range === "7d" ? 24 * 7 : 24;
    if (scenario === "empty") return { status: {}, latency: [] };
    const probes = ["alarmio", "stream", "foxace", "ajax"];
    const status: History["status"] = Object.fromEntries(probes.map((p) => {
      const events: { t: string; s: Status }[] = [{ t: iso(60 * hours), s: "healthy" }];
      if (p === "stream") events.push({ t: iso(60 * 8), s: "down" }, { t: iso(60 * 8 - 12), s: "healthy" });
      if (p === "alarmio" && scenario === "down") events.push({ t: iso(14), s: "down" });
      if (p === "ajax" && scenario === "degraded") events.push({ t: iso(60 * 3), s: "degraded" });
      return [p, events];
    }));
    // 24h: every 15 min (96 points); 7d: hourly (168); 30d: every 1.5 h (480 points, under the server's 500 cap).
    const stepMin = range === "24h" ? 15 : range === "30d" ? 90 : 60;
    const count = Math.min(500, Math.round((hours * 60) / stepMin));
    const latency = Array.from({ length: count }, (_, i) => ({
      t: iso((count - 1 - i) * stepMin),
      ms: 90 + ((i * 37) % 60) + (scenario === "degraded" && i > count - 16 ? 1100 : 0),
    })).filter((_, i) => scenario !== "down" || i < count - 6);
    return { status, latency };
  };
  return { summary: summaries[scenario], incidents, history };
}

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** Two latency readings 2 hours apart, to check the chart axis with sparse data. */
const sparseHistory = (h: History): History => {
  const now = Date.now();
  return { ...h, latency: [{ t: new Date(now - 7_200_000).toISOString(), ms: 110 }, { t: new Date(now).toISOString(), ms: 125 }] };
};

/** Dev-only fake API. `error` rejects every call; `slow` answers after 1500 ms with healthy data. */
export function createMockApi(scenario: Scenario): Api {
  if (scenario === "error") {
    const fail = (): Promise<never> => Promise.reject(new Error("The mock API is set to fail."));
    return { summary: fail, history: fail, incidents: fail, runE2E: fail };
  }
  const data = build(scenario === "slow" || scenario === "sparse" ? "healthy" : scenario);
  const delay = scenario === "slow" ? SLOW_MS : 0;
  const later = async <T,>(value: () => T): Promise<T> => {
    if (delay) await wait(delay);
    return value();
  };
  const down = scenario === "down";
  return {
    summary: () => later(() => data.summary),
    history: (range) => later(() => (scenario === "sparse" ? sparseHistory(data.history(range)) : data.history(range))),
    incidents: () => later(() => data.incidents),
    runE2E: () => later(() => ({
      status: down ? "down" : "healthy",
      latency_ms: down ? null : 140,
      detail: down ? "foXaCe could not refresh through Alarmio. Check the chain above." : "Ajax, Alarmio and foXaCe answered.",
    })),
  };
}

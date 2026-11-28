import type { Api } from "./api";
import type { ChainNode, History, Incident, Link, NodeId, Range, Status, Summary, Trace } from "./types";

export type Scenario = "healthy" | "degraded" | "down" | "empty" | "error" | "slow" | "sparse" | "route" | "gateway" | "direct";
export const SCENARIOS: readonly Scenario[] = ["healthy", "degraded", "down", "empty", "error", "slow", "sparse", "route", "gateway", "direct"];
export const SLOW_MS = 1500;

type Data = "healthy" | "degraded" | "down" | "empty" | "route" | "gateway" | "direct";
const LABELS = { ajax: "Ajax hub", alarmio: "Alarmio", foxace: "foXaCe", ha: "Home Assistant" };
type LinkKey = keyof typeof LABELS;

function links(statuses: Record<LinkKey, [Status, string]>, latency: Partial<Record<LinkKey, number>>): Link[] {
  return (Object.keys(LABELS) as LinkKey[]).map((id) => ({
    id, label: LABELS[id], status: statuses[id][0], detail: statuses[id][1], latency_ms: latency[id] ?? null,
  }));
}

const NODE_LABELS: Record<NodeId, string> = {
  ajax_hub: "Ajax hub", ajax_cloud: "Ajax cloud", alarmio: "Alarmio", internet: "Internet", gateway: "Router", ha: "Home Assistant",
};
const NODE_ORDER: readonly NodeId[] = ["ajax_hub", "ajax_cloud", "alarmio", "internet", "gateway", "ha"];
type NodeSpec = [status: Status, latency: number | null, detail?: string];

/** Chain in event order. A node with a spec was evaluated; one without was beyond the break. `skip` drops nodes (direct mode). */
function chainOf(specs: Partial<Record<NodeId, NodeSpec>>, skip: readonly NodeId[] = []): ChainNode[] {
  return NODE_ORDER.filter((id) => !skip.includes(id)).map((id): ChainNode => {
    const spec = specs[id];
    if (!spec) return { id, label: NODE_LABELS[id], status: "unknown", latency_ms: null, detail: "Not evaluated", evaluated: false };
    return { id, label: NODE_LABELS[id], status: spec[0], latency_ms: spec[1], detail: spec[2] ?? "", evaluated: true };
  });
}

const HEALTHY_SPECS: Partial<Record<NodeId, NodeSpec>> = {
  ajax_hub: ["healthy", 34], ajax_cloud: ["healthy", 180], alarmio: ["healthy", 3], internet: ["healthy", 12], gateway: ["healthy", 0.4], ha: ["healthy", null],
};
const HEALTHY_TRACE: Trace = {
  blamed: null,
  segments: [{ id: "gateway", ms: 0.4 }, { id: "internet", ms: 12 }, { id: "route", ms: 172 }, { id: "alarmio", ms: 3 }, { id: "ajax", ms: 180 }],
};
const ROUTE_CAUSE = "Packets to Alarmio were lost (3 of 5 pings). Alarmio itself answered in 3 ms.";

type Echo = Pick<Summary, "chain" | "trace" | "cause" | "cause_status" | "integration_version">;
const echo = (chain: ChainNode[], trace: Trace, cause: string, cause_status: Status): Echo =>
  ({ chain, trace, cause, cause_status, integration_version: "0.2.0" });

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
      ...echo(chainOf(HEALTHY_SPECS), HEALTHY_TRACE, "", "healthy"),
    },
    degraded: {
      links: links({ ajax: ["degraded", "2 devices have low battery."], alarmio: ["degraded", "Alarmio answers slowly (1.2 s)."], foxace: ok, ha: ok }, { ajax: 41, alarmio: 1240, foxace: 60 }),
      probes: {}, down_since: null, share_diagnostics: true, queued_heartbeats: 0, diagnostics_preview: { ...diag, devices_truncated: 7 },
      ...echo(
        chainOf({ ...HEALTHY_SPECS, alarmio: ["degraded", 740, "Alarmio is slow to process requests."] }),
        { blamed: "alarmio", segments: [{ id: "gateway", ms: 0.4 }, { id: "internet", ms: 12 }, { id: "route", ms: 172 }, { id: "alarmio", ms: 740 }, { id: "ajax", ms: 180 }] },
        "Alarmio is slow to process requests (740 ms).", "degraded"),
    },
    down: {
      links: links({
        ajax: ok,
        alarmio: ["down", "Alarmio did not answer within 10 s. Check your internet connection and try again later."],
        foxace: ["unknown", "Waiting for Alarmio."],
        ha: ok,
      }, { ajax: 36 }),
      probes: {}, down_since: iso(14), share_diagnostics: false, queued_heartbeats: 14, diagnostics_preview: null,
      ...echo(
        chainOf({ gateway: ["healthy", 0.4], internet: ["healthy", 12], alarmio: ["down", null, "Alarmio did not answer."], ha: ["healthy", null] }),
        { blamed: "route", segments: [{ id: "gateway", ms: 0.4 }, { id: "internet", ms: 12 }] },
        "Nothing reached Alarmio. Either Alarmio is down or the route to it is.", "down"),
    },
    empty: {
      links: links({ ajax: ["unknown", ""], alarmio: ["unknown", ""], foxace: ["unknown", ""], ha: ok }, {}),
      probes: {}, down_since: null, share_diagnostics: false, queued_heartbeats: 0, diagnostics_preview: null,
      ...echo([], { blamed: null, segments: [] }, "", "unknown"),
    },
    route: {
      links: links({ ajax: ok, alarmio: ["degraded", ROUTE_CAUSE], foxace: ok, ha: ok }, { ajax: 34, alarmio: 3, foxace: 58 }),
      probes: {}, down_since: null, share_diagnostics: true, queued_heartbeats: 0, diagnostics_preview: diag,
      ...echo(
        chainOf({ ...HEALTHY_SPECS, alarmio: ["healthy", 3], internet: ["healthy", 12] }),
        { blamed: "route", segments: [{ id: "gateway", ms: 0.4 }, { id: "internet", ms: 12 }, { id: "route", ms: 180 }, { id: "alarmio", ms: 3 }, { id: "ajax", ms: 180 }] },
        ROUTE_CAUSE, "degraded"),
    },
    gateway: {
      links: links({
        ajax: ["unknown", "Not evaluated"], alarmio: ["unknown", "Not evaluated"], foxace: ["unknown", "Not evaluated"], ha: ok,
      }, {}),
      probes: {}, down_since: iso(40), share_diagnostics: false, queued_heartbeats: 6, diagnostics_preview: null,
      ...echo(
        chainOf({ gateway: ["down", null, "The router did not answer."], ha: ["healthy", null] }),
        { blamed: "gateway", segments: [] },
        "Your router did not answer. Check your local network.", "down"),
    },
    direct: {
      links: links({ ajax: ok, alarmio: ["unknown", "foXaCe is not using Alarmio (direct mode)."], foxace: ok, ha: ok }, { ajax: 34, foxace: 58 }),
      probes: {}, down_since: null, share_diagnostics: true, queued_heartbeats: 0, diagnostics_preview: { ...diag, proxy_mode: false },
      ...echo(
        chainOf(HEALTHY_SPECS, ["alarmio"]),
        { blamed: null, segments: [{ id: "gateway", ms: 0.4 }, { id: "internet", ms: 12 }, { id: "ajax", ms: 230 }] },
        "", "healthy"),
    },
  };
  const incidents: Incident[] = scenario === "empty" ? [] : [
    ...(scenario === "route" ? [{ id: "r", probe: "alarmio", opened_at: iso(60 * 3), closed_at: iso(60 * 3 - 25), detail: ROUTE_CAUSE }] : []),
    ...(scenario === "gateway" ? [{ id: "g", probe: "gateway", opened_at: iso(40), closed_at: null, detail: "The router did not answer." }] : []),
    ...(scenario === "down" ? [{ id: "c", probe: "alarmio", opened_at: iso(14), closed_at: null, detail: "Alarmio did not answer within 10 s." }] : []),
    { id: "a", probe: "stream", opened_at: iso(60 * 30), closed_at: iso(60 * 30 - 17), detail: "Event stream disconnected. foXaCe is retrying." },
    { id: "b", probe: "alarmio", opened_at: iso(60 * 72), closed_at: iso(60 * 72 - 5), detail: "Alarmio did not answer within 10 s." },
  ];
  const history = (range: Range): History => {
    const hours = range === "30d" ? 24 * 30 : range === "7d" ? 24 * 7 : 24;
    if (scenario === "empty") return { status: {}, latency: [] };
    const probes = ["gateway", "internet", "alarmio", "ajaxcloud", "stream", "foxace", "ajax"];
    const status: History["status"] = Object.fromEntries(probes.map((p) => {
      const events: { t: string; s: Status }[] = [{ t: iso(60 * hours), s: "healthy" }];
      if (p === "stream") events.push({ t: iso(60 * 8), s: "down" }, { t: iso(60 * 8 - 12), s: "healthy" });
      if (p === "alarmio" && scenario === "down") events.push({ t: iso(14), s: "down" });
      if (p === "alarmio" && scenario === "route") events.push({ t: iso(40), s: "degraded" });
      if (p === "gateway" && scenario === "gateway") events.push({ t: iso(40), s: "down" });
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

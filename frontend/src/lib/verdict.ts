import type { Blamed, Link, Status, Summary } from "./types";

export interface Verdict { tone: Status; headline: string; hint: string }

const UNKNOWN_VERDICT: Verdict = { tone: "unknown", headline: "Not enough data yet to tell", hint: "Checks run every minute." };

/** " 14 min ago", " 2 h ago", " just now", or "" when the start of the outage is missing or unparseable. */
function since(downSince: string | null, now: Date): string {
  if (!downSince) return "";
  const started = new Date(downSince).getTime();
  if (Number.isNaN(started)) return "";
  const elapsedMs = now.getTime() - started;
  if (elapsedMs < 60_000) return " just now"; // under a minute, or a start time in the future
  const minutes = Math.round(elapsedMs / 60_000);
  if (minutes < 60) return ` ${minutes} min ago`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? ` ${h} h ago` : ` ${h} h ${m} min ago`;
}

/**
 * One sentence that answers: will an alarm event reach me right now?
 * "healthy" is only returned when every non-HA link is healthy. The HA link merely reports that
 * the integration is running, so it cannot block "healthy" by being unknown (down or degraded still count).
 */
export function verdict(links: Link[], downSince: string | null, now: Date): Verdict {
  const down = links.find((l) => l.status === "down");
  if (down) {
    return { tone: "down", headline: `Events stopped at ${down.label}${since(downSince, now)}`, hint: down.detail };
  }
  const degraded = links.find((l) => l.status === "degraded");
  const unknownChain = links.find((l) => l.id !== "ha" && l.status === "unknown");
  if (degraded && unknownChain) {
    // Another hop cannot be checked, so delivery cannot be asserted.
    return {
      tone: "degraded",
      headline: `${degraded.label} needs attention and ${unknownChain.label} cannot be checked`,
      hint: degraded.detail,
    };
  }
  if (degraded) {
    return {
      tone: "degraded",
      headline: `Alarm events are reaching Home Assistant, but ${degraded.label} needs attention`,
      hint: degraded.detail,
    };
  }
  const chain = links.filter((l) => l.id !== "ha");
  if (chain.length === 0 || chain.some((l) => l.status !== "healthy")) {
    return UNKNOWN_VERDICT;
  }
  return { tone: "healthy", headline: "Alarm events are reaching Home Assistant", hint: "" };
}

const BLAME_HEADLINE: Record<Blamed, Record<"degraded" | "down", string>> = {
  ha_host: { degraded: "Home Assistant was busy for a moment", down: "Home Assistant is not responding" },
  gateway: { degraded: "Your router is slow or dropping packets", down: "Your router is not answering" },
  internet: { degraded: "Your internet connection is unreliable", down: "Your internet connection is down" },
  route: { degraded: "The route to Alarmio is unreliable", down: "Alarmio cannot be reached from here" },
  alarmio: { degraded: "Alarmio is slow to answer", down: "Alarmio is not answering" },
  ajax_cloud: { degraded: "Ajax's cloud is having trouble", down: "Ajax's cloud cannot be reached" },
};

/** Direct mode: the chain has nodes but none is Alarmio. Unknown router/internet nodes are tolerated (routers ignore pings). */
const OPTIONAL_DIRECT_NODES: readonly string[] = ["gateway", "internet"];

/** Blame-aware verdict; with no blame (or a healthy/unknown cause) it falls back to the link-based verdict. */
export function summaryVerdict(summary: Summary, now: Date): Verdict {
  const chain = summary.chain;
  const directMode = chain.length > 0 && !chain.some((n) => n.id === "alarmio");
  // Direct mode has no Alarmio link, so it must not feed the headline ("Alarmio cannot be checked").
  const links = directMode ? summary.links.filter((l) => l.id !== "alarmio") : summary.links;
  const fromLinks = verdict(links, summary.down_since, now);
  const blamed = summary.trace.blamed;
  const status = summary.cause_status;
  if (blamed !== null && (status === "degraded" || status === "down")) {
    // Events have stopped at a legacy link: that outranks a merely degraded blame.
    if (status === "degraded" && fromLinks.tone === "down") return fromLinks;
    return { tone: status, headline: BLAME_HEADLINE[blamed][status], hint: summary.cause };
  }
  if (directMode && status === "healthy" && fromLinks.tone !== "down" && fromLinks.tone !== "degraded") {
    const othersHealthy = links.filter((l) => l.id !== "ha").every((l) => l.status === "healthy");
    const chainOk = chain.every((n) => (n.evaluated && n.status === "healthy") || (OPTIONAL_DIRECT_NODES.includes(n.id) && n.status === "unknown"));
    return othersHealthy && chainOk ? { tone: "healthy", headline: "Alarm events are reaching Home Assistant", hint: "" } : UNKNOWN_VERDICT;
  }
  return fromLinks;
}

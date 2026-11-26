import type { Link, Status } from "./types";

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

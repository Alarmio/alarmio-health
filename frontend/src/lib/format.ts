import type { Range, Status } from "./types";

export const PROBE_IDS = ["gateway", "internet", "alarmio", "ajaxcloud", "stream", "ajax"] as const;
export const PROBE_TITLES: Record<string, string> = {
  gateway: "Router", internet: "Internet", alarmio: "Alarmio", ajaxcloud: "Ajax cloud", stream: "Event stream",
  ajax: "Ajax devices", foxace: "foXaCe", tls: "Alarmio certificate", session: "Alarmio session",
};
export const probeTitle = (probe: string): string => PROBE_TITLES[probe] ?? probe;

export const STATUS_LABEL: Record<Status, string> = { healthy: "Healthy", degraded: "Needs attention", down: "Down", unknown: "Unknown" };

/** "17 min", "1 h 5 min", "2 d 3 h". Returns null when either time is invalid or the span is negative. */
export function formatDuration(openedAt: string, closedAt: string): string | null {
  const ms = new Date(closedAt).getTime() - new Date(openedAt).getTime();
  if (!Number.isFinite(ms) || ms < 0) return null;
  const minutes = Math.round(ms / 60_000);
  if (minutes < 1) return "under 1 min";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return minutes % 60 === 0 ? `${hours} h` : `${hours} h ${minutes % 60} min`;
  const days = Math.floor(hours / 24);
  return hours % 24 === 0 ? `${days} d` : `${days} d ${hours % 24} h`;
}

/** Local date and time, or "Unknown time" for an unparseable timestamp. */
export function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown time";
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

/** "99.8%"; rounds down so that anything below 100 never displays as 100. En dash when unknown. */
export function formatPercent(p: number | null): string {
  if (p === null) return "–";
  if (p >= 100) return "100%";
  return `${(Math.floor(p * 10) / 10).toFixed(1)}%`;
}

const dtf = (options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat => new Intl.DateTimeFormat(undefined, options);

/** X-axis tick text for the latency chart, by the range the data covers: time of day, weekday + day, or day + month. */
export function latencyTick(t: number, range: Range): string {
  if (range === "7d") return dtf({ weekday: "short", day: "numeric" }).format(t);
  if (range === "30d") return dtf({ day: "numeric", month: "short" }).format(t);
  return dtf({ hour: "2-digit", minute: "2-digit" }).format(t);
}

/** Full date and time, for the tooltip. */
export function latencyFull(t: number): string {
  return dtf({ weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(t);
}

/** Evenly spaced ticks on local boundaries (every 6 h, 2 days or 7 days), so labels never repeat. */
export function axisTicks(min: number, max: number, range: Range): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return [];
  const ticks: number[] = [];
  const first = new Date(min);
  if (range === "24h") {
    first.setMinutes(0, 0, 0);
    first.setHours(Math.ceil((first.getHours() + (first.getTime() < min ? 1 : 0)) / 6) * 6);
    for (let d = first; d.getTime() <= max; d.setHours(d.getHours() + 6)) ticks.push(d.getTime());
  } else {
    const step = range === "7d" ? 2 : 7;
    first.setHours(0, 0, 0, 0);
    if (first.getTime() < min) first.setDate(first.getDate() + 1);
    for (let d = first; d.getTime() <= max; d.setDate(d.getDate() + step)) ticks.push(d.getTime());
  }
  return ticks;
}

/** Milliseconds for display: one decimal under 10 so a 0.4 ms hop does not read as 0, whole numbers above. */
export function formatMs(ms: number): string {
  const r = Math.round(ms * 10) / 10;
  return r < 10 ? `${r.toFixed(1)} ms` : `${Math.round(ms)} ms`;
}

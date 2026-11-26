import { useMemo } from "react";
import { StatusIcon } from "./StatusIcon";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PROBE_IDS, formatPercent, probeTitle, STATUS_LABEL } from "@/lib/format";
import { buildStrip, uptimePercent } from "@/lib/strips";
import type { History, Range, Status } from "@/lib/types";
import { haVar, statusColor } from "@/theme/tokens";

export const RANGE_MS: Record<Range, number> = { "24h": 86_400_000, "7d": 7 * 86_400_000, "30d": 30 * 86_400_000 };
const RANGE_WORDS: Record<Range, string> = { "24h": "24 hours", "7d": "7 days", "30d": "30 days" };
const RANGES: Range[] = ["24h", "7d", "30d"];
const BUCKETS = 48;
const BUCKET_W = 6;
const GAP = 2;
const HEIGHT = 28;
/** Worse states are taller, so the strip reads without colour. */
const BAR_HEIGHT: Record<Status, number> = { unknown: 8, healthy: 16, degraded: 22, down: HEIGHT };
const LEGEND: Status[] = ["healthy", "degraded", "down", "unknown"];

function outageCount(strip: Status[]): number {
  return strip.reduce((n, s, i) => (s === "down" && strip[i - 1] !== "down" ? n + 1 : n), 0);
}

function summaryText(title: string, percent: number | null, strip: Status[], range: Range): string {
  if (percent === null) return `${title}: no data in the last ${RANGE_WORDS[range]}`;
  const outages = outageCount(strip);
  const outageText = outages === 0 ? "no outages" : outages === 1 ? "1 outage" : `${outages} outages`;
  return `${title}: ${formatPercent(percent)} up in the last ${RANGE_WORDS[range]}, ${outageText}`;
}

interface Props {
  history: History;
  range: Range;
  onRangeChange(range: Range): void;
  /** The range `history` was loaded for, while a newer range is loading. Defaults to `range`. */
  dataRange?: Range;
  unavailable?: boolean;
  error?: string | null;
  /** Small note shown above earlier data, e.g. when a refresh failed. */
  notice?: string | null;
  now?: Date;
}

export function UptimeStrips({ history, range, onRangeChange, dataRange, unavailable = false, error = null, notice = null, now }: Props) {
  const shown = dataRange ?? range;
  const end = useMemo(() => now ?? new Date(), [now, history]);
  const rows = useMemo(() => {
    const start = new Date(end.getTime() - RANGE_MS[shown]);
    return PROBE_IDS.map((id) => {
      const strip = buildStrip(history.status[id] ?? [], start, end, BUCKETS);
      return { id, title: probeTitle(id), strip, percent: uptimePercent(strip) };
    });
  }, [history, shown, end]);
  const width = BUCKETS * (BUCKET_W + GAP) - GAP;

  return (
    <section aria-labelledby="uptime-heading" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="uptime-heading" className="font-display text-xl font-semibold">Uptime</h2>
        <Tabs value={range} onValueChange={(value) => onRangeChange(value as Range)}>
          <TabsList aria-label="Time range">
            {RANGES.map((r) => (
              <TabsTrigger key={r} value={r} aria-controls={undefined}>{r}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      {unavailable ? (
        <p style={{ color: haVar.textMuted }}>History is not available yet. Home Assistant&apos;s recorder may be starting.</p>
      ) : error ? (
        <p style={{ color: haVar.textMuted }}>{error}</p>
      ) : (
        <>
          {notice ? <p className="text-sm" style={{ color: haVar.textMuted }}>{notice}</p> : null}
          <ul role="list" className="flex flex-col gap-3" aria-busy={shown !== range}>
            {rows.map((row) => (
              <li key={row.id} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 sm:grid-cols-[9rem_1fr_4.5rem]" data-probe={row.id}>
                <span className="text-sm font-medium" aria-hidden="true">{row.title}</span>
                <span className="font-mono text-sm sm:order-3 sm:text-right" aria-hidden="true">{formatPercent(row.percent)}</span>
                <span className="sr-only">{summaryText(row.title, row.percent, row.strip, shown)}</span>
                <svg
                  role="img"
                  aria-label={`${row.title} status over the last ${RANGE_WORDS[shown]}`}
                  viewBox={`0 0 ${width} ${HEIGHT}`}
                  preserveAspectRatio="none"
                  className="col-span-2 h-7 w-full sm:order-2 sm:col-span-1"
                >
                  {row.strip.map((s, i) => (
                    <rect key={i} x={i * (BUCKET_W + GAP)} y={HEIGHT - BAR_HEIGHT[s]} width={BUCKET_W} height={BAR_HEIGHT[s]} rx={2} fill={statusColor[s]} data-status={s} />
                  ))}
                </svg>
              </li>
            ))}
          </ul>
          <ul role="list" className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: haVar.textMuted }} aria-label="Legend">
            {LEGEND.map((s) => (
              <li key={s} className="flex items-center gap-1">
                <StatusIcon status={s} className="size-3.5" />
                {s === "unknown" ? "No data" : STATUS_LABEL[s]}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

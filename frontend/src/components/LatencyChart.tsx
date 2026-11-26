import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { axisTicks, latencyFull, latencyTick } from "@/lib/format";
import type { History, Range } from "@/lib/types";
import { chartSeries, fontFamily, haVar, statusColor } from "@/theme/tokens";

export const SLOW_MS = 1000;
const config = { ms: { label: "Latency (ms)", color: chartSeries } } satisfies ChartConfig;

interface Props {
  points: History["latency"];
  /** The range `points` cover (App passes `dataRange`), so tick labels match the data shown. */
  range?: Range;
  unavailable?: boolean;
  error?: string | null;
  /** Small note shown above earlier data, e.g. when a refresh failed. */
  notice?: string | null;
}

export function LatencyChart({ points, range = "24h", unavailable = false, error = null, notice = null }: Props) {
  const data = points
    .map((p) => ({ t: new Date(p.t).getTime(), ms: p.ms }))
    .filter((p) => Number.isFinite(p.t) && Number.isFinite(p.ms))
    .sort((a, b) => a.t - b.t);
  const max = data.reduce((m, p) => Math.max(m, p.ms), 0);
  const last = data[data.length - 1];
  // Fewer than 2 derived ticks (sparse data) would leave the axis unlabelled: let the library choose them.
  const derived = axisTicks(data[0]?.t ?? 0, last?.t ?? 0, range);
  const ticks = derived.length >= 2 ? derived : undefined;

  return (
    <section aria-labelledby="latency-heading" className="flex flex-col gap-3">
      <h2 id="latency-heading" className="font-display text-xl font-semibold">Alarmio latency <span className="text-sm font-normal" style={{ color: haVar.textMuted }}>(ms)</span></h2>
      {unavailable ? (
        <p style={{ color: haVar.textMuted }}>History is not available yet. Home Assistant&apos;s recorder may be starting.</p>
      ) : error ? (
        <p style={{ color: haVar.textMuted }}>{error}</p>
      ) : data.length === 0 || !last ? (
        <p style={{ color: haVar.textMuted }}>No latency readings yet. They appear after the first few checks.</p>
      ) : (
        <>
          {notice ? <p className="text-sm" style={{ color: haVar.textMuted }}>{notice}</p> : null}
          <ChartContainer
            config={config}
            className="aspect-auto h-52 w-full"
            role="img"
            aria-label={`Alarmio latency over time. Latest ${Math.round(last.ms)} ms, highest ${Math.round(max)} ms.`}
          >
            <LineChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke={haVar.divider} />
              <XAxis dataKey="t" type="number" scale="time" domain={["dataMin", "dataMax"]} ticks={ticks} interval={ticks ? 0 : "preserveStartEnd"} tickFormatter={(t: number) => latencyTick(t, range)} tickLine={false} axisLine={false} tick={{ fontFamily: fontFamily.mono, fontSize: 12 }} />
              <YAxis width={40} tickLine={false} axisLine={false} domain={[0, Math.max(1200, Math.ceil(max / 200) * 200)]} />
              <ChartTooltip content={<ChartTooltipContent hideIndicator labelFormatter={(_l, items) => latencyFull(Number(items[0]?.payload?.t))} />} />
              <ReferenceLine y={SLOW_MS} stroke={statusColor.degraded} strokeDasharray="6 4" strokeWidth={1.5} />
              <Line dataKey="ms" type="monotone" stroke="var(--color-ms)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ChartContainer>
          <p className="flex items-center gap-2 text-sm" style={{ color: haVar.textMuted }}>
            <svg aria-hidden="true" width="24" height="4" className="shrink-0"><line x1="0" y1="2" x2="24" y2="2" stroke={statusColor.degraded} strokeWidth="2" strokeDasharray="6 4" /></svg>
            Slow above {SLOW_MS} ms
          </p>
        </>
      )}
    </section>
  );
}

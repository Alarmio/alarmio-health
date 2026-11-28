import type { CSSProperties } from "react";
import { StatusIcon } from "./StatusIcon";
import { formatMs } from "@/lib/format";
import { layoutTrace, SEGMENT_LABEL } from "@/lib/trace";
import type { Blamed, SegmentId, Status, Trace } from "@/lib/types";
import { chartSeries, haVar, statusColor } from "@/theme/tokens";

const BLAMES: Partial<Record<Blamed, SegmentId>> = { route: "route", gateway: "gateway", internet: "internet", alarmio: "alarmio", ajax_cloud: "ajax" };

/**
 * One bar for the last check, split into the hops the echo travelled. Width is the share of time spent (never so
 * thin it vanishes). Only the blamed hop takes the cause colour; hops the check never reached are dashed outlines.
 */
export function EchoTrace({ trace, proxyMode, causeStatus }: { trace: Trace; proxyMode: boolean; causeStatus: Status }) {
  const blamedId = trace.blamed === null ? undefined : BLAMES[trace.blamed];
  const empty = trace.segments.length === 0 && blamedId === undefined;
  const parts = empty ? [] : layoutTrace(trace.segments, proxyMode);
  const measured = parts.filter((p) => p.ms !== null);
  const total = measured.reduce((sum, p) => sum + (p.ms ?? 0), 0);
  const anyBlamed = blamedId !== undefined && parts.some((p) => p.id === blamedId);
  return (
    <section aria-labelledby="trace-heading" className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="trace-heading" className="font-display text-xl font-semibold">Last check</h2>
          {measured.length >= 2 ? <p className="font-mono text-sm">Total {Math.round(total)} ms</p> : null}
        </div>
        <p className="text-sm" style={{ color: haVar.textMuted }}>Home Assistant out to Ajax and back, one minute ago at most.</p>
      </div>
      {empty ? (
        <p className="text-sm">
          {trace.blamed === "ha_host" ? "Home Assistant was busy, so this check was skipped." : "No timing yet. The first check runs within a minute."}
        </p>
      ) : (
        <ol role="list" aria-label="Where the last check spent its time" className="flex flex-col gap-3 sm:flex-row sm:gap-0.5">
          {parts.map((p) => {
            const isMeasured = p.ms !== null;
            const isBlamed = p.id === blamedId;
            const fill = isBlamed ? statusColor[causeStatus] : chartSeries;
            return (
              <li
                key={p.id}
                data-segment={p.id}
                data-blamed={isBlamed ? "true" : "false"}
                data-measured={isMeasured ? "true" : "false"}
                className="grid min-w-0 grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-1 sm:flex sm:basis-[var(--share)] sm:flex-col sm:items-stretch"
                style={{ "--share": `${p.share * 100}%` } as CSSProperties}
              >
                {isBlamed ? (
                  <div className="col-span-2 flex items-end sm:order-1 sm:h-5">
                    <StatusIcon status={causeStatus} label />
                  </div>
                ) : anyBlamed ? (
                  <div aria-hidden="true" className="hidden h-5 sm:order-1 sm:block" />
                ) : null}
                <p className={`break-words text-sm sm:order-4 ${isBlamed ? "font-semibold" : ""}`} style={isMeasured ? undefined : { color: haVar.textMuted }}>
                  {SEGMENT_LABEL[p.id]}
                </p>
                <p className="font-mono text-sm sm:order-3 sm:mt-0.5" style={isMeasured ? undefined : { color: haVar.textMuted }}>
                  {p.ms === null ? <>–<span className="sr-only">{isBlamed ? " no answer" : " not reached"}</span></> : formatMs(p.ms)}
                </p>
                <div
                  data-bar=""
                  className={`col-span-2 h-3 rounded-sm border sm:order-2 sm:h-4 ${isMeasured ? "max-sm:w-[var(--share)]" : "border-2"}`}
                  style={
                    isMeasured
                      ? { backgroundColor: fill, borderColor: fill }
                      : { backgroundColor: "transparent", borderColor: haVar.divider, borderStyle: "dashed" }
                  }
                />
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

import { StatusIcon } from "./StatusIcon";
import { formatMs, STATUS_LABEL } from "@/lib/format";
import type { Blamed, ChainNode, Status } from "@/lib/types";
import { haVar, statusColor } from "@/theme/tokens";

/**
 * The places an alarm event passes through, in the direction it travels. Nodes beyond the first break were never
 * checked: they are dashed and muted, never red. The line between Alarmio and the Internet is the route and takes
 * the cause status when it is the culprit.
 */
export function SignalChain({ chain, blamed, causeStatus }: { chain: ChainNode[]; blamed: Blamed | null; causeStatus: Status }) {
  if (chain.length === 0) return null;
  return (
    <ol role="list" aria-label="Alarm signal chain" className="chain-in flex flex-col lg:flex-row lg:items-stretch">
      {chain.map((node, i) => {
        const next = chain[i + 1];
        const isRoute = blamed === "route" && node.id === "alarmio" && next?.id === "internet";
        const dashed = isRoute || !node.evaluated || (next !== undefined && !next.evaluated);
        const shownStatus: Status = node.evaluated ? node.status : "unknown";
        return (
          <li key={node.id} className="flex flex-col lg:min-w-0 lg:flex-1 lg:flex-row" data-node={node.id} data-evaluated={node.evaluated ? "true" : "false"}>
            <div
              className="relative rounded-lg border border-transparent px-4 py-3 lg:flex-1"
              style={{ background: node.evaluated ? haVar.surface : "transparent" }}
            >
              {/* The border is its own layer so an unchecked hop can be quieter without fading its text. */}
              <span
                aria-hidden="true"
                data-border=""
                className={`pointer-events-none absolute -inset-px rounded-lg border ${node.evaluated ? "" : "opacity-60"}`}
                style={{ borderStyle: node.evaluated ? "solid" : "dashed", borderColor: node.evaluated ? haVar.divider : haVar.textMuted }}
              />
              <div className="flex items-center gap-2">
                <StatusIcon status={shownStatus} />
                <span className="font-display text-base font-semibold" style={node.evaluated ? undefined : { color: haVar.textMuted }}>{node.label}</span>
              </div>
              <p className="mt-1 text-sm" style={{ color: haVar.textMuted }}>{node.evaluated ? STATUS_LABEL[node.status] : "Not checked"}</p>
              {node.evaluated && node.status !== "healthy" && node.detail !== "" ? (
                <p data-node-detail="" className="mt-1 text-xs" style={{ color: haVar.textMuted }}>{node.detail}</p>
              ) : null}
              {node.evaluated && node.latency_ms !== null ? <p className="font-mono text-sm">{formatMs(node.latency_ms)}</p> : null}
            </div>
            {next === undefined ? null : (
              <div
                data-connector={dashed ? "dashed" : "solid"}
                data-route={isRoute ? "blamed" : undefined}
                aria-hidden={isRoute ? undefined : "true"}
                className={`relative ml-6 w-0 ${dashed && !isRoute ? "opacity-60" : ""} border-l-2 lg:ml-0 lg:h-0 lg:self-center lg:border-t-2 lg:border-l-0 ${isRoute ? "h-10 lg:w-12" : "h-6 lg:w-8"}`}
                style={{ borderStyle: dashed ? "dashed" : "solid", borderColor: isRoute ? statusColor[causeStatus] : dashed ? haVar.textMuted : haVar.divider }}
              >
                {isRoute ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-0.5 lg:left-1/2 lg:top-0"
                      style={{ background: haVar.page }}
                    >
                      <StatusIcon status={causeStatus} className="size-5" />
                    </span>
                    <span className="sr-only">Route to Alarmio: {STATUS_LABEL[causeStatus]}</span>
                  </>
                ) : null}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

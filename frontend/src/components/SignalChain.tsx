import { StatusIcon } from "./StatusIcon";
import { STATUS_LABEL } from "@/lib/format";
import type { Link } from "@/lib/types";
import { haVar, statusColor } from "@/theme/tokens";

/** Ajax hub -> Alarmio -> foXaCe -> Home Assistant. A connector after a down node is dashed in the down colour. */
export function SignalChain({ links }: { links: Link[] }) {
  return (
    <ol role="list" aria-label="Alarm signal chain" className="chain-in flex flex-col sm:flex-row sm:items-stretch">
      {links.map((link, i) => {
        const broken = link.status === "down";
        const last = i === links.length - 1;
        return (
          <li key={link.id} className="flex flex-col sm:min-w-0 sm:flex-1 sm:flex-row" data-link={link.id}>
            <div
              className="rounded-lg border px-4 py-3 sm:flex-1"
              style={{ borderColor: haVar.divider, background: haVar.surface }}
            >
              <div className="flex items-center gap-2">
                <StatusIcon status={link.status} />
                <span className="font-display text-base font-semibold">{link.label}</span>
              </div>
              <p className="mt-1 text-sm" style={{ color: haVar.textMuted }}>{STATUS_LABEL[link.status]}</p>
              {link.latency_ms !== null ? <p className="font-mono text-sm">{Math.round(link.latency_ms)} ms</p> : null}
            </div>
            {last ? null : (
              <div
                aria-hidden="true"
                data-connector={broken ? "dashed" : "solid"}
                className="ml-6 h-6 w-0 border-l-2 sm:ml-0 sm:self-center sm:h-0 sm:w-6 sm:border-t-2 sm:border-l-0 lg:w-10"
                style={{ borderStyle: broken ? "dashed" : "solid", borderColor: broken ? statusColor.down : haVar.divider }}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

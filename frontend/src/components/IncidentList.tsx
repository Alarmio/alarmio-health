import { StatusIcon } from "./StatusIcon";
import { formatDuration, formatWhen, probeTitle } from "@/lib/format";
import type { Incident } from "@/lib/types";
import { haVar, statusColor } from "@/theme/tokens";

const MAX_SHOWN = 10;

export function IncidentList({ incidents, error = null }: { incidents: Incident[]; error?: string | null }) {
  const shown = incidents.slice(0, MAX_SHOWN);
  return (
    <section aria-labelledby="incidents-heading" className="flex flex-col gap-3">
      <h2 id="incidents-heading" className="font-display text-xl font-semibold">Incidents</h2>
      {error ? <p style={{ color: haVar.textMuted }}>{error}</p> : null}
      {incidents.length === 0 ? (
        error ? null : <p style={{ color: haVar.textMuted }}>No incidents in the last 90 days.</p>
      ) : (
        <>
          <ul role="list" className="flex flex-col divide-y" style={{ borderColor: haVar.divider }}>
            {shown.map((incident) => {
              const duration = incident.closed_at === null ? null : formatDuration(incident.opened_at, incident.closed_at);
              return (
                <li key={incident.id} className="flex flex-col gap-0.5 py-3 first:pt-0" style={{ borderColor: haVar.divider }}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className="font-medium">{probeTitle(incident.probe)}</span>
                    {incident.closed_at === null ? (
                      <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: statusColor.down }}>
                        <StatusIcon status="down" className="size-4" />
                        Ongoing
                      </span>
                    ) : (
                      <span className="font-mono text-sm">{duration ?? "Unknown length"}</span>
                    )}
                  </div>
                  <span className="font-mono text-xs" style={{ color: haVar.textMuted }}>{formatWhen(incident.opened_at)}</span>
                  {incident.detail ? <span className="text-sm">{incident.detail}</span> : null}
                </li>
              );
            })}
          </ul>
          {incidents.length > MAX_SHOWN ? (
            <p className="text-sm" style={{ color: haVar.textMuted }}>Showing the latest {MAX_SHOWN} of {incidents.length}.</p>
          ) : null}
        </>
      )}
    </section>
  );
}

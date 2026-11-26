import { truncatedText } from "./Controls";
import { StatusIcon } from "./StatusIcon";
import type { DeviceDiag, Diagnostics, Status } from "@/lib/types";
import { haVar } from "@/theme/tokens";

const LOW_BATTERY = 20;
const nullLast = (n: number | null): number => (n === null ? Number.POSITIVE_INFINITY : n);

/** Worst first: offline, then lowest battery, then lowest signal; unknown values sort after known ones. */
export function sortDevices(devices: DeviceDiag[]): DeviceDiag[] {
  return [...devices].sort(
    (a, b) =>
      Number(a.online) - Number(b.online) ||
      nullLast(a.battery) - nullLast(b.battery) ||
      nullLast(a.signal) - nullLast(b.signal) ||
      a.name.localeCompare(b.name),
  );
}

function deviceStatus(d: DeviceDiag): Status {
  if (!d.online) return "down";
  if (d.malfunctions > 0 || (d.battery !== null && d.battery <= LOW_BATTERY)) return "degraded";
  return "healthy";
}

export function DeviceList({ diagnostics, sharing }: { diagnostics: Diagnostics | null; sharing: boolean }) {
  const devices = sharing && diagnostics ? sortDevices(diagnostics.devices) : [];
  return (
    <section aria-labelledby="devices-heading" className="flex flex-col gap-3">
      <h2 id="devices-heading" className="font-display text-xl font-semibold">Devices</h2>
      {!sharing ? (
        <p style={{ color: haVar.textMuted }}>Turn on Share diagnostics to see device battery and signal here.</p>
      ) : devices.length === 0 ? (
        <p style={{ color: haVar.textMuted }}>No devices reported yet. They appear after the next check.</p>
      ) : (
        <ul role="list" className="flex flex-col divide-y" style={{ borderColor: haVar.divider }}>
          {devices.map((d, i) => {
            const status = deviceStatus(d);
            return (
              <li key={`${i}-${d.name}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2.5 first:pt-0" style={{ borderColor: haVar.divider }} data-device={d.name}>
                <span data-device-head className="flex min-w-0 basis-full items-center gap-2 sm:basis-0 sm:flex-1">
                  <StatusIcon status={status} label />
                  <span data-device-name className="min-w-0 font-medium">{d.name}</span>
                </span>
                {!d.online ? <span className="text-sm">Offline</span> : null}
                {d.malfunctions > 0 ? <span className="text-sm">{d.malfunctions === 1 ? "1 malfunction" : `${d.malfunctions} malfunctions`}</span> : null}
                <span className="font-mono text-sm" style={{ color: haVar.textMuted }}>
                  Battery <span style={{ color: haVar.text }}>{d.battery === null ? "–" : `${d.battery}%`}</span>
                </span>
                <span className="font-mono text-sm" style={{ color: haVar.textMuted }}>
                  Signal <span style={{ color: haVar.text }}>{d.signal === null ? "–" : d.signal}</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {sharing && devices.length > 0 && (diagnostics?.devices_truncated ?? 0) > 0 ? (
        <p className="text-sm" style={{ color: haVar.textMuted }}>{truncatedText(devices.length, diagnostics?.devices_truncated ?? 0)}</p>
      ) : null}
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { StatusIcon } from "./StatusIcon";
import { Button } from "@/components/ui/button";
import { STATUS_LABEL } from "@/lib/format";
import type { Diagnostics, E2EResult } from "@/lib/types";
import { haVar, statusColor } from "@/theme/tokens";

export const truncatedText = (shown: number, more: number): string =>
  `Showing the ${shown} devices with the most urgent problems; ${more} more are not shown.`;

export const SETTINGS_PATH = "/config/integrations/integration/alarmio_health";

type TestState =
  | { phase: "idle" }
  | { phase: "running" }
  | { phase: "done"; result: E2EResult }
  | { phase: "failed"; message: string };

interface Props {
  sharing: boolean;
  preview: Diagnostics | null;
  queued: number;
  onRunE2E(): Promise<E2EResult>;
}

export function Controls({ sharing, preview, queued, onRunE2E }: Props) {
  const [state, setState] = useState<TestState>({ phase: "idle" });
  const mounted = useRef(true);
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (state.phase === "done" || state.phase === "failed") resultRef.current?.focus();
  }, [state]);

  const run = async (): Promise<void> => {
    setState({ phase: "running" });
    try {
      const result = await onRunE2E();
      if (mounted.current) setState({ phase: "done", result });
    } catch (err) {
      if (mounted.current) setState({ phase: "failed", message: (err instanceof Error ? err.message : "Unknown error").replace(/[.\s]+$/, "") });
    }
  };
  const running = state.phase === "running";
  const shown = preview ? preview.devices.length : 0;
  const truncated = preview?.devices_truncated ?? 0;
  const deviceNames = sharing && preview ? preview.devices.map((d) => d.name) : [];

  return (
    <section aria-labelledby="controls-heading" className="flex flex-col gap-4">
      <h2 id="controls-heading" className="font-display text-xl font-semibold">Controls</h2>

      <div className="flex flex-col items-start gap-3">
        <Button type="button" onClick={() => void run()} disabled={running}>
          {running ? "Testing..." : "Run end-to-end test"}
        </Button>
        <p className="text-sm" style={{ color: haVar.textMuted }}>Asks foXaCe to fetch fresh state from Ajax through Alarmio now, and times it. It does not send an alarm event.</p>
        <div ref={resultRef} tabIndex={-1} className="outline-none" data-testid="e2e-result">
          {state.phase === "done" ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-2">
                <StatusIcon status={state.result.status} label />
                <span>
                  {state.result.detail || STATUS_LABEL[state.result.status]}
                  {state.result.latency_ms !== null ? <span className="ml-2 font-mono text-sm">{Math.round(state.result.latency_ms)} ms</span> : null}
                </span>
              </div>
              {state.result.cached ? <p className="text-sm" style={{ color: haVar.textMuted }}>Showing a result from the last 30 seconds.</p> : null}
            </div>
          ) : null}
          {state.phase === "failed" ? (
            <div className="flex items-start gap-2">
              <StatusIcon status="unknown" label />
              <span>The test could not run: {state.message}. Check that Home Assistant is connected, then try again.</span>
            </div>
          ) : null}
        </div>
      </div>

      {queued > 0 ? (
        <p className="flex items-start gap-2 border-l-4 py-1 pl-3" style={{ borderColor: statusColor.degraded }} data-testid="queued-notice">
          <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0" style={{ color: statusColor.degraded }} />
          <span>Not reporting to Alarmio. {queued} updates waiting.</span>
        </p>
      ) : null}

      <p className="text-sm">
        Sharing diagnostics is <strong>{sharing ? "on" : "off"}</strong>.{" "}
        <a href={SETTINGS_PATH} className="underline underline-offset-2 focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none rounded-sm" style={{ color: haVar.text }}>
          Change this in Settings &gt; Devices &amp; services &gt; Alarmio Health.
        </a>
      </p>

      <details className="rounded-lg border px-4 py-3" style={{ borderColor: haVar.divider }}>
        <summary className="cursor-pointer rounded-sm font-medium focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none">What is sent to Alarmio</summary>
        <div className="mt-3 flex flex-col gap-3 text-sm">
          <p>Always sent:</p>
          <ul className="list-disc pl-5" role="list">
            <li>the schema version and the time of the report</li>
            <li>the integration version</li>
            <li>for each check: its name, status, latency and a short failure reason</li>
            <li>failure reasons can include the foXaCe version and device counts, such as "2 offline, 1 low battery"</li>
          </ul>
          <p>Alarmio identifies you from your session token. The report itself carries no account identifier.</p>
          {sharing ? (
            <>
              <p>Also sent because sharing is on:</p>
              <ul className="list-disc pl-5" role="list">
                <li>the reconnect count</li>
                <li>the Home Assistant version and the foXaCe version</li>
                <li>whether proxy mode is used</li>
                <li>whether the alarm is armed. This reveals when the home is likely occupied.</li>
                <li>device names, online state, malfunction count, battery and signal</li>
              </ul>
              {truncated > 0 ? <p>{truncatedText(shown, truncated)}</p> : null}
              <p>This is exactly what the next report contains:</p>
              {deviceNames.length > 0 ? <p>Device names included: {deviceNames.join(", ")}.</p> : null}
              <pre className="max-h-64 overflow-auto rounded-md border p-3 font-mono text-xs" style={{ borderColor: haVar.divider, background: haVar.surfaceMuted }} tabIndex={0} aria-label="Diagnostics that are sent">
                {preview ? JSON.stringify(preview, null, 2) : "Nothing to show yet."}
              </pre>
            </>
          ) : (
            <p>Nothing else is sent. Device names, battery, signal and whether the alarm is armed stay in Home Assistant.</p>
          )}
        </div>
      </details>
    </section>
  );
}

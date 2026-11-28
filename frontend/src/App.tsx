import { useEffect, useState } from "react";
import { Controls } from "./components/Controls";
import { DeviceList } from "./components/DeviceList";
import { IncidentList } from "./components/IncidentList";
import { LatencyChart } from "./components/LatencyChart";
import { EchoTrace } from "./components/EchoTrace";
import { LegacyChain } from "./components/LegacyChain";
import { SignalChain } from "./components/SignalChain";
import { UptimeStrips } from "./components/UptimeStrips";
import { Verdict } from "./components/Verdict";
import { VersionLine } from "./components/VersionLine";
import { AppHeader } from "./components/AppHeader";
import { Button } from "./components/ui/button";
import type { Api } from "./lib/api";
import type { History, Incident, Range, Summary } from "./lib/types";
import { summaryVerdict } from "./lib/verdict";
import { haVar } from "./theme/tokens";

export const REFRESH_MS = 30_000;
const EMPTY_HISTORY: History = { status: {}, latency: [] };

export const CALL_TIMEOUT_MS = 30_000;

/** Rejects with a readable error if the call has not settled in time; the timer is always cleared. */
function withTimeout<T>(promise: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(new Error("The request timed out.")), CALL_TIMEOUT_MS);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

const messageOf = (reason: unknown): string => (reason instanceof Error && reason.message ? reason.message : "Could not load health data.");

const NO_MENU = (): void => {};

interface AppProps {
  api: Api;
  narrow?: boolean;
  registerMenu?: (node: HTMLElement | null) => void;
}

export function App({ api, narrow = false, registerMenu = NO_MENU }: AppProps) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [history, setHistory] = useState<History>(EMPTY_HISTORY);
  const [historyRange, setHistoryRange] = useState<Range>("24h");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [range, setRange] = useState<Range>("24h");
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [incidentsError, setIncidentsError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true; // false after unmount or after the range changed: late responses are dropped
    let running = false; // never overlap two loads
    const load = async (): Promise<void> => {
      if (running) return;
      running = true;
      try {
        // Each call applies its own result as soon as it arrives, so one slow or failing call never blocks the others.
        const guard = <T,>(promise: Promise<T>, ok: (value: T) => void, fail: (message: string) => void): Promise<void> =>
          promise.then(
            (value) => { if (active) ok(value); },
            (reason: unknown) => { if (active) fail(messageOf(reason)); },
          );
        await Promise.allSettled([
          guard(withTimeout(api.summary()), (value) => { setSummary(value); setSummaryError(null); }, setSummaryError),
          guard(withTimeout(api.history(range)), (value) => {
            setHistory(value);
            setHistoryRange(range);
            setHistoryLoaded(true);
            setHistoryError(null);
          }, setHistoryError),
          guard(withTimeout(api.incidents()), (value) => { setIncidents(value); setIncidentsError(null); }, setIncidentsError),
        ]);
      } finally {
        running = false;
      }
    };
    void load();
    const timer = setInterval(() => void load(), REFRESH_MS);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [api, range, retryKey]);

  // A failed refresh keeps the earlier history on screen; the notice replaces it only when there is none.
  const historyNotice = historyError && !historyLoaded;
  const unavailable = history.warning === "history_unavailable";
  const v = summary ? summaryVerdict(summary, new Date()) : null;
  const historyStale = historyError && historyLoaded ? "History may be out of date." : null;
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-4 md:p-8" aria-busy={!summary && !summaryError}>
      <AppHeader narrow={narrow} registerMenu={registerMenu} />
      {summary && summaryError ? (
        <p className="rounded-md border px-3 py-2 text-sm" style={{ borderColor: haVar.divider, color: haVar.textMuted }}>
          Last update failed. Showing earlier data.
        </p>
      ) : null}
      {/* One live region for loading, error and loaded; it keeps its position so it is never remounted. */}
      <Verdict verdict={v}>
        {summaryError ? (
          <div className="flex flex-col items-start gap-3">
            <h1 className="font-display text-2xl font-semibold">Could not load health data</h1>
            <p>
              {summaryError} Reload the page, or check that the Alarmio Health integration is loaded in Settings &gt; Devices &amp; services.
              This page keeps retrying every 30 seconds.
            </p>
            <Button type="button" variant="outline" onClick={() => setRetryKey((k) => k + 1)}>Try again</Button>
          </div>
        ) : (
          <p style={{ color: haVar.textMuted }}>Loading health data...</p>
        )}
      </Verdict>
      {summary ? (
        <>
          {summary.chain.length > 0 ? (
            <>
              <SignalChain chain={summary.chain} blamed={summary.trace.blamed} causeStatus={summary.cause_status} />
              <EchoTrace trace={summary.trace} proxyMode={summary.chain.some((n) => n.id === "alarmio")} causeStatus={summary.cause_status} />
            </>
          ) : (
            <LegacyChain links={summary.links} />
          )}
          <UptimeStrips
            history={history}
            range={range}
            dataRange={historyRange}
            onRangeChange={setRange}
            unavailable={unavailable}
            error={historyNotice && !unavailable ? "Uptime history could not be loaded. It will retry on the next refresh." : null}
            notice={historyStale}
          />
          <div className="grid gap-8 md:grid-cols-[3fr_2fr]">
            <LatencyChart
              points={history.latency}
              range={historyRange}
              unavailable={unavailable}
              error={historyNotice && !unavailable ? "Latency history could not be loaded. It will retry on the next refresh." : null}
              notice={historyStale}
            />
            <IncidentList incidents={incidents} error={incidentsError ? "Incidents could not be loaded. They will retry on the next refresh." : null} />
          </div>
          <DeviceList diagnostics={summary.diagnostics_preview} sharing={summary.share_diagnostics} />
          <Controls sharing={summary.share_diagnostics} preview={summary.diagnostics_preview} queued={summary.queued_heartbeats} onRunE2E={api.runE2E} />
          <VersionLine version={summary.integration_version} foxaceVersion={summary.diagnostics_preview?.foxace_version ?? null} />
        </>
      ) : null}
    </main>
  );
}

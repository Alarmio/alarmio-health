import type { ReactNode } from "react";
import { StatusIcon } from "./StatusIcon";
import type { Verdict as VerdictData } from "@/lib/verdict";
import { haVar } from "@/theme/tokens";

/**
 * The single answer: will an alarm event reach me right now? The only live region on the page.
 * The region stays mounted from the first render so screen readers announce changes; without a verdict it shows `children`.
 */
export function Verdict({ verdict, children }: { verdict: VerdictData | null; children?: ReactNode }) {
  return (
    <div role="status" aria-live="polite" className="flex items-start gap-3">
      {verdict ? (
        <>
          <StatusIcon status={verdict.tone} className="mt-1 size-8 sm:size-10" label />
          <div className="min-w-0">
            <h1 className="font-display text-3xl leading-tight font-semibold text-balance sm:text-4xl">{verdict.headline}</h1>
            {verdict.hint ? <p className="mt-2 text-base" style={{ color: haVar.textMuted }}>{verdict.hint}</p> : null}
          </div>
        </>
      ) : (
        children
      )}
    </div>
  );
}

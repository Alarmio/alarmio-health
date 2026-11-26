import { AlertTriangle, CheckCircle2, HelpCircle, XOctagon, type LucideIcon } from "lucide-react";
import type { Status } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/format";
import { statusColor } from "@/theme/tokens";

const ICONS: Record<Status, LucideIcon> = { healthy: CheckCircle2, degraded: AlertTriangle, down: XOctagon, unknown: HelpCircle };

const ICON_NAMES: Record<Status, string> = { healthy: "circle-check", degraded: "triangle-alert", down: "octagon-x", unknown: "circle-question" };

/** Each status has its own shape, so colour is never the only signal. Decorative by default; pass `label` to announce it. */
export function StatusIcon({ status, className = "size-5", label = false }: { status: Status; className?: string; label?: boolean }) {
  const Icon = ICONS[status];
  return (
    <>
      <Icon aria-hidden="true" className={`shrink-0 ${className}`} style={{ color: statusColor[status] }} data-status={status} data-status-icon={ICON_NAMES[status]} />
      {label ? <span className="sr-only">{STATUS_LABEL[status]}: </span> : null}
    </>
  );
}

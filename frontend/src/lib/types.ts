export type Status = "healthy" | "degraded" | "down" | "unknown";
export type LinkId = "ajax" | "alarmio" | "foxace" | "ha";

export interface Link { id: LinkId; label: string; status: Status; latency_ms: number | null; detail: string }
export interface ProbeInfo { status: Status; latency_ms: number | null; detail: string; checked_at: string }
export interface DeviceDiag { name: string; online: boolean; malfunctions: number; battery: number | null; signal: number | null }
export interface Diagnostics { reconnects: number; ha_version: string; foxace_version: string | null; proxy_mode: boolean; armed: boolean | null; devices: DeviceDiag[]; devices_truncated?: number }
export interface Summary {
  links: Link[]; probes: Record<string, ProbeInfo>; down_since: string | null;
  share_diagnostics: boolean; queued_heartbeats: number; diagnostics_preview: Diagnostics | null;
}
export interface Incident { id: string; probe: string; opened_at: string; closed_at: string | null; detail: string }
export interface History { status: Record<string, { t: string; s: Status }[]>; latency: { t: string; ms: number }[]; warning?: string }
export interface E2EResult { status: Status; latency_ms: number | null; detail: string; cached?: boolean }
export type Range = "24h" | "7d" | "30d";

import { haVar } from "@/theme/tokens";

export function VersionLine({ version, foxaceVersion }: { version: string; foxaceVersion: string | null }) {
  if (!version) return null;
  return (
    <p className="font-mono text-xs" style={{ color: haVar.textMuted }}>
      {`Alarmio Health ${version}${foxaceVersion === null ? "" : ` / foXaCe ${foxaceVersion}`}`}
    </p>
  );
}

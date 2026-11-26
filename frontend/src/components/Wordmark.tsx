import { brand, fontFamily, haVar } from "@/theme/tokens";

/**
 * Text wordmark (June 2026 brand sheet): "Alarm" in the foreground colour, "io" in teal.
 * Teal Dark is used on every surface: it is text-safe on white and still above 4.5:1 on dark HA cards.
 * This is the single place a logo image can replace later.
 */
export function Wordmark() {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-semibold" style={{ fontFamily: fontFamily.display, letterSpacing: "-1px", color: haVar.text }}>
        Alarm<span style={{ color: brand.tealDark }}>io</span>
      </span>
      <span className="text-sm" style={{ color: haVar.textMuted }}>Health</span>
    </div>
  );
}

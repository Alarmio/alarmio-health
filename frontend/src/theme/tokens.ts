/** Single source of truth for colour and type. Components must not hard-code either. */
export const statusColor = {
  healthy: "#1F8A7A",
  degraded: "#C98A1B",
  down: "#C23B5A",
  unknown: "#8A94A6",
} as const;

/** Home Assistant theme variables, so the panel follows each user's light or dark theme. */
export const haVar = {
  surface: "var(--card-background-color, #ffffff)",
  surfaceMuted: "var(--secondary-background-color, #f2f4f7)",
  page: "var(--primary-background-color, #fafafa)",
  text: "var(--primary-text-color, #1b1f24)",
  textMuted: "var(--secondary-text-color, #5b6472)",
  divider: "var(--divider-color, #e0e3e8)",
} as const;

/** Alarmio brand colours (docs/brand/palette.css). Accent, focus and selection only; never alarm-state colours. */
export const brand = {
  navy: "#0F172A", // text on the teal primary button fill (--primary-foreground in index.css)
  teal: "#06B6D4", // accent on light surfaces (borders, indicators) and the primary button fill (--primary); not for body text
  tealLight: "#22D3EE", // accent on dark surfaces
  tealDark: "#0891B2", // hover/pressed, and the only teal allowed as text on light surfaces
} as const;

/** Neutral series colour for charts, so a line never reads as a health state. Also the focus ring (--ring in index.css, about 3.7:1 on white). */
export const chartSeries = brand.tealDark;

/** Brand type (docs/brand/brand-guidelines.md): display and wordmark, body, technical values. */
export const fontFamily = {
  display: '"Space Grotesk", system-ui, sans-serif',
  body: '"Inter", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const;
export type StatusKey = keyof typeof statusColor;

import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (f: string) => readFileSync(path.resolve(__dirname, f), "utf8");

describe("document-scope fonts.css", () => {
  it("holds exactly 3 @font-face blocks and nothing else", () => {
    const css = read("fonts.css");
    const blocks = css.match(/@font-face\s*\{[^}]*\}/g) ?? [];
    expect(blocks.length).toBe(3);
    const rest = blocks.reduce((acc, b) => acc.replace(b, ""), css).replace(/\/\*[\s\S]*?\*\//g, "");
    expect(rest.trim()).toBe("");
  });
});

describe("shadow-scope index.css", () => {
  it("keeps the prefers-reduced-motion rule", () => {
    expect(read("index.css")).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  });
  it("fills primary buttons with brand teal and navy text (about 7:1), not white on Teal Dark (3.7:1)", () => {
    const css = read("index.css");
    expect(css).toMatch(/--primary:\s*#06b6d4\s*;/i);
    expect(css).toMatch(/--primary-foreground:\s*#0f172a\s*;/i);
  });
  it("keeps the focus ring on Teal Dark", () => {
    expect(read("index.css")).toMatch(/--ring:\s*#0891b2/i);
  });
});

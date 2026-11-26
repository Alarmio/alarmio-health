import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import postcss from "postcss";
import shadowDom from "../postcss-shadow-dom";

const root = path.resolve(__dirname, "..");
const panel = path.resolve(root, "../custom_components/alarmio_health/www/panel.js");
const built = existsSync(panel);
// `npm run test:ci` sets REQUIRE_BUNDLE=1: a missing bundle is then a failure, not a skip.
if (process.env.REQUIRE_BUNDLE === "1" && !built) {
  throw new Error(`REQUIRE_BUNDLE=1 but ${panel} is missing; run the build first`);
}

/** XML/SVG namespace strings are identifiers, not fetched. */
const ALLOWED = [/^http:\/\/www\.w3\.org\//, /^https:\/\/react\.dev\/errors/, /^https?:\/\/github\.com\/(facebook|reduxjs|recharts)/];
const URL_RE = /https?:\/\/[^\s"'`)\\<>]+/g;

function externalUrls(text: string): string[] {
  return (text.match(URL_RE) ?? []).filter((u) => !ALLOWED.some((re) => re.test(u)));
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

describe("self-hosting (no CDN or external URLs at runtime)", () => {
  it("source and index.html contain no external URLs", () => {
    const files = [path.join(root, "index.html"), ...walk(path.join(root, "src")).filter((f) => /\.(tsx?|css)$/.test(f) && !f.includes(".test."))];
    const found = files.flatMap((f) => externalUrls(readFileSync(f, "utf8")).map((u) => `${path.relative(root, f)}: ${u}`));
    expect(found).toEqual([]);
  });

  it.skipIf(!built)("built panel.js loads no font, script or stylesheet from another origin", () => {
    const text = readFileSync(panel, "utf8");
    expect(text).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);
    expect(text).not.toMatch(/\burl\(\s*["']?https?:/);
    expect(text).not.toMatch(/@import\s+(url\()?["']?https?:/);
    const suspicious = externalUrls(text).filter((u) => /\.(woff2?|ttf|otf|css|js|mjs)(\?|$)/.test(u));
    expect(suspicious).toEqual([]);
  });
});

describe("no dev code in production", () => {
  it.skipIf(!built)("built panel.js contains no mock harness code", () => {
    const text = readFileSync(panel, "utf8");
    expect(text).not.toContain("createMockApi");
    expect(text).not.toContain("The mock API is set to fail");
  });
  it("the library entry does not import the mock or dev harness", () => {
    const entry = readFileSync(path.join(root, "src/element.tsx"), "utf8");
    expect(entry).not.toMatch(/mock|dev\.css|main\.tsx/);
  });
});

describe("shadow DOM CSS", () => {
  it.skipIf(!built)("built bundle has no bare :root selector or @property rule", () => {
    const text = readFileSync(panel, "utf8");
    expect(text).not.toMatch(/:root/);
    expect(text).not.toMatch(/@property/);
  });

  it.skipIf(!built)("built bundle keeps the theme variables on :host", () => {
    expect(readFileSync(panel, "utf8")).toMatch(/:host\s*\{/);
  });

  it.skipIf(!built)("registers @font-face once, in the document fonts CSS only, never the shadow CSS", () => {
    const text = readFileSync(panel, "utf8");
    expect(text.split("alarmio-health-fonts").length - 1).toBe(1);
    const fontsCss = readFileSync(path.join(root, "src/fonts.css"), "utf8");
    const families = ["Space Grotesk", "Inter", "JetBrains Mono"];
    for (const f of families) expect(fontsCss).toContain(`font-family: "${f}"`);
    // Every string literal that holds @font-face must be the fonts CSS (3 rules); none may hold the theme.
    const literals = text.match(/`[^`]*`|"(?:[^"\\\n]|\\.)*"/g) ?? [];
    const withFace = literals.filter((l) => l.includes("@font-face"));
    expect(withFace.length).toBe(1);
    expect((withFace[0]?.match(/@font-face/g) ?? []).length).toBe(3);
    expect(withFace[0]).not.toContain(":host");
    // Document scope must not leak global rules into Home Assistant.
    expect(withFace[0]).not.toContain("prefers-reduced-motion");
    expect(withFace[0]).not.toMatch(/\*\s*\{/);
    // The reduced-motion rule lives in the shadow CSS string (the one holding the theme).
    const shadow = literals.filter((l) => l.includes(":host") && l.includes("prefers-reduced-motion"));
    expect(shadow.length).toBeGreaterThan(0);
  });

  it("postcss plugin turns @property defaults into declarations and strips :root", async () => {
    const input = `@property --tw-x { syntax: "*"; inherits: false; initial-value: 0; }
      @layer properties { @supports (a: b) { *, ::before { --tw-x: 0; } } }
      :root, :host { --a: 1; }
      :root { --b: 2; }`;
    const out = (await postcss([shadowDom()]).process(input, { from: undefined })).css;
    expect(out).not.toContain(":root");
    expect(out).not.toContain("@property");
    expect(out).toContain("--tw-x: 0");
    expect(out).toContain(":host");
    expect(out).not.toContain("@supports");
  });
});

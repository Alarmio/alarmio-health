// Guards the keyboard focus rings. jsdom cannot compute :focus-visible styles, so this runs in real Chromium
// against the dev harness (the App mounted in a shadow root, like the shipped panel).
import { expect, test, type Page } from "@playwright/test";

const TEAL = "rgb(8, 145, 178)";
const SURFACE = { light: "rgb(255, 255, 255)", dark: "rgb(28, 28, 28)" } as const;

interface Target {
  name: string;
  label: RegExp;
}
const TARGETS: Target[] = [
  { name: "filled button", label: /^Run end-to-end test$/ },
  { name: "tab trigger", label: /^(24h|7d|30d)$/ },
  { name: "settings link", label: /^Change this in Settings/ },
  { name: "details summary", label: /^What is sent to Alarmio$/ },
];

/** Tab until the element with this label has keyboard focus, then return its computed style (inside the shadow root). */
async function focusByKeyboard(page: Page, label: RegExp): Promise<void> {
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press("Tab");
    const text = await page.evaluate(
      () => document.getElementById("root")?.shadowRoot?.activeElement?.textContent?.trim() ?? "",
    );
    if (label.test(text)) return;
  }
  throw new Error(`Tab never reached ${String(label)}`);
}

function readStyle(page: Page): Promise<{ boxShadow: string; outlineStyle: string; outlineColor: string }> {
  return page.evaluate(() => {
    const el = document.getElementById("root")?.shadowRoot?.activeElement;
    if (!el) throw new Error("nothing focused");
    const cs = getComputedStyle(el);
    return { boxShadow: cs.boxShadow, outlineStyle: cs.outlineStyle, outlineColor: cs.outlineColor };
  });
}

for (const theme of ["light", "dark"] as const) {
  test.describe(`focus rings (${theme})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/?mock=healthy&theme=${theme}`);
      await page.waitForSelector("h1");
    });

    for (const target of TARGETS) {
      test(`${target.name} shows a teal ring`, async ({ page }) => {
        await focusByKeyboard(page, target.label);
        // transition-all animates box-shadow in; sample only once it has settled.
        if (target.name === "filled button") {
          await expect
            .poll(async () => (await readStyle(page)).boxShadow)
            .toContain(`${SURFACE[theme]} 0px 0px 0px 2px, ${TEAL} 0px 0px 0px 4px`);
        } else {
          await expect
            .poll(async () => {
              const s = await readStyle(page);
              return s.boxShadow.includes("oklab(") || s.boxShadow.includes(TEAL) || (s.outlineStyle !== "none" && s.outlineColor === TEAL);
            })
            .toBe(true);
        }
      });
    }

    test("an unfocused button has no ring", async ({ page }) => {
      const shadow = await page.evaluate(() => {
        const btn = [...(document.getElementById("root")?.shadowRoot?.querySelectorAll("button") ?? [])].find((b) =>
          /^Run end-to-end test$/.test(b.textContent?.trim() ?? ""),
        );
        return btn ? getComputedStyle(btn).boxShadow : "missing";
      });
      expect(shadow).not.toContain(TEAL);
      expect(shadow).not.toBe("missing");
    });
  });
}

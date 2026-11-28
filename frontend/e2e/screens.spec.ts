// Formal screen checks for the panel: every scenario x theme x size, plus the main behaviours.
// Runs in real Chromium against the dev harness (the App in a shadow root). Playwright CSS locators pierce open shadow roots.
import { expect, test, type Page } from "@playwright/test";

const SCENARIOS = [
  { mock: "healthy", headline: "Alarm events are reaching Home Assistant", chain: 6, trace: true },
  { mock: "degraded", headline: "Alarmio is slow to answer", chain: 6, trace: true },
  { mock: "down", headline: "Alarmio cannot be reached from here", chain: 6, trace: true },
  { mock: "route", headline: "The route to Alarmio is unreliable", chain: 6, trace: true },
  { mock: "gateway", headline: "Your router is not answering", chain: 6, trace: true },
  { mock: "direct", headline: "Alarm events are reaching Home Assistant", chain: 5, trace: true },
  { mock: "empty", headline: "Not enough data yet to tell", chain: 4, trace: false },
] as const;
const THEMES = ["light", "dark"] as const;
const SIZES = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const;

/** Collects console errors and uncaught page errors; call `.list` at the end of a test. */
function watchErrors(page: Page): { list: string[] } {
  const list: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") list.push(`console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => list.push(`pageerror: ${err.message}`));
  return { list };
}

for (const s of SCENARIOS) {
  for (const theme of THEMES) {
    for (const size of SIZES) {
      test(`${s.mock} ${theme} ${size.name}`, async ({ page }) => {
        const errors = watchErrors(page);
        await page.setViewportSize({ width: size.width, height: size.height });
        await page.goto(`/?mock=${s.mock}&theme=${theme}`);
        const h1 = page.locator("h1");
        await expect(h1).toHaveCount(1);
        await expect(h1).toContainText(s.headline);
        const chain = page.getByRole("list", { name: "Alarm signal chain" });
        await expect(chain).toBeVisible();
        await expect(chain.locator("> li")).toHaveCount(s.chain);
        const trace = page.getByRole("list", { name: "Where the last check spent its time" });
        if (s.trace) {
          await expect(page.getByRole("heading", { name: "Last check" })).toBeVisible();
          await expect(trace).toBeVisible();
        } else {
          await expect(trace).toHaveCount(0);
        }
        if (s.mock === "route") {
          await expect(page.locator('[data-blamed="true"]')).toHaveCount(1);
          await expect(page.locator('[data-segment="route"][data-blamed="true"]')).toHaveCount(1);
          await expect(chain.locator('[data-route="blamed"]')).toHaveCount(1);
        }
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
        await page.screenshot({ path: `test-results/${s.mock}-${theme}-${size.name}.png`, fullPage: true, animations: "disabled" });
        expect(errors.list).toEqual([]);
      });
    }
  }
}

test("down: the end-to-end test shows its result inline", async ({ page }) => {
  await page.goto("/?mock=down");
  await page.getByRole("button", { name: "Run end-to-end test" }).click();
  await expect(page.getByTestId("e2e-result")).toContainText("foXaCe could not refresh through Alarmio");
});

test("range tabs switch and the chart ticks change", async ({ page }) => {
  await page.goto("/?mock=healthy");
  const ticks = page.locator(".recharts-xAxis-tick-labels text");
  await expect(ticks.first()).toBeVisible();
  const day = (await ticks.allTextContents()).join("|");
  await page.getByRole("tab", { name: "7d" }).click();
  await expect(page.getByRole("tab", { name: "7d" })).toHaveAttribute("aria-selected", "true");
  await expect.poll(async () => (await ticks.allTextContents()).join("|")).not.toBe(day);
  const week = (await ticks.allTextContents()).join("|");
  await page.getByRole("tab", { name: "30d" }).click();
  await expect(page.getByRole("tab", { name: "30d" })).toHaveAttribute("aria-selected", "true");
  await expect.poll(async () => (await ticks.allTextContents()).join("|")).not.toBe(week);
});

test("error scenario shows the error state with guidance and a single h1", async ({ page }) => {
  await page.goto("/?mock=error");
  const h1 = page.locator("h1");
  await expect(h1).toHaveCount(1);
  await expect(h1).toHaveText("Could not load health data");
  await expect(page.getByText(/Reload the page/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  await expect(page.getByRole("list", { name: "Alarm signal chain" })).toHaveCount(0);
});

test("slow scenario shows loading, then data", async ({ page }) => {
  await page.goto("/?mock=slow");
  await expect(page.getByText("Loading health data...")).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(0);
  await expect(page.locator("h1")).toContainText("Alarm events are reaching Home Assistant", { timeout: 10_000 });
  await expect(page.getByText("Loading health data...")).toHaveCount(0);
});

test("keyboard: Tab reaches the range tabs, then the test button, in order", async ({ page }) => {
  await page.goto("/?mock=healthy");
  await page.waitForSelector("h1");
  const seen: string[] = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    const text = await page.evaluate(() => document.getElementById("root")?.shadowRoot?.activeElement?.textContent?.trim() ?? "");
    if (text) seen.push(text);
    if (text === "Run end-to-end test") break;
  }
  const tab = seen.findIndex((t) => /^(24h|7d|30d)$/.test(t));
  const button = seen.indexOf("Run end-to-end test");
  expect(tab).toBeGreaterThanOrEqual(0);
  expect(button).toBeGreaterThan(tab);
});

test("reduced motion: the signal chain does not animate", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?mock=healthy");
  const chain = page.getByRole("list", { name: "Alarm signal chain" });
  await expect(chain).toBeVisible();
  const style = await chain.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { name: cs.animationName, duration: cs.animationDuration };
  });
  expect(style.name === "none" || style.duration === "0s").toBe(true);
});

test("narrow: the menu button header is present and there is still one h1", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?mock=healthy&narrow=1");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("ha-menu-button")).toHaveCount(1);
  await page.screenshot({ path: "test-results/narrow-healthy-light-mobile.png", fullPage: true, animations: "disabled" });
});

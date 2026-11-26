// @vitest-environment jsdom
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { HassApi, HassLike } from "./lib/api";

const renders: HassApi[] = [];

vi.mock("./App", async () => {
  const { AppHeader } = await import("./components/AppHeader");
  return {
    App: ({ api, narrow, registerMenu }: { api: HassApi; narrow?: boolean; registerMenu?: (n: HTMLElement | null) => void }) => {
      renders.push(api);
      return (
        <>
          <AppHeader narrow={narrow === true} registerMenu={registerMenu ?? (() => {})} />
          <p data-testid="app">panel</p>
        </>
      );
    },
  };
});
vi.mock("./index.css?inline", () => ({ default: "/* shadow css */" }));
vi.mock("./fonts.css?inline", () => ({
  default: '/* fonts css */ @font-face{font-family:"Space Grotesk"} @font-face{font-family:"Inter"} @font-face{font-family:"JetBrains Mono"}',
}));

const created: { render: ReturnType<typeof vi.fn>; unmount: ReturnType<typeof vi.fn> }[] = [];
vi.mock("react-dom/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-dom/client")>();
  return {
    ...actual,
    createRoot: vi.fn((...args: Parameters<typeof actual.createRoot>) => {
      const root = actual.createRoot(...args);
      const spy = { render: vi.fn(root.render.bind(root)), unmount: vi.fn(root.unmount.bind(root)) };
      created.push(spy);
      return { render: spy.render, unmount: spy.unmount };
    }),
  };
});

type PanelElement = HTMLElement & {
  hass: HassLike | null;
  narrow: boolean;
  panel: unknown;
  route: unknown;
};

const hassOf = (tag: string): HassLike => ({
  callWS: <T,>() => Promise.resolve(tag as unknown as T),
});
const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 20));
const make = (): PanelElement => document.createElement("alarmio-health-panel") as PanelElement;

beforeAll(async () => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = false;
  await import("./element");
});

describe("alarmio-health-panel element", () => {
  it("is registered", () => {
    expect(customElements.get("alarmio-health-panel")).toBeDefined();
  });

  it("renders when hass was set before it was connected", async () => {
    const el = make();
    el.hass = hassOf("a");
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot?.querySelector("[data-testid=app]")?.textContent).toBe("panel");
    el.remove();
  });

  it("renders when connected before hass arrives", async () => {
    const el = make();
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot?.querySelector("[data-testid=app]")).not.toBeNull();
    el.remove();
  });

  it("does not re-render the app when hass is replaced", async () => {
    const el = make();
    document.body.appendChild(el);
    await tick();
    const before = renders.length;
    for (let i = 0; i < 50; i++) el.hass = hassOf(`h${i}`);
    await tick();
    expect(renders.length).toBe(before);
    el.remove();
  });

  it("keeps one stable api object that reads the latest hass", async () => {
    const el = make();
    document.body.appendChild(el);
    await tick();
    const api = renders[renders.length - 1];
    el.hass = hassOf("first");
    el.hass = hassOf("latest");
    await expect(api?.call("summary")).resolves.toBe("latest");
    el.remove();
  });

  it("renders again after being disconnected and reconnected", async () => {
    const el = make();
    el.hass = hassOf("a");
    document.body.appendChild(el);
    await tick();
    el.remove();
    await tick();
    const before = renders.length;
    document.body.appendChild(el);
    await tick();
    expect(renders.length).toBeGreaterThan(before);
    expect(el.shadowRoot?.querySelectorAll("style").length).toBe(1);
    expect(el.shadowRoot?.querySelector("[data-testid=app]")?.textContent).toBe("panel");
    el.remove();
  });

  it("creates a new root on reconnect and unmounts the first on disconnect", async () => {
    const el = make();
    document.body.appendChild(el);
    await tick();
    const first = created[created.length - 1];
    const count = created.length;
    el.remove();
    await tick();
    expect(first?.unmount).toHaveBeenCalledTimes(1);
    document.body.appendChild(el);
    await tick();
    expect(created.length).toBe(count + 1);
    el.remove();
  });

  describe("brand fonts", () => {
    const fontStyles = (): NodeListOf<Element> => document.head.querySelectorAll("style#alarmio-health-fonts");

    it("registers one font style in document.head with all three families", async () => {
      const el = make();
      document.body.appendChild(el);
      await tick();
      expect(fontStyles().length).toBe(1);
      const text = fontStyles()[0]?.textContent ?? "";
      for (const f of ["Space Grotesk", "Inter", "JetBrains Mono"]) expect(text).toContain(f);
      el.remove();
    });

    it("still has exactly one after disconnect and reconnect", async () => {
      const el = make();
      document.body.appendChild(el);
      await tick();
      el.remove();
      await tick();
      expect(fontStyles().length).toBe(1);
      document.body.appendChild(el);
      await tick();
      expect(fontStyles().length).toBe(1);
      el.remove();
    });

    it("has exactly one with two instances connected", async () => {
      const a = make();
      const b = make();
      document.body.append(a, b);
      await tick();
      expect(fontStyles().length).toBe(1);
      a.remove();
      b.remove();
    });

    it("keeps @font-face out of the shadow root", async () => {
      const el = make();
      document.body.appendChild(el);
      await tick();
      const css = el.shadowRoot?.querySelector("style")?.textContent ?? "";
      expect(css).toBe("/* shadow css */");
      expect(css).not.toContain("@font-face");
      el.remove();
    });
  });

  describe("narrow", () => {
    type Menu = HTMLElement & { hass?: unknown; narrow?: unknown };
    const menus = (el: HTMLElement): NodeListOf<Menu> => el.shadowRoot?.querySelectorAll("ha-menu-button") as NodeListOf<Menu>;
    it("renders no menu button when narrow is false", async () => {
      const el = make();
      el.narrow = false;
      document.body.appendChild(el);
      await tick();
      expect(menus(el).length).toBe(0);
      el.remove();
    });
    it("renders exactly one with narrow and hass set when narrow was set before connect", async () => {
      const el = make();
      const h = hassOf("pre");
      el.hass = h;
      el.narrow = true;
      document.body.appendChild(el);
      await tick();
      expect(menus(el).length).toBe(1);
      expect(menus(el)[0]?.narrow).toBe(true);
      expect(menus(el)[0]?.hass).toBe(h);
      el.remove();
    });
    it("re-renders once when narrow changes after connect, and pushes hass without re-rendering", async () => {
      const el = make();
      document.body.appendChild(el);
      await tick();
      expect(menus(el).length).toBe(0);
      const before = renders.length;
      el.narrow = true;
      await tick();
      const delta = renders.length - before;
      expect(delta).toBeGreaterThanOrEqual(1);
      expect(delta).toBeLessThanOrEqual(2); // StrictMode double-invokes in dev
      el.narrow = true; // unchanged: no render
      await tick();
      expect(renders.length - before).toBe(delta);
      const afterNarrow = renders.length;
      let last = hassOf("x");
      for (let i = 0; i < 50; i++) { last = hassOf(`n${i}`); el.hass = last; }
      await tick();
      expect(renders.length).toBe(afterNarrow);
      expect(menus(el)[0]?.hass).toBe(last);
      el.narrow = false;
      await tick();
      expect(menus(el).length).toBe(0);
      el.remove();
    });
  });

  it("accepts narrow, panel and route without throwing", () => {
    const el = make();
    expect(() => {
      el.narrow = true;
      el.panel = { config: {} };
      el.route = { path: "/" };
    }).not.toThrow();
  });
});


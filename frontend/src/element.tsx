import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import css from "./index.css?inline";
import fontsCss from "./fonts.css?inline";
import { App } from "./App";
import { createHassApi, type HassApi, type HassLike } from "./lib/api";

const FONTS_STYLE_ID = "alarmio-health-fonts";

/** @font-face is ignored inside shadow trees, so the faces are registered once in document scope. */
function ensureDocumentFonts(): void {
  if (document.getElementById(FONTS_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = FONTS_STYLE_ID;
  style.textContent = fontsCss;
  document.head.appendChild(style);
}

class AlarmioHealthPanel extends HTMLElement {
  private root: Root | null = null;
  private _hass: HassLike | null = null;
  /** Created once; always talks to the latest hass, so hass updates never need a re-render. */
  private readonly api: HassApi = createHassApi(() => this._hass);

  private _narrow = false;
  private menuButton: (HTMLElement & { hass?: unknown; narrow?: unknown }) | null = null;

  /** Registered by the header; keeps the menu button's hass fresh without re-rendering React. */
  private readonly registerMenu = (node: HTMLElement | null): void => {
    this.menuButton = node;
    if (node) Object.assign(node, { hass: this._hass, narrow: true });
  };

  /** HA sets this many times a second. Store it only; the app reads it through `api`. */
  set hass(value: HassLike) {
    this._hass = value;
    if (this.menuButton) Object.assign(this.menuButton, { hass: value });
  }
  get hass(): HassLike | null {
    return this._hass;
  }

  /** Re-renders only when the value actually changes. */
  set narrow(value: boolean) {
    const next = value === true;
    if (next === this._narrow) return;
    this._narrow = next;
    this.renderApp();
  }
  get narrow(): boolean {
    return this._narrow;
  }

  // HA passes these to every panel. Accept and ignore them.
  set panel(_value: unknown) {}
  set route(_value: unknown) {}

  connectedCallback(): void {
    ensureDocumentFonts();
    const shadow = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    if (!shadow.querySelector("style")) {
      const style = document.createElement("style");
      style.textContent = css;
      shadow.appendChild(style);
    }
    let mount = shadow.querySelector("div");
    if (!mount) {
      mount = document.createElement("div");
      shadow.appendChild(mount);
    }
    // A new root on every (re)connect: disconnectedCallback unmounted the old one.
    this.root ??= createRoot(mount);
    this.renderApp();
  }

  private renderApp(): void {
    this.root?.render(
      <StrictMode>
        <App api={this.api} narrow={this._narrow} registerMenu={this.registerMenu} />
      </StrictMode>,
    );
  }

  disconnectedCallback(): void {
    this.root?.unmount();
    this.root = null;
    this.menuButton = null;
  }
}

if (!customElements.get("alarmio-health-panel")) {
  customElements.define("alarmio-health-panel", AlarmioHealthPanel);
}

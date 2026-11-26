// Dev harness entry. The production entry is element.tsx; nothing here ships in www/panel.js.
// ?mock=healthy|degraded|down|empty|error|slow|sparse  ?theme=light|dark  ?narrow=1 (shows the phone menu-button header)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import css from "./index.css?inline";
import "./dev.css";
import { App } from "./App";
import { createMockApi, SCENARIOS, type Scenario } from "./lib/mock";

const DARK_THEME = {
  "--card-background-color": "#1c1c1c",
  "--primary-text-color": "#e1e1e1",
  "--secondary-text-color": "#9b9b9b",
  "--divider-color": "#3a3a3a",
  "--secondary-background-color": "#2b2b2b",
  "--primary-background-color": "#111111",
} as const;

const params = new URLSearchParams(location.search);
const requested = params.get("mock");
const scenario: Scenario = SCENARIOS.find((s) => s === requested) ?? "healthy";

const host = document.getElementById("root");
if (!host) throw new Error("Missing #root in index.html");
host.className = "dev-page";
if (params.get("theme") === "dark") {
  for (const [name, value] of Object.entries(DARK_THEME)) host.style.setProperty(name, value);
  document.body.style.setProperty("--primary-background-color", DARK_THEME["--primary-background-color"]);
}
// Same structure as element.tsx: the app lives in a shadow root, so the production CSS (:host variables) applies unchanged.
const shadow = host.attachShadow({ mode: "open" });
const style = document.createElement("style");
style.textContent = css;
const mount = document.createElement("div");
shadow.append(style, mount);
createRoot(mount).render(
  <StrictMode>
    <App api={createMockApi(scenario)} narrow={params.get("narrow") === "1"} />
  </StrictMode>,
);

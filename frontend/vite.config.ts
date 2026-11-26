import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";
import shadowDom from "./postcss-shadow-dom.ts";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  css: { postcss: { plugins: [shadowDom()] } },
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  // e2e/ holds Playwright specs (npm run e2e); vitest must not collect them.
  test: { exclude: [...configDefaults.exclude, "e2e/**"] },
  build: {
    lib: { entry: "src/element.tsx", formats: ["es"], fileName: () => "panel.js" },
    outDir: "../custom_components/alarmio_health/www",
    emptyOutDir: true,
    cssCodeSplit: false,
  },
});

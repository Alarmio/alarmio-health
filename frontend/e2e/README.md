# e2e (Playwright)

Run the whole suite (focus + screens) from the repository root. On hosts without Chromium's system libraries
(the apt packages that provide them include `libnspr4`, `libnss3`, `libatk1.0-0`, `libatk-bridge2.0-0`,
`libcups2`, `libxkbcommon0`, `libgbm1` and `libasound2`), either install them or set `LD_LIBRARY_PATH` to an
extracted copy, for example `<scratchpad>/libs/usr/lib/x86_64-linux-gnu` (no system install needed):

    LD_LIBRARY_PATH=<scratchpad>/libs/usr/lib/x86_64-linux-gnu npm --prefix frontend run e2e

`focus.spec.ts` checks real computed focus-ring styles in Chromium (jsdom cannot evaluate `:focus-visible`).

`screens.spec.ts` loads every mock scenario (healthy, degraded, down, empty) in light and dark at 1280x900 and
390x844 and asserts one `h1`, four chain items, no horizontal overflow and no console or page errors, saving
screenshots to `test-results/`. It also covers the end-to-end test button, the 24h/7d/30d tabs, the error and
slow scenarios, keyboard order and reduced motion.

    npm --prefix frontend run e2e

It starts (or reuses) the Vite dev server on port 5199.

Outputs go to `test-results/` (git-ignored).

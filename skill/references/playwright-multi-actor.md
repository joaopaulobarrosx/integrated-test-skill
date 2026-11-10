# Multi-role suite with Playwright

Why: the browser an agent drives interactively can only click by coordinates inside cross-origin frames (iframes), which is slow and brittle. Playwright reaches the frames by selector (`frameLocator`), waits for conditions and runs everything in seconds. Every scenario explored by hand becomes a test that runs on every change.

## Setup (once per project)
```bash
npm i -D @playwright/test
# uses the Chrome you already have installed (no browser download):  channel: "chrome"
```
`playwright.config.ts`:
```ts
import { defineConfig } from "@playwright/test"
export default defineConfig({
  testDir: "./e2e", timeout: 120_000, expect: { timeout: 8_000 },
  fullyParallel: true, workers: 2,
  reporter: [["list"], ["html", { open: "never", outputFolder: "e2e-report" }]],
  use: { baseURL: process.env.E2E_BASE_URL ?? "https://example.com", channel: "chrome",
         viewport: { width: 1470, height: 900 }, screenshot: "only-on-failure", trace: "retain-on-failure" },
})
```
`package.json`: `"e2e": "playwright test"`. Add `e2e-report/` and `test-results/` to `.gitignore`.

## Role helper (`e2e/sim.ts`)
```ts
export async function openSim(page, info, flags = {}) {
  await page.goto("/simulator-page")
  const a = page.frameLocator('iframe[src*="role=a"]')   // role A
  const b = page.frameLocator('iframe[src*="role=b"]')   // role B
  // ... start the simulator, wait for CONDITIONS (element visible), never sleep
  return { page, a, b,
    // measures action → effect on another role and fails if it exceeds the limit
    latency: async (label, limitMs, action, effect) => {
      const t0 = Date.now(); await action()
      await expect(effect).toBeVisible({ timeout: limitMs })
      info.annotations.push({ type: "latency", description: `${label}: ${Date.now() - t0} ms (limit ${limitMs} ms)` })
    } }
}
```

## Practices that paid off
- **Stable test hooks** (`data-testid` / `data-demo`) on key buttons; for the rest, use the text the user sees (`getByRole`, `getByText`).
- Mind ARIA roles: payment options were `radio`, not `button`; the test failed because of that, not the system. When in doubt, look at the failure screenshot and `error-context.md`.
- `strict mode violation` = the selector matched more than one element: narrow it (`getByLabel`, `.first()`, `exact: true`).
- One test = one complete flow across several roles, checking the effect **on the other side**.
- Pure-logic model tests (reducer/rules) on the side, running in milliseconds (`node --experimental-strip-types`).
- Run against production when the environment has no side effects (a database-less demo); point `E2E_BASE_URL` at local to test before publishing.

## Commands
```bash
npm run e2e                      # everything, against the default URL
E2E_BASE_URL=http://localhost:3000 npm run e2e
npx playwright test -g "payment" # a single scenario
npx playwright show-report e2e-report
```
CI: a `npm run e2e` step after the preview deploy (creating a workflow file needs the `workflow` scope on the GitHub token).

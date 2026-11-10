import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  timeout: 120_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  workers: 2,
  reporter: [["list"], ["html", { open: "never", outputFolder: "e2e-report" }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "https://example.com",
    channel: "chrome", // usa o Chrome instalado (no browser download)
    viewport: { width: 1470, height: 900 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
})

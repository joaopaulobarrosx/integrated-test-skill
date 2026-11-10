import { expect, type FrameLocator, type Locator, type Page, type TestInfo } from "@playwright/test"

/** Two example roles, each in a frame (iframe) of the same page. Adapt the selectors to your system. */
export interface Sim {
  page: Page
  a: FrameLocator // role A (e.g. customer)
  b: FrameLocator // role B (e.g. attendant)
  /** measures action → visible effect on another role and fails if it exceeds the limit (ms) */
  latency: (label: string, limitMs: number, action: () => Promise<void>, effect: Locator) => Promise<number>
}

export async function openSim(page: Page, info: TestInfo): Promise<Sim> {
  await page.goto("/simulator-page")
  const a = page.frameLocator('iframe[src*="role=a"]')
  const b = page.frameLocator('iframe[src*="role=b"]')
  // wait for CONDITIONS (element visible), never fixed sleeps
  await expect(a.getByRole("button", { name: "Ask for help" })).toBeVisible({ timeout: 60_000 })
  await expect(b.getByRole("heading", { name: "Queue" })).toBeVisible({ timeout: 60_000 })
  return {
    page, a, b,
    latency: async (label, limitMs, action, effect) => {
      const t0 = Date.now()
      await action()
      await expect(effect).toBeVisible({ timeout: limitMs })
      const ms = Date.now() - t0
      info.annotations.push({ type: "latency", description: `${label}: ${ms} ms (limit ${limitMs} ms)` })
      return ms
    },
  }
}

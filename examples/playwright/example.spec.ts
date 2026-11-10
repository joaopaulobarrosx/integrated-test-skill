import { expect, test } from "@playwright/test"
import { openSim } from "./sim"

// One test = one complete flow across several roles, checking the effect ON THE OTHER SIDE.
test("the attendant sees the customer's help request within 3 s and answers it", async ({ page }, info) => {
  const s = await openSim(page, info)
  await s.latency("customer asks for help → attendant queue", 3_000,
    () => s.a.getByRole("button", { name: "Ask for help" }).click(),
    s.b.getByText("Help request"))
  await s.b.getByRole("button", { name: "Accept" }).click()
  await expect(s.a.getByText("Request confirmed")).toBeVisible({ timeout: 3_000 })
})

# Scenario matrix

Fill it in before testing. One row = one hand-off between roles. "Limit" is the longest wait the user accepts.

| # | Acting role | Action | Who must react | Expected effect | Limit |
|---|---|---|---|---|---|
| 1 | Customer | Calls the waiter | Waiter | Card "Calling waiter · Table N" | 3 s |
| 2 | Waiter | Accepts | Customer | Notice "Request confirmed" | 3 s |
| 3 | Customer | Sends an order with notes | Waiter, then kitchen | Notes on the card; after approval, on the kitchen screen | 3 s |
| 4 | Kitchen | Undoes a step (↩) | Waiter | Status goes back; nothing else breaks | 3 s |

## Categories so you do not forget any
1. **Happy path**, from first to last step.
2. **Back-and-forth:** undo, reject and redo, cancel, go back, reopen.
3. **Text fields:** empty, accents, `<b>`, `&`, emoji, very long text, only spaces. Check **where each text shows up again** (card, detail, kitchen, print, history).
4. **Every button** on each screen, including the rarely used ones (a "⋯" menu, confirmations, "Back", "Clear").
5. **Settings and switches** that turn features on/off.
6. **Concurrency:** two orders/requests at once, two operators, fast repeated clicks.
7. **Permissions per role:** what each role sees and cannot do (in the real environment).
8. **Money and numbers:** totals, fees, discounts, partial payment, amount above the balance, rounding.
9. **Time:** delay between roles, polling, realtime, timeouts, session expiry.
10. **Devices/languages:** phone, dark theme, other languages.
11. **Empty and error states:** no data, network failure, slow response.
12. **Basic accessibility:** buttons with names, focus, contrast.

## Reading the result
For each row: ✔ passed / ✘ failed (bug id) / – not tested (reason).

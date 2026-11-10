# Bug log and report

## Bug log (one per bug, fill in on the spot)

```
B-07  [confuses]  The customer's note never reaches the staff screen
Scenario:   3 (customer sends an order with notes)
Steps:      customer types "no onions" on the item and sends → waiter opens the card
Expected:   "Note: no onions" on the card and on the table screen
Actual:     card without the note
Cause:      the demo never sent the notes field (the real system displayed it)
Fix:        send notes per line and per order; show it on the card
Re-tested:  yes — round 2 (scenario 3 + full regression)
Automated test: e2e/hall.spec.ts › "order: notes reach the waiter and the kitchen…"
```

Severity: **blocks** (flow cannot finish) · **confuses** (finishes, but the user errs or doubts) · **cosmetic**.

## Final report (template)

1. **Scope:** what was tested (roles, flows, environment, date).
2. **Result:** N scenarios, N passed, N bugs found, N fixed, N pending.
3. **Bugs fixed** (one line each: what it was, the cause, how it was fixed).
4. **Measured latencies** (table: hand-off → ms → limit).
5. **Not tested and why** (real environment, permissions, integrations, mobile…).
6. **What the user must check by hand in production.**
7. **New automated tests** and how to run them (`npm run e2e`).
8. **Exit criterion met?** (one full round with no new bug + green suite).

Tone: direct, no exaggeration. Say "validated" only for what was actually run.

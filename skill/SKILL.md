---
name: integrated-test
description: End-to-end integrated test of a system with several connected roles/apps (e.g. customer + waiter + kitchen), driven in a real browser, waiting for real response times, finding bugs, fixing them and re-testing until a full round comes out clean. Use ONLY when the user asks for an "integrated test" (or "end-to-end test", "test everything together", "teste integrado", "teste ponta a ponta"). Do not run it by yourself after every feature: it is slow and expensive; use it after a good batch of features or before a release.
---

# Integrated test

Test the **whole system, connected**, the way the end user will use it: every role at the same time, every action checked **on the other side**, response times measured. It was born on a restaurant SaaS (customer + waiter/cashier + kitchen), where this method found dozens of bugs that single-screen tests never caught (see `examples/case-study.md`).

## When to use (and when not to)
- **Use:** after a batch of features, before shipping, when the user says "integrated test".
- **Do not use:** after every small feature (use typecheck/build/the screen's own tests). It takes from tens of minutes to hours and almost always needs a fix round followed by a new test.
- Ask only if something blocks you (test account, URL). Do not ask for confirmation of the plan: execute it.

## Why it works
Important bugs live **in the hand-offs between roles**: data lost on the way (a note the customer typed never reaches the staff screen), updates that arrive late, an "undo" button that breaks the other side's flow, a hint that covers a button. They only show up when you see the sides together and wait for the real response.

## The process (follow in order)

### 0. Safety and limits (before anything else)
- Never type passwords; ask the user to log in. Test only in a test environment/test account; with other people's real data, read only.
- No real payments, no messages to real people. Prefix anything you create with "TEST" and list it at the end.
- Respect the project's own rules (commit/push policy, migrations, CLAUDE.md).

### 1. Prepare the environment
- Pick the most faithful and cheapest environment: **simulator without a database** (if there is one) → **test environment with seed data** → production with a test account only.
- Start every app and confirm each role loaded. Really wait: the first dev load is slow (10–20 s). Wait for **conditions**, never fixed sleeps.
- **Fidelity rule:** a simulator is only valid if it uses the **same components and screens** as the real system, swapping only the data source. A "similar" screen or an "invented" flow is a simulator bug and invalidates the test. First audit "what the demo does that the real system doesn't / what the real one does that the demo doesn't".

### 2. Map actors and flows
Build the matrix in `references/scenario-matrix.md`: actors × actions × expected effect on every other actor × time limit. Include back-and-forth (undo, reject and redo, cancel), text fields, every button, switches/settings, lower-permission roles, several items/orders at once, and edge cases (empty, very long text, special characters).

### 3. Run what is already automated (baseline)
If there is a suite (see `references/playwright-multi-actor.md`), run it first: in seconds it tells you what is already broken and saves tokens for exploration.

### 4. Guided exploration (what the suite does not cover yet)
- Use the browser and **look at the screen at every step** (screenshots at 0.5 scale, batched). Check the effect **on the other role**, not only the one you clicked.
- Measure: action → visible effect on the other role. Compare with the limit in the matrix (perceived time: instant in a demo; a few seconds with realtime/polling).
- Watch what a user would see: hint covering a button, clipped text, buttons that jump around, duplicated notices, state that does not return, lost scroll, accessibility (buttons without a name).
- When something feels "slow" or "stuck", find the cause (action queue, whole-page reload, polling, N database calls) before patching.

### 5. Log each bug right away
Use `references/report-template.md`: steps, expected × actual, severity (blocks / confuses / cosmetic), probable cause. Do not fix in the middle of exploring the same scenario if that loses context; note it and move on, then fix in batches by root cause.

### 6. Fix
- One root cause at a time; fix the source (e.g. data that was never sent) rather than hiding the symptom.
- Run the project's checks (typecheck, build, audits) after each batch.
- **Every bug found becomes an automated test** (suite or model test) so it never comes back.

### 7. Test again (the step most often skipped)
- Redo the failing scenario **and** the full regression (fixing one flow often breaks another; it happened several times).
- Exit criterion: **one full round with no new bugs** and the whole suite green. If the round found something, go back to step 5.

### 8. Deliver
Report what was tested, what was fixed, what was **not** tested and why (RLS/realtime/real permissions, external integrations, mobile), and what the user must check by hand in production. Be honest: "validated" only covers what was actually run.

## Waiting and response times
- Wait for a **visible condition** (element, text) with a time limit equal to the maximum acceptable time for the user. Exceeding the limit is a bug, not "a flaky test".
- Record the measured latency of each important hand-off (customer→waiter, waiter→kitchen, kitchen→waiter…). See the `latency` helper in `references/playwright-multi-actor.md`.
- Polling has built-in delay (e.g. 4–5 s): prefer triggering an immediate refresh when there is a known event.

## Pitfalls that already cost a lot
- Testing against an invented screen (the demo was not the real system).
- Calling the task done without re-testing the full flow after the fix.
- Clicking by coordinates inside cross-origin iframes: slow and brittle; use Playwright (it reaches frames by selector) for anything repeatable.
- Elements that move between the screenshot and the click (reflowing layout): wait for the condition, take a new screenshot.
- State lost to HMR/reload in development: redo the scenario from the start.
- Checking only the side you clicked.

## When the simulated environment is not enough
Real database, RLS, realtime and network latency, payments, per-role permissions: test in the test environment/production with a test account, by hand or with the same suite pointed there. Say so in the report.

## Supporting files
- `references/scenario-matrix.md` — matrix template and example.
- `references/report-template.md` — bug log and final report.
- `references/playwright-multi-actor.md` — how to build the multi-role suite (starter code).
- `references/project.md` — **create this file in each project**: how to start the apps, URLs, scenarios and what the simulated environment does not cover (template in `project.template.md`).

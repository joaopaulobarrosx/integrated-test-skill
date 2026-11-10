# integrated-test — a Claude Code skill

> 🇧🇷 Português: [README.pt-BR.md](README.pt-BR.md)

**End-to-end integrated testing for systems with several connected roles** (for example customer + attendant + kitchen). The agent uses the real system in a browser, checks the effect **on the other side** of every action, measures response times, logs bugs, fixes them by root cause and **re-tests everything** until a full round comes out clean.

It is a [Claude Code](https://claude.com/claude-code) *skill*: a folder of markdown that teaches the agent a repeatable process. Ask for an **"integrated test"** and it follows it.

## Why

Important bugs live **in the hand-offs between roles**, not inside a single screen: a note the customer types that never reaches the attendant, an update that arrives late, an "undo" button that breaks the other side's flow, a hint that covers a button. Single-screen tests cannot see these. Testing **all roles at the same time**, watching the real response, can. See the [case study](examples/case-study.md).

## What the skill does

When you ask for an *integrated test*, Claude follows 8 steps:

1. **Safety and limits** — no passwords, test environment only, no real payments or messages.
2. **Prepare the environment** — preferably a database-less simulator that uses the *same components* as the real system.
3. **Map actors and flows** in a matrix (actor → action → who reacts → effect → time limit).
4. **Run the automated suite** as a baseline.
5. **Explore by hand** what the suite does not cover, looking at every role's screen and measuring action → effect.
6. **Log each bug** on the spot (steps, expected × actual, severity, cause).
7. **Fix and test again**, the full regression. Exit criterion: one complete round with no new bug.
8. **Report** what was tested, what was fixed and **what was not covered**.

It is written to **not** run by itself after every feature: an integrated test is slow and expensive; use it after a good batch of features or before a release.

## Install

Requirement: [Claude Code](https://claude.com/claude-code).

```bash
git clone https://github.com/joaopaulobarrosx/integrated-test-skill.git
cd integrated-test-skill

./install.sh                  # global: all projects (~/.claude/skills)
./install.sh --project        # current project only (./.claude/skills) — run it inside the project
./install.sh --lang pt-BR     # Portuguese version of the skill (named teste-integrado)
```

Or copy the `skill/` folder by hand to `~/.claude/skills/integrated-test/` (global) or `.claude/skills/integrated-test/` (inside a project). Restart Claude Code.

## Use

1. In each project, copy `references/project.template.md` to `references/project.md` (inside the installed skill) and fill it in: how to start the apps, URLs, where the suite lives and **what the test environment does not cover**.
2. (Recommended) Build the automated suite with Playwright using [`examples/playwright`](examples/playwright) and the recipe in [`skill/references/playwright-multi-actor.md`](skill/references/playwright-multi-actor.md).
3. In Claude Code, ask for an **"integrated test"** (or "end-to-end test", "test everything together").

## What is in here

| Path | Purpose |
|---|---|
| `skill/SKILL.md` | The skill: when to use it, the process, waiting and timing, pitfalls |
| `skill/references/scenario-matrix.md` | Matrix template and scenario categories (text, back-and-forth, concurrency, money, time…) |
| `skill/references/report-template.md` | Bug log and final report |
| `skill/references/playwright-multi-actor.md` | How to build the multi-role suite and measure latency |
| `skill/references/project.template.md` | Template for the per-project file |
| `skill-pt-BR/` | The same skill in Portuguese |
| `examples/playwright/` | Config, role helper (`sim.ts`) and a sample test |
| `examples/case-study.md` | What the method found on a restaurant SaaS |
| `install.sh` | Installs the skill (global or per project, English or Portuguese) |

## Principles

- **Fidelity first:** a simulator is only valid if it uses the same components as the real system; an "invented" flow invalidates the test.
- **Look at the other side:** every action is checked on the role that should react.
- **Wait for a condition, not for time:** the wait limit is what the user accepts; exceeding it is a bug.
- **Every bug becomes a test:** automate what manual testing found.
- **Be honest in the report:** "validated" only covers what was actually run, and what the simulated environment does not cover is stated explicitly.

## Contributing

Suggestions and pull requests are welcome, especially: suite examples for other frameworks, scenario categories and translations.

## License

[MIT](LICENSE) © 2026 Joao Barros

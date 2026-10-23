# AGENTS.md

This repository is a React + TypeScript application that demonstrates custom hooks, cache patterns, and a YouTube video search UI. The project is designed to be safe for small, high-signal changes and for tool-agnostic AI collaboration across GitHub Copilot, OpenCode, and OpenAI/Claude coding agents.

## Primary responsibilities

- Keep the app stable, readable, and testable.
- Prefer small, reviewable diffs over broad refactors.
- Preserve the existing quality gates and CI behavior.
- Treat the app as a real user-facing frontend with secure API boundary handling and observable error states.

## Repo conventions

- Package manager: `pnpm` only. Do not use `npm` or `yarn` commands.
- Runtime: Node `>=22 <25`; `.nvmrc` is the source of truth for local runtime.
- Style: Biome for linting/formatting and TypeScript for type safety.
- Testing: Jest + Testing Library for unit tests, Playwright for smoke E2E tests.
- CI: GitHub Actions runs quality gates on pull requests and pushes.

## Required workflow for contributors and agents

1. Read the task, the relevant code path, and the matching test file before editing.
2. Check the repository guidance in `README.md`, `CONTRIBUTING.md`, and any matching playbook.
3. Prefer root-cause fixes and one responsibility per change.
4. Add or adjust tests when changing behavior.
5. Run the smallest relevant validation before finishing.
6. Run the full project quality gate before opening or updating a PR.

## Local validation commands

Use these commands in order of scope:

- Focused validation for a file or area:
  - `pnpm run lint:focus -- src/...`
  - `pnpm run test:focus -- --runTestsByPath src/...`
- Full repo validation before merge:
  - `pnpm run lint`
  - `pnpm run format`
  - `pnpm run tsc`
  - `pnpm run test:ci`
  - `pnpm run build`

## CI quality standards

The repo enforces a clear quality pipeline:

- Lint and formatting checks
- Type-check and build validation
- Unit test coverage gate
- Node 24 compatibility check
- E2E smoke validation

The full CI pipeline is defined in `.github/workflows/ci.yml`.

## Tool-agnostic agent instructions

### GitHub Copilot

Use this repo as a normal TypeScript React workspace. Ask for narrow, reviewable changes and confirm the affected tests before finalizing.

### OpenCode

Treat `AGENTS.md` as the project-level operating guide. Keep changes scoped to the files relevant to the issue and validate with the repo-supported commands.

### OpenAI / Claude coding agents

Follow the same rules as any human contributor:

- respect `pnpm` and Node constraints
- validate with focused checks first, then the full gate
- do not broaden scope without a clear reason
- keep PRs small and explain the verification performed

## Playbooks

Use the repo playbooks for repeatable workflows:

- `.github/playbooks/feature-development.md`
- `.github/playbooks/bugfix.md`
- `.github/playbooks/quality-gates.md`

## Contribution checklist

Before finishing a task, make sure all of the following are true:

- The issue or feature is understood and scoped.
- The relevant files and tests were reviewed.
- The change is minimal and documented where needed.
- Lint, typecheck, and tests pass.
- The final change is ready for a clean PR.

If in doubt, prefer the smallest safe test that proves the changed behavior.

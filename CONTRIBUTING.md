# Contributing

Thanks for contributing to `videos-hooks`. This project is intentionally small, but it has strong quality gates and a clear workflow for both human contributors and AI-assisted contributors.

## Project overview

This app is a modern React course project built with:

- Vite
- React 19
- TypeScript
- Biome
- Jest + Testing Library
- Playwright
- pnpm

The repository's quality bar is intentionally high because it is designed to teach and demonstrate production-minded frontend patterns.

## Local setup

1. Use Node from `.nvmrc`.
2. Enable Corepack if needed:

   ```sh
   corepack enable
   ```

3. Install dependencies:

   ```sh
   pnpm install
   ```

4. Create a local `.env` file if the app is being run locally:

   ```env
   REACT_APP_YT_API_KEY=your_youtube_api_key_here
   REACT_APP_BASEURL=https://www.googleapis.com/youtube/v3
   VITE_YT_API_KEY=your_youtube_api_key_here
   VITE_BASEURL=https://www.googleapis.com/youtube/v3
   ```

5. Start the app:

   ```sh
   pnpm dev
   ```

## Branching and PR flow

- Create a small branch for the work.
- Keep scope narrow and reviewable.
- Prefer a single fix or feature per PR.
- Include a brief summary of validation in the pull request description.

## Required validation before PR

Before opening or updating a PR, run:

```sh
pnpm run lint
pnpm run format
pnpm run tsc
pnpm run test:ci
pnpm run build
```

For local targeted work, use the focused commands first:

```sh
pnpm run lint:focus -- src/...
pnpm run test:focus -- --runTestsByPath src/...
```

## AI-assisted contribution workflow

This repository supports a cross-tool workflow for human and AI contributors.

### Repository guidance

- Read `AGENTS.md` first.
- Review `SKILLS.md` and choose the relevant skill.
- Use the matching playbook under `.github/playbooks/`.

### Recommended sequence

1. Scope the request.
2. Identify the files and tests involved.
3. Choose the matching skill.
4. Patch the root cause with a minimal diff.
5. Add or adjust tests.
6. Validate with local quality gates.
7. Summarize verification evidence in the PR.

### Tool-specific examples

#### GitHub Copilot

Use prompts that ask for a narrow, repo-scoped change and include the validation expectations.

Example:

```text
Implement the requested fix using the bugfix skill. Follow AGENTS.md and validate with the relevant repo commands before summarizing the result.
```

#### OpenCode

Use the same repo-level instructions and quality gates.

Example:

```text
Review the relevant app flow, fix the root cause, add regression coverage if needed, and verify using the project's local validation commands.
```

#### Claude / OpenAI coding agents

Follow the same pattern: minimal scope, repo conventions, and clear verification evidence.

Example:

```text
Apply the feature-development or quality-gate playbook for this repository. Keep the patch targeted, use pnpm commands, and provide explicit validation evidence before finishing.
```

## Playbooks

Use the repository playbooks for repeatable actions:

- `.github/playbooks/feature-development.md`
- `.github/playbooks/bugfix.md`
- `.github/playbooks/quality-gates.md`

## PR checklist

Before merging, confirm:

- [ ] The change is scoped to the issue and minimal by design.
- [ ] The relevant tests were updated or added.
- [ ] Lint and type checks pass.
- [ ] Unit tests pass with the repo gate.
- [ ] Build succeeds.
- [ ] The PR summary explains what changed and how it was validated.

## Questions / help

If you are unsure how to proceed, start with the repo-level guidance in `AGENTS.md` and the relevant playbook, then keep the change narrow and evidence-based.

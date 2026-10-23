# Feature Development Playbook

This playbook is for adding or extending app behavior in a predictable, reviewable way.

## Goal

Ship a focused feature without drifting into unrelated file changes or architectural churn.

## Steps

1. Read the relevant feature area and the current test coverage.
2. Confirm the flow from UI input to state, API call, and rendering.
3. Define the smallest safe behavior change.
4. Implement the feature with minimal new abstractions.
5. Add or update tests for the changed behavior.
6. Verify with the smallest relevant command set.
7. Run the quality gate before PR submission.

## Commands

Focused checks:

```sh
pnpm run lint:focus -- src/...
pnpm run test:focus -- --runTestsByPath src/...
```

Pre-merge gate:

```sh
pnpm run lint
pnpm run tsc
pnpm run test:ci
pnpm run build
```

## Success criteria

- The code fits the current React patterns.
- The feature is covered by tests or a clear regression proof.
- The patch remains scoped to the requested behavior.
- CI and local validation both pass.

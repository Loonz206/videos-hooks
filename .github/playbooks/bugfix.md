# Bugfix Playbook

This playbook is for fixing defects with minimal risk and high confidence.

## Goal

Find the root cause, fix it once at the shared logic point, and prove the fix with a focused check.

## Steps

1. Reproduce or inspect the failing behavior.
2. Trace the call path to the underlying shared function or hook.
3. Confirm the root cause before changing code.
4. Patch the specific logic point, not every caller.
5. Add a regression test if the bug is user-visible.
6. Run the focused validation and then the full repo gate.

## Commands

Targeted validation:

```sh
pnpm run test:focus -- --runTestsByPath src/...
```

Full validation:

```sh
pnpm run lint
pnpm run tsc
pnpm run test:ci
pnpm run build
```

## Success criteria

- The fix addresses the root cause instead of masking the symptom.
- The affected behavior is covered by a test.
- The change stays small and understandable.
- The repo quality gate remains green.

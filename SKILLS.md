# SKILLS.md

This file defines a lightweight, tool-agnostic skill catalog for the repository. Each skill is designed to map cleanly to GitHub Copilot, OpenCode, or other coding agents while staying compatible with the repo's CI and code quality expectations.

## Skill 1: feature-development

When to use:
- Adding a user-facing capability
- Creating a hook or component for a new app workflow
- Extending the YouTube search flow or UI behavior

Required behavior:
- Trace the current flow through the app before editing.
- Keep the change narrow and testable.
- Add or update tests for the changed behavior.
- Validate with the smallest relevant test run, then the repo gate.

Typical prompt:
- "Implement the feature using the repository's feature-development playbook and keep it aligned with the existing React and hook patterns."

## Skill 2: bugfix

When to use:
- Fixing a broken component state flow
- Resolving an API or cache issue
- Correcting an error-state or retry path

Required behavior:
- Verify the root cause before patching.
- Prefer a single fix at the shared logic point.
- Confirm the bug is covered by a test.
- Leave a short note in the PR summary about the failure mode and fix.

Typical prompt:
- "Find the root cause of this bug, patch the shared logic once, and prove the fix with the relevant unit test."

## Skill 3: quality-gate

When to use:
- Preparing a patch for review
- Validating a branch before merge
- Auditing a change for CI readiness

Required behavior:
- Run `pnpm run lint`
- Run `pnpm run tsc`
- Run `pnpm run test:ci`
- Run `pnpm run build`
- Ensure the change does not introduce new warnings or fragile behavior

Typical prompt:
- "Run the repo quality gate and report any failures with the exact commands and remediation needed."

## Skill 4: docs-and-maintenance

When to use:
- Updating documentation
- Clarifying contributor guidance
- Keeping README and architecture signals current

Required behavior:
- Update the docs closest to the changed behavior.
- Keep instructions readable for humans and AI agents.
- Use current repo commands and constraints.

Typical prompt:
- "Update the docs and contributor instructions to reflect the current workflow, commands, and quality gates."

## Skill 5: test-first-refinement

When to use:
- Adding regression coverage
- Strengthening confidence around a current app behavior
- Refactoring without changing outputs

Required behavior:
- Write the failing or missing test first when practical.
- Keep tests focused and readable.
- Make the fix and the regression test part of the same reviewable change.

Typical prompt:
- "Add or update the smallest test that captures the behavior and then implement the fix needed to pass it."

## Skill 6: release-readiness

When to use:
- Before merging to the protected branch
- Before a release or demo milestone
- Final QA check before public deployment

Required behavior:
- Re-run the repo gate
- Confirm build output is clean
- Check the app still works in the expected smoke flow
- Summarize the release state and any caveats

Typical prompt:
- "Review the branch for release readiness and provide the exact validation evidence required for a safe merge."

## Cross-tool usage pattern

Regardless of which agent is being used:

- Follow `AGENTS.md` as the source of truth.
- Use the relevant skill above to scope the task.
- Use the appropriate playbook for the work type.
- Validate with the repo commands, not ad hoc checks.
- Keep the final PR summary evidence-based.

## Suggested contributor prompts

### Copilot prompt

"Use the feature-development skill for this requested change. Follow AGENTS.md, keep the patch minimal, and validate with the relevant repo commands before summarizing the results."

### OpenCode prompt

"Review the current implementation and apply the bugfix skill. Keep the change within the relevant files, add regression coverage where needed, and verify using the local repo quality gate."

### Claude/OpenAI prompt

"Treat this as a repository-scoped change in a Vite + React app. Read AGENTS.md and the relevant playbook, then implement the smallest safe patch with validation evidence."

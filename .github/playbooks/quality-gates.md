# Quality Gates Playbook

This repository treats quality as a CI-first workflow. Every contribution should be validated before merge.

## Required local gate

Run the following commands before a PR is considered ready:

```sh
pnpm run lint
pnpm run format
pnpm run tsc
pnpm run test:ci
pnpm run build
```

## Focused validation loop

For tighter feedback loops during development:

```sh
pnpm run lint:focus -- src/...
pnpm run test:focus -- --runTestsByPath src/...
```

## CI expectations

The GitHub Actions workflow enforces:

- Node runtime from `.nvmrc`
- Node 24 compatibility validation
- lint and format checks
- type-checking
- coverage gate
- build verification
- Playwright smoke tests

## Contributor expectation

If you are using GitHub Copilot, OpenCode, Claude, or another AI-enabled editor, the same quality gate still applies. The tooling may help generate the patch, but the repo's standards remain the required minimum.

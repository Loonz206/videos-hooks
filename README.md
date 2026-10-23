# Videos-Hooks

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: biome](https://img.shields.io/badge/code_style-biome-60a5fa.svg?style=flat-square)](https://biomejs.dev/)
[![Github Actions Status](https://github.com/Loonz206/videos-hooks/actions/workflows/ci.yml/badge.svg)](https://github.com/Loonz206/videos-hooks/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Loonz206/videos-hooks/graph/badge.svg)](https://codecov.io/gh/Loonz206/videos-hooks)
[![Coverage 90%+](https://img.shields.io/codecov/c/github/Loonz206/videos-hooks?label=coverage&token=)](https://codecov.io/gh/Loonz206/videos-hooks)

A modern React course project that demonstrates advanced React concepts using custom hooks, context, and functional components. This app allows users to search for YouTube videos and view details, leveraging the YouTube Data API v3.

![App Screenshot](https://user-images.githubusercontent.com/2746541/141409388-38f8ae9a-cd15-4d40-95ca-88c6e17f4952.png)

## Features

- Search for YouTube videos
- View video details and descriptions
- Custom React hooks for data fetching and caching
- Error boundaries and robust error handling
- Modern React patterns (hooks, context, prop-types)
- 80%+ test coverage with React Testing Library

## Getting Started

### Prerequisites

- Node.js v22 (primary runtime from `.nvmrc`)
- Node.js v24 (CI compatibility runtime)
- pnpm 10.17.1 (recommended via Corepack)

### Installation

1. **Clone the repository:**

   ```sh
   git clone <your-repo-url>
   cd videos-hooks
   ```

2. **Install dependencies:**

   ```sh
   corepack enable
   pnpm install
   ```

This repository is pnpm-only. Use pnpm for installs and scripts.

### Setup API Keys

This project uses the YouTube Data API v3. You must provide your own API key:

1. [Get a YouTube Data API key](https://console.developers.google.com/apis/library/youtube.googleapis.com)
2. Create a `.env` file in the project root with the following content:

   ```env
   REACT_APP_YT_API_KEY=your_youtube_api_key_here
   REACT_APP_BASEURL=https://www.googleapis.com/youtube/v3
   VITE_YT_API_KEY=your_youtube_api_key_here
   VITE_BASEURL=https://www.googleapis.com/youtube/v3
   ```

### Running the App Locally

```sh
# Start the development server
pnpm dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### Running Tests

```sh
pnpm test
```

Coverage is included by default in the `test` script.

### Agentic contribution workflow

This project supports a cross-tool contributor model for GitHub Copilot, OpenCode, Claude, and OpenAI-based coding assistants. The operating guidance is split between:

- [AGENTS.md](./AGENTS.md) — repo-level instructions for all agents and human contributors
- [SKILLS.md](./SKILLS.md) — reusable skill catalog and task prompts
- [.github/playbooks](./.github/playbooks) — repeatable workflow playbooks for feature work, bug fixes, and quality gates
- [CONTRIBUTING.md](./CONTRIBUTING.md) — contributor setup and PR guidance

The workflow is intentionally tool-agnostic:

1. **Scope the change**
   - Identify the exact feature, hook, or UI flow involved.
2. **Choose the matching skill**
   - Use feature-development, bugfix, quality-gate, or docs-and-maintenance depending on the task.
3. **Run the relevant validation loop**
   - Start with focused checks using `pnpm run lint:focus -- src/...` and `pnpm run test:focus -- --runTestsByPath src/...`.
4. **Run the repo gate before merge**
   - `pnpm run lint`
   - `pnpm run format`
   - `pnpm run tsc`
   - `pnpm run test:ci`
   - `pnpm run build`
5. **Submit with evidence**
   - Include the validation commands and results in the PR summary.

CI runs quality gates on the `.nvmrc` runtime and verifies compatibility on Node 24.

### Git hooks and staged validation

This repository uses Husky and lint-staged for fast local quality checks:

- `pre-commit`: runs `pnpm exec lint-staged` against staged files
- `pre-push`: runs `pnpm run test:ci` to ensure the full CI validation still passes

The staged lint configuration automatically formats/lints changed JavaScript and TypeScript files with Biome, then runs related Jest tests only for the touched files.

### Dependency safety window

Dependency resolution is configured with pnpm `minimumReleaseAge: 1440` (24 hours) in [pnpm-workspace.yaml](./pnpm-workspace.yaml) to reduce risk from newly published supply-chain updates.

### Error boundary and logging

- The app uses a verbose boundary in [ErrorBoundary.tsx](./src/util/ErrorBoundary.tsx) with:
  - structured error IDs
  - optional technical details for debug scenarios
  - retry action support
- Structured application logging is handled by [logger.ts](./src/util/logger.ts) and used in cache/error paths to provide consistent, machine-readable logs.

## License

MIT

## Credits

Modern React Course

[Example App](https://videos-hooks-pearl.vercel.app/)

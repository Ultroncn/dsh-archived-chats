# Repository Guidelines

## Project Structure & Module Organization

This repository is a DeepSeek Harness plugin. `lib/index.js` provides Host routes and lifecycle handling; `lib/client.js` provides the web settings UI. Other `lib/*.js` files handle search, backups, metadata, compatibility, and legacy recovery. Public type declarations live in `lib/types/`. Tests are in `test/*.test.mjs`, with pinned Host dependencies in `test/fixtures/`. User and architecture guides are in `docs/`; release images and their ordering are in `assets/` and `screenshots.json`.

## Build, Test, and Development Commands

Use Node.js 18 or 24. Run `npm ci` to install locked dependencies and `npm test` to run the Node test suite. There is no separate build script: the published package loads the JavaScript in `lib/` directly. Run `npm pack --dry-run --json` to inspect package contents before a release or PR.

For Host integration, install a pinned fixture, then run its integration check. For example:

```sh
npm ci --prefix test/fixtures/native-host --ignore-scripts --include=optional
node scripts/run-native-integration.mjs --fixture-root test/fixtures/native-host
```

CI also checks the other fixture directories listed in `.github/workflows/ci.yml` across supported operating systems.

## Coding Style & Naming Conventions

Use ES modules, two-space indentation, single-quoted strings, and semicolons, matching the existing JavaScript. Name modules by responsibility with lowercase hyphenated filenames, such as `session-graph.js`; name tests `<module>.test.mjs`. No formatter or linter is configured, so keep changes consistent with nearby code and check the diff for whitespace errors.

## Testing Guidelines

Use the built-in `node:test` runner and `node:assert/strict`. Add focused behavior tests for changed modules; import, restore, recycle, and permanent-deletion changes need failure and rollback coverage. Run `npm test` and the relevant native Host fixture checks. No numeric coverage threshold is configured.

## Commits, Pull Requests & Safety

Follow `CONTRIBUTING.md`: use `<type>/<short-description>` branches and Conventional Commit subjects such as `fix(import): guard invalid paths` (72 characters or fewer). Keep each PR focused, link its issue with `Closes #42`, describe user-visible and compatibility or data-safety effects, and report test results. Include screenshots for UI changes and update both English and Chinese user documentation when behavior changes. Never commit local chat data, attachments, logs, credentials, or temporary files; report vulnerabilities privately through `SECURITY.md`.

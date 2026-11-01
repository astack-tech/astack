# Contributing to AStack

Thank you for helping. This page is the short version. The full rules, written for people and AI agents alike, are in [AGENTS.md](../AGENTS.md). Read it before your first pull request.

## Set up

Requirements: Node.js 20 or later and pnpm 10.

```bash
git clone https://github.com/astack-tech/astack.git
cd astack
pnpm install
pnpm build
pnpm verify
```

`pnpm verify` runs formatting, lint, type checks, tests and package checks. It must pass before you open a pull request.

## The rules that matter most

1. **Code is the single source of truth.** Docs, READMEs, examples and the website describe the code as it is. Update them in the same pull request as the code.
2. **Test first.** Start every fix or feature with a test that fails. Then make it pass.
3. **Zero warnings.** Do not weaken lint rules, compiler flags, coverage thresholds or tests.
4. **English only** in code, comments, strings, commits and docs.

## Workflow

1. Branch from `dev`: `feat/...`, `fix/...`, `docs/...` or `chore/...`.
2. Commit with [Conventional Commits](https://www.conventionalcommits.org/), for example `fix(core): ...`.
3. Add a changeset for user-facing changes: `pnpm changeset`.
4. Open the pull request against `dev`. CI must be green.

## Examples and docs

- An example shows one concept in one `index.ts`. See [examples/README.md](../examples/README.md).
- Docs pages are in `website/content/docs`. Link each page to its examples, and each example to its page.
- After changing an example, run `pnpm sync:examples`.

## Questions

Use [GitHub Discussions](https://github.com/astack-tech/astack/discussions). Report security issues as described in [SECURITY.md](../SECURITY.md).

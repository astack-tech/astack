# AGENTS.md

Instructions for AI coding agents and human contributors working in this repository. Read the whole file before you change anything. Rules marked **MUST** are enforced by tooling or review.

## 1. Non-negotiable rules

1. **Code is the single source of truth.** This rule applies to itself.
   - Docs, READMEs, the website, the blog, JSDoc and comments describe the code as it is now.
   - When prose and code disagree, fix the prose (or fix the code and its tests). Never describe behavior that the source and tests cannot show.
   - Before you write a claim about an API, read its source. Before you change an API, find every doc, README, example and website page that mentions it.
2. **Test first.** Every behavior change and every bug fix MUST start with a test that fails for the right reason. Run it, see it fail, then change the code until it passes. Record the failing test name in the PR.
3. **Strictest gates, zero warnings.** `pnpm verify` MUST pass before a PR is opened. Never weaken a lint rule, a compiler flag, a coverage threshold or a test to get green. If a rule is wrong for one line, use a single-line disable with a `-- reason`.
4. **English only in the repository.** Code, comments, string literals, commit messages, docs and examples are English. The `astack/english-only` lint rule rejects CJK text in source files. The only exception is `README.zh-CN.md`, the Chinese translation of `README.md`; keep the two in sync. Conversations with the maintainer may use their language.
5. **No secrets.** Never commit API keys, tokens or `.env` files. Read configuration from `process.env['NAME']` and fail with a clear message when it is missing.
6. **Small, focused changes.** One concern per commit. Do not mix refactors with behavior changes.
7. **Security comes first.** Security fixes and dependency upgrades have the highest priority. Never reject, pin back or ignore an upgrade because the new version looks or behaves differently; adapt the code to the new version's API and configuration instead. Audit both installs: `pnpm audit` at the root and in `website/`. A known vulnerability blocks a release.
8. **Brand copy needs the maintainer's approval.** Repository and organization descriptions, taglines, slogans, package `description` fields, website hero and section copy, and other brand messaging were designed by the maintainer. Do not change them without explicit approval in the current task. Propose the new wording and wait for confirmation.

## 2. Repository map

| Path                         | Contents                                                                                                       |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `packages/core`              | `@astack-tech/core`: `Component`, `Pipeline`, `Port`. Built on the HLang runtime (`@hlang-org/runtime`, RxJS). |
| `packages/components`        | `@astack-tech/components`: `Agent`, `StreamingAgent`, `RLMAgent`, `TextSplitter`, `ToolInvoker`.               |
| `packages/tools`             | `@astack-tech/tools`: `createTool`, tool sets, component tools, MCP tools.                                     |
| `packages/integrations`      | `@astack-tech/integrations`: model providers (`Deepseek`).                                                     |
| `examples/*`                 | One-file, one-concept examples (`@astack-examples/*`, private).                                                |
| `website/`                   | Next.js site for astack.tech. Docs live in `website/content/docs`. Not part of the pnpm workspace.             |
| `scripts/`                   | Repository scripts, for example `sync-examples.mjs`.                                                           |
| `tools/*`                    | Private helper packages. `minimatch-compat` gives older dependents the minimatch 3/10 interface on 11.x.       |
| `assets/brand`, `docs/brand` | Brand assets and their validation records.                                                                     |
| `.changeset/`                | Pending release notes. The repo is in `beta` pre-release mode.                                                 |

Dependency direction: `core` ← `tools` ← `components`; `core` ← `integrations`. `components` uses `integrations` only in tests. Never add a cycle.

## 3. Commands

Run from the repository root with Node.js 20+ and pnpm 10.

| Command                              | What it does                                                                            |
| ------------------------------------ | --------------------------------------------------------------------------------------- |
| `pnpm install`                       | Install the workspace (packages and examples).                                          |
| `pnpm build`                         | Build every package with tsup (ESM, CJS, declarations).                                 |
| `pnpm lint`                          | ESLint (typescript-eslint `strictTypeChecked` + `stylisticTypeChecked`), zero warnings. |
| `pnpm check-types`                   | `tsc` with the flags in `tsconfig.base.json` for every package and example.             |
| `pnpm test`                          | Vitest with coverage thresholds for packages; runs the offline examples as smoke tests. |
| `pnpm format` / `pnpm format:check`  | Prettier.                                                                               |
| `pnpm turbo run check:package`       | `publint --strict` and `attw --profile node16` for every package.                       |
| `pnpm check:examples`                | Regenerate website example data and fail if it drifted.                                 |
| `pnpm check:api` / `pnpm update:api` | Check or update the API Extractor report of every package.                              |
| `pnpm docs:api` / `pnpm check:docs`  | Generate the TypeDoc API reference, or fail if it drifted.                              |
| `pnpm verify`                        | Everything above. MUST pass before a PR.                                                |

Package-scoped: `pnpm --filter @astack-tech/core test`, `pnpm --filter @astack-examples/pipeline start`.

Website (separate install): `cd website && pnpm install` (the folder has its own `pnpm-workspace.yaml` and lockfile), then `pnpm lint`, `pnpm check-types`, `pnpm test`, `pnpm build`. Website tests live in `website/lib/__tests__` and follow the same coverage thresholds. The website supports the browsers Next.js targets (Chrome and Edge 111, Firefox 111, Safari 16.4); newer CSS needs a fallback in `website/app/styles/resilience.css`. The dev server uses `.next-dev` and the build uses `.next`; never run both against the same directory.

## 4. TypeScript and lint standards

- `tsconfig.base.json` enables `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noUnusedLocals` and `noUnusedParameters`. Every package and example extends it.
- Optional properties in public types are written `name?: T | undefined`, so callers can pass `undefined` explicitly.
- Use `unknown`, never `any`. Narrow with type guards instead of casts. Use `import type` for types.
- Override base methods with `override`. Read index signatures with brackets: `process.env['KEY']`.
- No `console` in package code. Use `createLogger(scope, verbose)` from `packages/components/src/utils/logger.ts`; logging is off unless the user sets `verbose: true`. Examples may use `console`.
- Public exports are named and re-exported from each package's `src/index.ts`. Document non-obvious exports with JSDoc.
- File names: kebab-case for modules, PascalCase for files that hold one class (`StreamingAgent.ts`).

## 5. Testing standards

- Vitest. Tests live next to the code in `src/**/__tests__/*.test.ts`.
- Coverage thresholds per package: 90% lines, functions and statements; 85% branches. Do not lower them.
- Tests never call the network. Mock model APIs (see `packages/integrations/src/model-provider/deepseek/__tests__`) or use fakes (see `packages/components/src/agents/__tests__/fakes.ts`).
- Test behavior through the public API, including pipeline mode (`Pipeline.run`) for components.
- When you fix a bug, the regression test name states the behavior, for example `keeps separate multi-output routes independent`.
- Use temporary directories for filesystem tests and remove them afterwards.

## 6. Packages and publishing

- Each package has a complete `package.json`: description, keywords, homepage, repository with `directory`, bugs, license, `sideEffects`, `exports` (including `./package.json`), `files`, `engines` and `publishConfig.access: public`.
- Each package has its own README: what it is, install, a quick start that compiles, an API table, links to docs and examples, and the package family table. A package README MUST NOT copy another package's content.
- `pnpm turbo run check:package` MUST pass.
- Every user-facing change needs a changeset: `pnpm changeset`. Describe what changed for users, not how.
- Releases run in CI (`.github/workflows/release.yml`). After changesets reach `master`, the workflow opens a "Version packages" pull request against `master`. Merging it publishes the new versions with npm Trusted Publishing (OIDC, with provenance), tags `<name>@<version>` and creates GitHub releases from the changelogs; then fast-forward `dev` to `master`. `pnpm release:dry-run` shows what would be published. Do not publish by hand.
- While `.changeset/pre.json` is in pre mode, versions publish under `beta`, and `latest` follows until the first stable release.

## 7. API documentation

The API reference is generated from the code. Never write signatures by hand.

- Every exported symbol and every member of an exported class or interface has a TSDoc comment (`/** ... */`). `tsdoc/syntax` lints the comment syntax; TypeDoc's `notDocumented` validation fails the build when a comment is missing.
- Write `@param name - description` (with the hyphen), `@returns`, `@throws` and `@example` where they help. Each package's `src/index.ts` starts with an `@packageDocumentation` comment.
- `pnpm docs:api` regenerates `website/content/api` with TypeDoc; `pnpm check:docs` fails when it drifts. The website renders it under `/docs/api`. Docs pages list related API pages in their `api:` front matter, and the build fails on an entry that no longer exists.
- API Extractor keeps a public API report per package in `packages/<name>/etc/<name>.api.md`. `pnpm check:api` fails when the public API changes. When the change is intended, run `pnpm update:api`, commit the updated report, and describe the change in a changeset. Reviewers read the report diff to approve API changes.

## 8. Examples and docs

Examples are a learning path, in the style of a cookbook. Docs and examples are cross-linked.

- One example = one concept = one `index.ts`. If it needs a second file, it is two examples.
- Each example has `README.md` (summary, level, concept doc link, mermaid diagram, run command), `package.json` with an `astack` block (`title`, `order`, `tier`, `doc`, `requiresApiKey`) and `tsconfig.json`.
- Examples without an API key MUST run offline; `pnpm test` runs them.
- Docs pages live in `website/content/docs/*.md`. Frontmatter `examples: [...]` links a page to its examples; each example's `doc` links back.
- The website renders example code from `examples/` through `pnpm sync:examples`. Never hand-edit `website/content/examples`.
- When an API changes, update in the same PR: tests, package README, docs page, examples, website code samples, root READMEs (English and Chinese).

## 9. Git workflow

- Branches: `master` is production (the website deploys from it); `dev` is integration. Branch from `dev`: `feat/...`, `fix/...`, `docs/...`, `chore/...`.
- PRs go into `dev`; `dev` is merged into `master` for releases. Keep local and remote `master` and `dev` identical after merges, and delete merged branches.
- Conventional Commits: `feat(core): ...`, `fix(components): ...`, `docs: ...`, `chore(repo): ...`. One package per commit when possible.
- Never push, merge, publish or deploy unless the maintainer asks for it in the current task.

## 10. Security notes

- `RLMAgent` runs model-written code in a Node.js `vm` context. It is not a security boundary; document this wherever RLM is shown.
- Report vulnerabilities as described in `SECURITY.md`.

## 11. Definition of done

- [ ] A failing test was written first and now passes.
- [ ] `pnpm verify` passes with zero warnings.
- [ ] Docs, package READMEs, examples, website and root READMEs match the code.
- [ ] New or changed exports have TSDoc comments; the API report and generated API docs are updated.
- [ ] A changeset exists for user-facing changes.
- [ ] No secrets, no CJK text in source, no `console` in packages.

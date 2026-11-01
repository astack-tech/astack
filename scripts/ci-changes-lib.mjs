/** Decides which CI jobs a change needs. Kept apart from ci-changes.mjs so it can be tested. */

/** Files under `website/` that `pnpm verify` regenerates and compares (check:docs, check:examples). */
const GENERATED_FOR_VERIFY = [
  'website/content/api/',
  'website/content/examples/',
  'website/content/release.json',
];

/** Files whose change runs every job. */
const RUN_EVERYTHING = ['.github/workflows/ci.yml'];

/**
 * Decides which jobs a pull request needs from its changed files.
 *
 * - `website` runs when anything under `website/` changes. The website reads nothing
 *   outside its folder; it installs `@astack-tech/core` from npm.
 * - `verify` runs when anything outside `website/` changes, or a website file that
 *   `pnpm verify` regenerates and compares.
 * - A change to the CI workflow, or a list that could not be read (empty), runs both.
 * @param {readonly string[]} files - Changed paths, relative to the repository root.
 * @returns {{ verify: boolean, website: boolean }}
 */
export function classifyChanges(files) {
  if (files.length === 0 || files.some(file => RUN_EVERYTHING.includes(file))) {
    return { verify: true, website: true };
  }
  const inWebsite = (/** @type {string} */ file) => file.startsWith('website/');
  return {
    verify: files.some(
      file => !inWebsite(file) || GENERATED_FOR_VERIFY.some(prefix => file.startsWith(prefix))
    ),
    website: files.some(inWebsite),
  };
}

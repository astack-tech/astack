/** Pure helpers for scripts/publish-packages.mjs, kept apart so they can be tested. */

/**
 * The npm dist-tag for a release: the pre-release tag while changesets is in pre mode
 * (`.changeset/pre.json`), otherwise `latest`.
 * @param {{ mode?: string, tag?: string } | undefined} pre - The parsed pre.json, if any.
 * @returns {string}
 */
export function distTag(pre) {
  return pre?.mode === 'pre' && pre.tag ? pre.tag : 'latest';
}

/**
 * The git tag of a published version, in the format changesets uses.
 * @param {string} name - Package name.
 * @param {string} version - Package version.
 * @returns {string}
 */
export function releaseTag(name, version) {
  return `${name}@${version}`;
}

/**
 * The body of the `## <version>` section of a changesets CHANGELOG.md.
 * @param {string} changelog - The file contents.
 * @param {string} version - The version to extract.
 * @returns {string}
 */
export function releaseNotes(changelog, version) {
  const lines = changelog.split('\n');
  const start = lines.findIndex(line => line.trim() === `## ${version}`);
  if (start === -1) {
    return 'See the changelog for details.';
  }
  const rest = lines.slice(start + 1);
  const end = rest.findIndex(line => line.startsWith('## '));
  const body = (end === -1 ? rest : rest.slice(0, end)).join('\n').trim();
  return body || 'See the changelog for details.';
}

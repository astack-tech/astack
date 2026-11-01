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

/**
 * Orders packages so each one comes after the packages it depends on, which keeps
 * every published version installable the moment it appears. It is a depth-first
 * walk in input order; dependencies outside the list are ignored.
 * @template T
 * @param {T[]} items - The packages to order.
 * @param {(item: T) => string} nameOf - The package name.
 * @param {(item: T) => string[]} depsOf - The names it depends on.
 * @returns {T[]}
 * @throws {Error} When the dependencies form a cycle.
 */
export function publishOrder(items, nameOf, depsOf) {
  const byName = new Map(items.map(item => [nameOf(item), item]));
  /** @type {T[]} */
  const ordered = [];
  const done = new Set();
  const visiting = new Set();
  /** @param {T} item */
  const visit = item => {
    const name = nameOf(item);
    if (done.has(name)) {
      return;
    }
    if (visiting.has(name)) {
      throw new Error(`Package dependency cycle at ${name}`);
    }
    visiting.add(name);
    for (const dep of depsOf(item)) {
      const target = byName.get(dep);
      if (target !== undefined) {
        visit(target);
      }
    }
    visiting.delete(name);
    done.add(name);
    ordered.push(item);
  };
  items.forEach(visit);
  return ordered;
}

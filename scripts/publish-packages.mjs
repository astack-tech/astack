#!/usr/bin/env node
/**
 * Publishes every public package whose version is not on npm yet, then tags and
 * releases it on GitHub. CI runs it from .github/workflows/release.yml after the
 * changesets "Version packages" pull request is merged.
 *
 * - `pnpm pack` builds each tarball, which turns `workspace:*` ranges into versions.
 * - `npm publish <tarball>` uploads it. In CI npm authenticates with OIDC (npm Trusted
 *   Publishing), so there is no token, and npm adds a provenance statement.
 * - While changesets is in pre mode, packages publish under the pre tag (`beta`). With
 *   LATEST_FOLLOWS_PRERELEASE=true, `latest` moves too, so `npm install` without a tag
 *   gets the newest beta until the first stable release.
 * - Each published version gets the git tag `<name>@<version>` and a GitHub release
 *   whose notes are that version's CHANGELOG.md section.
 * - With npm staged publishing, an upload can wait for a maintainer to approve it on
 *   npmjs.com. The run that uploads it gets a successful publish and tags and releases
 *   it. Until the approval `npm view` does not show it, so a later run would upload it
 *   again; npm rejects that with E409, and the script skips the version with a notice.
 * - When changesets/action runs the script, it sets CHANGESETS_OUTPUT to a file path.
 *   The script writes one line per published package there (see
 *   `changesetsOutputLine`), so the action reports what was published.
 *
 * Usage: node scripts/publish-packages.mjs [--dry-run]
 */
import { execFileSync, spawnSync } from 'node:child_process';
import {
  appendFileSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  changesetsOutputLine,
  distTag,
  isStagedConflict,
  publishOrder,
  releaseNotes,
  releaseTag,
} from './release-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dryRun = process.argv.includes('--dry-run');
const latestFollows = process.env['LATEST_FOLLOWS_PRERELEASE'] === 'true';
const changesetsOutput = process.env['CHANGESETS_OUTPUT'];

// The action reads this file even when nothing is published, so it always exists.
if (changesetsOutput !== undefined && changesetsOutput !== '' && !dryRun) {
  writeFileSync(changesetsOutput, '');
}

/**
 * Runs a command and returns its output; the command's errors propagate.
 * @param {string} command - The executable.
 * @param {string[]} args - Its arguments.
 * @param {import('node:child_process').ExecFileSyncOptionsWithStringEncoding | object} [options] - Extra options, such as `cwd`.
 * @returns {string}
 */
function run(command, args, options = {}) {
  console.log(`$ ${command} ${args.join(' ')}`);
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
    ...options,
  });
}

/**
 * Runs `npm publish`, passing its error output through.
 * @param {string[]} args - Arguments after `npm`.
 * @param {string} cwd - Package directory.
 * @param {string} version - Version being published.
 * @returns {'published' | 'staged'} `staged` when the version already waits for approval.
 */
function npmPublish(args, cwd, version) {
  console.log(`$ npm ${args.join(' ')}`);
  const result = spawnSync('npm', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'inherit', 'pipe'],
  });
  process.stderr.write(result.stderr);
  if (result.status === 0) {
    return 'published';
  }
  if (isStagedConflict(result.stderr, version)) {
    return 'staged';
  }
  throw new Error(`npm publish failed with exit code ${String(result.status)}`);
}

/**
 * Whether npm already has this exact version.
 * @param {string} name - Package name.
 * @param {string} version - Package version.
 * @returns {boolean}
 */
function isPublished(name, version) {
  try {
    const out = execFileSync('npm', ['view', `${name}@${version}`, 'version'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.trim() === version;
  } catch {
    return false;
  }
}

const prePath = path.join(root, '.changeset/pre.json');
const tag = distTag(existsSync(prePath) ? JSON.parse(readFileSync(prePath, 'utf8')) : undefined);

const packages = readdirSync(path.join(root, 'packages'))
  .map(dir => path.join(root, 'packages', dir))
  .filter(dir => existsSync(path.join(dir, 'package.json')))
  .map(dir => ({ dir, manifest: JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8')) }))
  .filter(({ manifest }) => manifest.private !== true);

// Dependencies first, so every version is installable the moment it is public.
const pending = publishOrder(
  packages.filter(({ manifest }) => !isPublished(manifest.name, manifest.version)),
  ({ manifest }) => manifest.name,
  ({ manifest }) => Object.keys({ ...manifest.dependencies, ...manifest.peerDependencies })
);
if (pending.length === 0) {
  console.log('Every package version is already on npm. Nothing to publish.');
  process.exit(0);
}

const outDir = mkdtempSync(path.join(tmpdir(), 'astack-pack-'));
const published = [];
/** @type {string[]} */
const staged = [];
try {
  for (const { dir, manifest } of pending) {
    const { name, version } = manifest;
    const tarball = run('pnpm', ['pack', '--pack-destination', outDir], { cwd: dir })
      .trim()
      .split('\n')
      .at(-1);
    if (!tarball) {
      throw new Error(`pnpm pack printed no tarball path for ${name}`);
    }
    const publishArgs = ['publish', tarball, '--access', 'public', '--tag', tag];
    if (dryRun) {
      publishArgs.push('--dry-run');
    }
    if (npmPublish(publishArgs, dir, version) === 'staged') {
      staged.push(`${name}@${version}`);
      continue;
    }
    if (!dryRun && latestFollows && tag !== 'latest') {
      run('npm', ['dist-tag', 'add', `${name}@${version}`, 'latest']);
    }
    published.push({ dir, name, version });
    if (changesetsOutput !== undefined && changesetsOutput !== '' && !dryRun) {
      appendFileSync(changesetsOutput, changesetsOutputLine(name, version));
    }
  }
} finally {
  rmSync(outDir, { recursive: true, force: true });
}

if (staged.length > 0) {
  console.log(
    `::notice::${staged.join(', ')} already waits for approval on npmjs.com (staged publishing). An earlier run uploaded, tagged and released it; approve it there to make it public.`
  );
}

if (dryRun) {
  console.log(
    `Dry run: would publish ${published.map(p => `${p.name}@${p.version}`).join(', ')} under "${tag}".`
  );
  process.exit(0);
}

for (const { dir, name, version } of published) {
  const gitTag = releaseTag(name, version);
  run('git', ['tag', gitTag]);
  run('git', ['push', 'origin', gitTag]);
  const changelog = path.join(dir, 'CHANGELOG.md');
  const notesFile = path.join(tmpdir(), `${name.replace(/[@/]/g, '_')}-${version}.md`);
  writeFileSync(
    notesFile,
    releaseNotes(existsSync(changelog) ? readFileSync(changelog, 'utf8') : '', version)
  );
  const releaseArgs = ['release', 'create', gitTag, '--title', gitTag, '--notes-file', notesFile];
  if (tag !== 'latest') {
    releaseArgs.push('--prerelease');
  }
  run('gh', releaseArgs);
}

console.log(`Published ${published.map(p => `${p.name}@${p.version}`).join(', ')} under "${tag}".`);

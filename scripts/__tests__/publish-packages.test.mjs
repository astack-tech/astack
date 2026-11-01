// Run with `pnpm test:scripts`.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { distTag, releaseNotes, releaseTag } from '../release-lib.mjs';

test('pre mode publishes under the pre tag; otherwise latest', () => {
  assert.equal(distTag({ mode: 'pre', tag: 'beta' }), 'beta');
  assert.equal(distTag({ mode: 'exit', tag: 'beta' }), 'latest');
  assert.equal(distTag(undefined), 'latest');
});

test('git tags follow the changesets convention', () => {
  assert.equal(releaseTag('@astack-tech/core', '0.2.0-beta.3'), '@astack-tech/core@0.2.0-beta.3');
});

const CHANGELOG = `# @astack-tech/core

## 0.2.0-beta.3

### Patch Changes

- abc1234: Require \`@hlang-org/runtime\` 1.0.7.

## 0.2.0-beta.2

### Minor Changes

- e71dd3b: Pipeline endpoint inference.
`;

test('release notes are the changelog section of that version', () => {
  assert.equal(
    releaseNotes(CHANGELOG, '0.2.0-beta.3'),
    '### Patch Changes\n\n- abc1234: Require `@hlang-org/runtime` 1.0.7.'
  );
  assert.equal(
    releaseNotes(CHANGELOG, '0.2.0-beta.2'),
    '### Minor Changes\n\n- e71dd3b: Pipeline endpoint inference.'
  );
});

test('a version without a changelog section gets a plain note', () => {
  assert.equal(releaseNotes(CHANGELOG, '9.9.9'), 'See the changelog for details.');
  assert.equal(releaseNotes('', '1.0.0'), 'See the changelog for details.');
});

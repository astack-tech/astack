// Run with `pnpm test:scripts`.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  changesetsOutputLine,
  distTag,
  publishOrder,
  releaseNotes,
  releaseTag,
} from '../release-lib.mjs';

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

test('packages publish after the packages they depend on', () => {
  const packages = [
    { name: '@astack-tech/components', deps: ['@astack-tech/core', '@astack-tech/tools'] },
    { name: '@astack-tech/core', deps: [] },
    { name: '@astack-tech/integrations', deps: ['@astack-tech/core'] },
    { name: '@astack-tech/tools', deps: ['@astack-tech/core'] },
  ];
  const order = publishOrder(
    packages,
    item => item.name,
    item => item.deps
  ).map(item => item.name);
  assert.equal(order.length, packages.length);
  for (const item of packages) {
    for (const dep of item.deps) {
      assert.ok(order.indexOf(dep) < order.indexOf(item.name), `${dep} before ${item.name}`);
    }
  }
  assert.equal(order[0], '@astack-tech/core');
});

test('a dependency cycle is an error, not a silent order', () => {
  const cycle = [
    { name: 'a', deps: ['b'] },
    { name: 'b', deps: ['a'] },
  ];
  assert.throws(
    () =>
      publishOrder(
        cycle,
        item => item.name,
        item => item.deps
      ),
    /cycle/
  );
});

test('reports each published package to changesets/action as one NDJSON git-tag event', () => {
  const line = changesetsOutputLine('@astack-tech/core', '0.2.0-beta.4');
  assert.ok(line.endsWith('\n'));
  assert.deepEqual(JSON.parse(line), {
    type: 'git-tag',
    tag: '@astack-tech/core@0.2.0-beta.4',
    packageName: '@astack-tech/core',
  });
});

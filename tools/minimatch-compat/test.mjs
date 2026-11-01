// Run with `node --test tools/minimatch-compat/test.mjs`.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';

import compat, { Minimatch, minimatch } from './index.mjs';

const require = createRequire(import.meta.url);

test('the CommonJS export is callable like minimatch 3', () => {
  const legacy = require('./index.cjs');
  assert.equal(typeof legacy, 'function');
  assert.equal(legacy('src/a.ts', 'src/*.ts'), true);
  assert.equal(legacy('src/a.js', 'src/*.ts'), false);
  assert.equal(legacy.default, legacy);
});

test('Babel interop sees a default export', () => {
  const legacy = require('./index.cjs');
  const interop = legacy && legacy.__esModule ? legacy : { default: legacy };
  assert.equal(interop.default('Foo', 'F*'), true);
});

test('named ES exports match the minimatch 11 behaviour', () => {
  assert.equal(minimatch('a/b/c.md', 'a/**/*.md'), true);
  assert.equal(compat.minimatch('x', 'y'), false);
});

test('Minimatch#matchOne answers partial matches like minimatch 10', () => {
  const mini = new Minimatch('packages/*/src/**/*.ts');
  const recurse = segments => mini.set.some(row => mini.matchOne(segments, row, true));
  assert.equal(recurse(['packages', 'core']), true);
  assert.equal(recurse(['packages', 'core', 'src', 'pipeline']), true);
  assert.equal(recurse(['examples']), false);
  assert.equal(mini.matchOne(['packages', 'core', 'src', 'index.ts'], mini.set[0], false), true);
});

test('the patched minimatch 11 is underneath', () => {
  const version = require('minimatch/package.json').version;
  assert.ok(Number(version.split('.')[0]) >= 11, `minimatch ${version}`);
});

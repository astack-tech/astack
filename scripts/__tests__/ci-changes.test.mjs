// Run with `pnpm test:scripts`.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { classifyChanges } from '../ci-changes-lib.mjs';

test('a website-only change runs the website job and skips verify', () => {
  assert.deepEqual(
    classifyChanges(['website/components/Hero.tsx', 'website/app/styles/home.css']),
    {
      verify: false,
      website: true,
    }
  );
});

test('a package change runs verify and skips the website job', () => {
  assert.deepEqual(classifyChanges(['packages/core/src/pipeline/index.ts', 'README.md']), {
    verify: true,
    website: false,
  });
});

test('generated website content that verify checks also runs verify', () => {
  for (const file of [
    'website/content/api/@astack-tech/core/classes/Pipeline.md',
    'website/content/examples/chat.json',
    'website/content/release.json',
  ]) {
    assert.deepEqual(classifyChanges([file]), { verify: true, website: true }, file);
  }
});

test('a change to the CI workflow runs every job', () => {
  assert.deepEqual(classifyChanges(['.github/workflows/ci.yml']), { verify: true, website: true });
});

test('a docs page under website/content/docs is a website-only change', () => {
  assert.deepEqual(classifyChanges(['website/content/docs/pipelines.md']), {
    verify: false,
    website: true,
  });
});

test('an empty change list runs every job, because the diff could not be read', () => {
  assert.deepEqual(classifyChanges([]), { verify: true, website: true });
});

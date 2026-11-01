// Run with `pnpm test:scripts`.
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { test } from 'node:test';

import { spawnGroup, stopGroup } from '../process-tree.mjs';

test('stopping a command also stops the processes it started', async () => {
  // The shell starts a background child that inherits stdout, like pnpm starting tsx.
  const child = spawnGroup('sh', ['-c', 'sleep 30 & echo started; wait']);
  await once(child.stdout, 'data');
  const closed = once(child, 'close');
  stopGroup(child);
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('output pipe still open after 2 s')), 2000).unref();
  });
  const [, signal] = await Promise.race([closed, timeout]);
  assert.equal(signal, 'SIGTERM');
});

#!/usr/bin/env node
/**
 * Writes `verify=<bool>` and `website=<bool>` to $GITHUB_OUTPUT for the CI workflow.
 * It reads the changed files of a pull request from `git diff --name-only HEAD^1 HEAD`:
 * on `pull_request`, actions/checkout checks out the merge commit, whose first parent is
 * the base branch. Pushes to master and dev run every job.
 *
 * Usage: node scripts/ci-changes.mjs
 */
import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';

import { classifyChanges } from './ci-changes-lib.mjs';

/** @returns {string[]} Changed files of the pull request, or `[]` when the diff fails. */
function changedFiles() {
  try {
    return execFileSync('git', ['diff', '--name-only', 'HEAD^1', 'HEAD'], { encoding: 'utf8' })
      .split('\n')
      .filter(line => line !== '');
  } catch (error) {
    console.log(`Could not read the diff, so every job runs: ${String(error)}`);
    return [];
  }
}

const isPullRequest = process.env['GITHUB_EVENT_NAME'] === 'pull_request';
const files = isPullRequest ? changedFiles() : [];
const jobs = classifyChanges(files);

console.log(isPullRequest ? `Changed files:\n${files.join('\n')}` : 'Push: every job runs.');
console.log(`verify=${String(jobs.verify)} website=${String(jobs.website)}`);

const output = process.env['GITHUB_OUTPUT'];
if (output !== undefined && output !== '') {
  appendFileSync(output, `verify=${String(jobs.verify)}\nwebsite=${String(jobs.website)}\n`);
}

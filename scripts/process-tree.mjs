/**
 * Starts and stops a command together with every process it starts. Example scripts
 * run through `pnpm` and `tsx`, so the process we spawn is not the one doing the work;
 * stopping only the direct child leaves the server running and its output pipe open.
 */
import { spawn } from 'node:child_process';

/**
 * Spawns a command in its own process group, with stdout and stderr piped.
 * @param {string} command - Executable to run.
 * @param {string[]} args - Its arguments.
 * @param {{ cwd?: string, env?: NodeJS.ProcessEnv }} [options] - Working directory and environment.
 * @returns {import('node:child_process').ChildProcessByStdio<null, import('node:stream').Readable, import('node:stream').Readable>}
 */
export function spawnGroup(command, args, options = {}) {
  // A detached child leads a new process group, so stopGroup can signal all of it.
  return spawn(command, args, { ...options, detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
}

/**
 * Sends SIGTERM to the command and everything it started.
 * @param {import('node:child_process').ChildProcess} child - A process from `spawnGroup`.
 */
export function stopGroup(child) {
  if (child.pid === undefined) {
    return;
  }
  try {
    // A negative pid addresses the whole process group.
    process.kill(-child.pid, 'SIGTERM');
  } catch (error) {
    // ESRCH: the group has already exited.
    if (!(error instanceof Error && 'code' in error && error.code === 'ESRCH')) {
      throw error;
    }
  }
}

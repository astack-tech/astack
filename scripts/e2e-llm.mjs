#!/usr/bin/env node
/**
 * Runs the examples that call a real model against the DeepSeek API. CI runs it from
 * .github/workflows/e2e.yml with the DEEPSEEK_API_KEY secret; without the key it
 * stops before calling anything. Each example must exit cleanly and print output;
 * the HTTP server must stream Server-Sent Events that end with `completed`.
 *
 * Usage: DEEPSEEK_API_KEY=... node scripts/e2e-llm.mjs [example ...]
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TIMEOUT_MS = 180_000;
const CLI_EXAMPLES = ['chat', 'workflow', 'agent', 'streaming-agent', 'rlm-agent'];

if (!process.env['DEEPSEEK_API_KEY']) {
  console.error('DEEPSEEK_API_KEY is not set; the end-to-end examples need a real key.');
  process.exit(1);
}

/**
 * Starts `pnpm --filter @astack-examples/<name> start`.
 * @param {string} name - Example folder name.
 * @param {Record<string, string>} [env] - Extra environment variables.
 */
function start(name, env = {}) {
  return spawn('pnpm', ['--filter', `@astack-examples/${name}`, 'start'], {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

/**
 * Runs a command-line example to the end.
 * @param {string} name - Example folder name.
 * @returns {Promise<void>}
 */
function runCli(name) {
  return new Promise((resolve, reject) => {
    const child = start(name);
    let output = '';
    child.stdout.on('data', chunk => (output += String(chunk)));
    child.stderr.on('data', chunk => (output += String(chunk)));
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`${name}: no exit within ${String(TIMEOUT_MS / 1000)}s`));
    }, TIMEOUT_MS);
    child.on('exit', code => {
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(`${name}: exit code ${String(code)}\n${output}`));
      } else if (output.trim() === '') {
        reject(new Error(`${name}: printed nothing`));
      } else {
        console.log(`--- ${name}\n${output.trim().slice(-1500)}\n`);
        resolve();
      }
    });
  });
}

/**
 * Starts the HTTP server example, sends one request and checks the event stream.
 * @returns {Promise<void>}
 */
async function runHttpServer() {
  const port = '4317';
  const child = start('http-server', { PORT: port });
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('http-server: did not start')), 60_000);
      child.stdout.on('data', chunk => {
        if (String(chunk).includes(`localhost:${port}/chat`)) {
          clearTimeout(timer);
          resolve(undefined);
        }
      });
      child.on('exit', code => reject(new Error(`http-server: exited with ${String(code)}`)));
    });
    const response = await fetch(`http://localhost:${port}/chat`, {
      method: 'POST',
      body: 'Explain ports in one line',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.headers.get('content-type') !== 'text/event-stream') {
      throw new Error(`http-server: content-type ${String(response.headers.get('content-type'))}`);
    }
    const events = (await response.text())
      .split('\n\n')
      .filter(block => block.startsWith('data: '))
      .map(block => JSON.parse(block.slice('data: '.length)));
    const last = events.at(-1);
    if (!last || last.type !== 'completed') {
      throw new Error(`http-server: last event ${JSON.stringify(last)}`);
    }
    console.log(`--- http-server\n${String(events.length)} events, last: completed\n`);
  } finally {
    child.kill('SIGTERM');
  }
}

const selected = process.argv.slice(2);
/** @param {string} name - Example folder name. */
const wanted = name => selected.length === 0 || selected.includes(name);
/** @type {unknown[]} */
const failures = [];
for (const name of CLI_EXAMPLES.filter(wanted)) {
  await runCli(name).catch(error => failures.push(error));
}
if (wanted('http-server')) {
  await runHttpServer().catch(error => failures.push(error));
}
if (failures.length > 0) {
  for (const failure of failures) {
    console.error(String(failure));
  }
  process.exit(1);
}
console.log('All end-to-end examples passed.');

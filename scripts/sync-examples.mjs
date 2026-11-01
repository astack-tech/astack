// @ts-check
/**
 * Copies every example in `examples/` into `website/content/examples/` as JSON.
 *
 * The examples directory is the single source of truth. The website reads only the
 * generated files, so it can build without access to the rest of the repository.
 * Run `pnpm check:examples` in CI to fail when the generated files are stale.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const examplesDir = path.join(root, 'examples');
const outputDir = path.join(root, 'website', 'content', 'examples');

/**
 * @typedef {object} ExampleEntry
 * @property {string} name
 * @property {string} title
 * @property {number} order
 * @property {'basics' | 'llm' | 'advanced'} tier
 * @property {string} doc
 * @property {boolean} requiresApiKey
 * @property {string} description
 * @property {string} readme
 * @property {string} code
 */

/**
 * @param {string} message
 * @returns {never}
 */
function fail(message) {
  throw new Error(`sync-examples: ${message}`);
}

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * @param {unknown} value
 * @returns {value is ExampleEntry['tier']}
 */
function isTier(value) {
  return value === 'basics' || value === 'llm' || value === 'advanced';
}

/**
 * @param {string} name
 * @returns {ExampleEntry | undefined}
 */
function readExample(name) {
  const dir = path.join(examplesDir, name);
  const manifestPath = path.join(dir, 'package.json');
  if (!existsSync(manifestPath)) {
    return undefined;
  }

  /** @type {unknown} */
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (!isRecord(manifest)) fail(`${name}: package.json is not an object`);
  const meta = manifest['astack'];
  if (meta === undefined) {
    return undefined;
  }
  if (!isRecord(meta)) fail(`${name}: astack must be an object`);

  const { title, order, tier, doc, requiresApiKey } = meta;
  const description = manifest['description'];
  if (typeof title !== 'string' || title.length === 0) fail(`${name}: astack.title is required`);
  if (typeof order !== 'number') fail(`${name}: astack.order must be a number`);
  if (!isTier(tier)) fail(`${name}: astack.tier is invalid`);
  if (typeof doc !== 'string' || doc.length === 0) fail(`${name}: astack.doc is required`);
  if (typeof requiresApiKey !== 'boolean') fail(`${name}: astack.requiresApiKey must be boolean`);
  if (typeof description !== 'string') fail(`${name}: description is required`);

  const readmePath = path.join(dir, 'README.md');
  const codePath = path.join(dir, 'index.ts');
  if (!existsSync(readmePath)) fail(`${name}: README.md is missing`);
  if (!existsSync(codePath)) fail(`${name}: index.ts is missing`);

  return {
    name,
    title,
    order,
    tier,
    doc,
    requiresApiKey,
    description,
    readme: readFileSync(readmePath, 'utf8'),
    code: readFileSync(codePath, 'utf8'),
  };
}

const entries = readdirSync(examplesDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => readExample(entry.name))
  .filter(/** @returns {entry is ExampleEntry} */ entry => entry !== undefined)
  .sort((a, b) => a.order - b.order);

const orders = new Set(entries.map(entry => entry.order));
if (orders.size !== entries.length) {
  fail('astack.order values must be unique');
}

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

for (const entry of entries) {
  writeFileSync(path.join(outputDir, `${entry.name}.json`), `${JSON.stringify(entry, null, 2)}\n`);
}

const index = entries.map(({ name, title, order, tier, doc, requiresApiKey, description }) => ({
  name,
  title,
  order,
  tier,
  doc,
  requiresApiKey,
  description,
}));
writeFileSync(path.join(outputDir, 'index.json'), `${JSON.stringify(index, null, 2)}\n`);

// The website shows the current release, read from the core package so it never goes stale.
/** @type {{ version?: unknown }} */
const coreManifest = JSON.parse(
  readFileSync(path.join(root, 'packages', 'core', 'package.json'), 'utf8')
);
if (typeof coreManifest.version !== 'string') {
  fail('packages/core/package.json has no version');
}
writeFileSync(
  path.join(root, 'website', 'content', 'release.json'),
  `${JSON.stringify({ coreVersion: coreManifest.version }, null, 2)}\n`
);

console.log(`sync-examples: wrote ${String(entries.length)} examples to website/content/examples`);

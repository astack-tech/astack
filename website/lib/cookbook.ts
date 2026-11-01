/**
 * Examples generated from the repository's `examples/` directory by
 * `scripts/sync-examples.mjs`. Do not edit `content/examples` by hand.
 */

import fs from 'node:fs';
import path from 'node:path';

import index from '@/content/examples/index.json';

/** Learning level of an example. */
export type Tier = 'basics' | 'llm' | 'advanced';

/** Summary of an example, as listed in `index.json`. */
export interface ExampleSummary {
  name: string;
  title: string;
  order: number;
  tier: Tier;
  doc: string;
  requiresApiKey: boolean;
  description: string;
}

/** A full example with its README and source code. */
export interface Example extends ExampleSummary {
  readme: string;
  code: string;
}

export const TIERS: { id: Tier; label: string; description: string }[] = [
  { id: 'basics', label: 'Basics', description: 'Components and pipelines. Runs offline.' },
  { id: 'llm', label: 'LLM', description: 'Models, workflows and agents.' },
  { id: 'advanced', label: 'Advanced', description: 'Large contexts and serving.' },
];

function isTier(value: string): value is Tier {
  return value === 'basics' || value === 'llm' || value === 'advanced';
}

const examples: ExampleSummary[] = index.map(entry => {
  if (!isTier(entry.tier)) {
    throw new Error(`examples/${entry.name}: unknown tier '${entry.tier}'`);
  }
  return { ...entry, tier: entry.tier };
});

/** Returns every example, ordered by `order`. */
export function getAllExamples(): ExampleSummary[] {
  return examples;
}

/** Returns one example with its README and code, or `undefined`. */
export function getExample(name: string): Example | undefined {
  const summary = examples.find(example => example.name === name);
  if (summary === undefined) {
    return undefined;
  }
  const file = path.join(process.cwd(), 'content/examples', `${name}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8')) as Partial<Example>;
  if (typeof data.readme !== 'string' || typeof data.code !== 'string') {
    throw new Error(`content/examples/${name}.json is missing readme or code`);
  }
  return { ...summary, readme: data.readme, code: data.code };
}

/** Returns the examples linked to a documentation page, in learning order. */
export function getExamplesForDoc(slug: string, listed: readonly string[]): ExampleSummary[] {
  return examples.filter(example => listed.includes(example.name) || example.doc === slug);
}

/** Pads an order number to two digits, for example `03`. */
export function formatOrder(order: number): string {
  return String(order).padStart(2, '0');
}

/** README sections shown on an example page. */
export interface ReadmeParts {
  /** Diagram and "What it shows". */
  overview: string;
  /** The "Run" section, without its heading. */
  run: string;
}

/**
 * Splits an example README for the website. The title, summary, level line and
 * navigation links are dropped because the page renders them from metadata.
 * Links to astack.tech and to sibling examples become site-relative links.
 */
export function splitReadme(readme: string): ReadmeParts {
  const kept = readme
    .split('\n')
    .filter(
      line =>
        !line.startsWith('# ') &&
        !line.startsWith('**Level:**') &&
        !line.startsWith('The full program is') &&
        !line.startsWith('Next: ')
    )
    .join('\n')
    .replace(/\]\(https:\/\/astack\.tech(\/[^)]*)\)/g, ']($1)')
    .replace(/\]\(\.\.\/([a-z0-9-]+)\/?\)/g, '](/examples/$1)');

  const [beforeRun = '', afterRun = ''] = kept.split(/^## Run\s*$/m);
  // The first paragraph is the summary, which the page header already shows.
  const overview = beforeRun.trim().replace(/^[^\n]+\n+/, '');
  return { overview: overview.trim(), run: afterRun.trim() };
}

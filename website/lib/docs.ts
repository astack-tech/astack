/**
 * Documentation pages stored as markdown in `content/docs`.
 */

import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

const docsDirectory = path.join(process.cwd(), 'content/docs');

/** Front matter and body of one documentation page. */
export interface DocPage {
  slug: string;
  title: string;
  description: string;
  order: number;
  /** Example names linked from this page. */
  examples: string[];
  content: string;
}

function asString(value: unknown, field: string, slug: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`docs/${slug}.md: '${field}' must be a non-empty string`);
  }
  return value;
}

function readDoc(slug: string): DocPage {
  const raw = fs.readFileSync(path.join(docsDirectory, `${slug}.md`), 'utf8');
  const { data, content } = matter(raw) as { data: Record<string, unknown>; content: string };
  const { order, examples } = data;
  if (typeof order !== 'number') {
    throw new Error(`docs/${slug}.md: 'order' must be a number`);
  }
  const exampleNames = Array.isArray(examples)
    ? examples.filter((name): name is string => typeof name === 'string')
    : [];
  return {
    slug,
    title: asString(data['title'], 'title', slug),
    description: asString(data['description'], 'description', slug),
    order,
    examples: exampleNames,
    content,
  };
}

/** Returns every documentation page, ordered by `order`. */
export function getAllDocs(): DocPage[] {
  return fs
    .readdirSync(docsDirectory)
    .filter(file => file.endsWith('.md'))
    .map(file => readDoc(file.replace(/\.md$/, '')))
    .sort((a, b) => a.order - b.order);
}

/** Returns one documentation page, or `undefined` when it does not exist. */
export function getDoc(slug: string): DocPage | undefined {
  return getAllDocs().find(doc => doc.slug === slug);
}

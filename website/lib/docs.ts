/**
 * Documentation pages stored as markdown in `content/docs`.
 */

import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

import type { Locale } from './i18n';

const docsRoot = path.join(process.cwd(), 'content/docs');

/** English pages live in content/docs; translations in content/docs/<locale>. */
function docsDirectory(locale: Locale): string {
  return locale === 'en' ? docsRoot : path.join(docsRoot, locale);
}

/** Front matter and body of one documentation page. */
export interface DocPage {
  slug: string;
  title: string;
  description: string;
  order: number;
  /** Example names linked from this page. */
  examples: string[];
  /** API reference paths linked from this page, for example `core/classes/Pipeline`. */
  api: string[];
  /** For a translation: the SHA-256 of the English file it was translated from. */
  source?: string | undefined;
  content: string;
}

function asString(value: unknown, field: string, slug: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`docs/${slug}.md: '${field}' must be a non-empty string`);
  }
  return value;
}

function readDoc(slug: string, locale: Locale): DocPage {
  const raw = fs.readFileSync(path.join(docsDirectory(locale), `${slug}.md`), 'utf8');
  const { data, content } = matter(raw) as { data: Record<string, unknown>; content: string };
  const { order, examples, api } = data;
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
    api: Array.isArray(api) ? api.filter((entry): entry is string => typeof entry === 'string') : [],
    ...(typeof data['source'] === 'string' ? { source: data['source'] } : {}),
    content,
  };
}

/** Returns every documentation page of a locale, ordered by `order`. */
export function getAllDocs(locale: Locale = 'en'): DocPage[] {
  const directory = docsDirectory(locale);
  if (!fs.existsSync(directory)) {
    return [];
  }
  return fs
    .readdirSync(directory)
    .filter(file => file.endsWith('.md'))
    .map(file => readDoc(file.replace(/\.md$/, ''), locale))
    .sort((a, b) => a.order - b.order);
}

/** Returns one documentation page, or `undefined` when it does not exist. */
export function getDoc(slug: string, locale: Locale = 'en'): DocPage | undefined {
  return getAllDocs(locale).find(doc => doc.slug === slug);
}

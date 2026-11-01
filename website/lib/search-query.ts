import type { SearchEntry, SearchKind } from './search';

export const KINDS: SearchKind[] = ['Docs', 'API', 'Examples', 'Blog'];
export const KIND_HUE: Record<SearchKind, string> = {
  Docs: 'blue',
  API: 'silver',
  Examples: 'amber',
  Blog: 'rose',
};
export const PER_GROUP = 6;
/** Shown before the visitor types: the pages most people look for. */
export const SUGGESTED = [
  '/docs/getting-started',
  '/docs/components',
  '/docs/pipelines',
  '/docs/agents',
  '/docs/streaming',
  '/docs/api',
];

/** Splits a query into lowercase words. */
export function tokenize(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

/**
 * Every query word must appear in the entry. A word in the title counts most (more at
 * the start of the title or of a word), then in the parent page, then in the text.
 */
export function score(entry: SearchEntry, tokens: string[]): number | null {
  const title = entry.title.toLowerCase();
  const parent = (entry.parent ?? '').toLowerCase();
  const text = entry.text.toLowerCase();
  let total = 0;
  for (const token of tokens) {
    if (title === token) {
      total += 100;
    } else if (title.startsWith(token)) {
      total += 60;
    } else if (new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(title)) {
      total += 40;
    } else if (title.includes(token)) {
      total += 25;
    } else if (parent.includes(token)) {
      total += 12;
    } else if (text.includes(token)) {
      total += 6;
    } else {
      return null;
    }
  }
  // A whole page ranks above one of its sections with the same score.
  return entry.parent === undefined ? total + 2 : total;
}

export interface Group {
  kind: SearchKind;
  entries: SearchEntry[];
}

/** Matches the query against the index and groups the results by kind. */
export function search(index: SearchEntry[], query: string): Group[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    const suggested = SUGGESTED.map(url => index.find(entry => entry.url === url)).filter(
      (entry): entry is SearchEntry => entry !== undefined
    );
    return suggested.length > 0 ? [{ kind: 'Docs', entries: suggested }] : [];
  }
  const scored = index
    .map(entry => ({ entry, value: score(entry, tokens) }))
    .filter((item): item is { entry: SearchEntry; value: number } => item.value !== null)
    .sort((a, b) => b.value - a.value);
  // Groups follow their best match, so an exact API name comes before docs prose.
  return KINDS.map(kind => {
    const items = scored.filter(item => item.entry.kind === kind).slice(0, PER_GROUP);
    return { kind, best: items[0]?.value ?? 0, entries: items.map(item => item.entry) };
  })
    .filter(group => group.entries.length > 0)
    .sort((a, b) => b.best - a.best)
    .map(({ kind, entries }) => ({ kind, entries }));
}


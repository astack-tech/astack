import { describe, expect, it } from 'vitest';

import type { SearchEntry } from '../search';
import { search, score, tokenize } from '../search-query';

const entry = (over: Partial<SearchEntry>): SearchEntry => ({
  kind: 'Docs',
  title: 'Untitled',
  url: '/x',
  text: '',
  ...over,
});

const INDEX: SearchEntry[] = [
  entry({ title: 'Getting started', url: '/docs/getting-started', text: 'Install AStack.' }),
  entry({ title: 'Pipelines', url: '/docs/pipelines', text: 'Connect components into a graph.' }),
  entry({ title: 'Running', parent: 'Pipelines', url: '/docs/pipelines#running', text: 'run()' }),
  entry({ kind: 'API', title: 'createTool', parent: 'Function', url: '/docs/api/tools/functions/createTool', text: 'Creates a tool.' }),
  entry({ kind: 'Examples', title: 'Routing', url: '/examples/routing', text: 'Named output ports.' }),
  entry({ kind: 'Blog', title: 'Implementing RLM', url: '/blog/rlm', text: 'Recursive models.' }),
];

describe('tokenize', () => {
  it('splits on whitespace and lowercases', () => {
    expect(tokenize('  Pipe   RUN ')).toEqual(['pipe', 'run']);
    expect(tokenize('   ')).toEqual([]);
  });
});

describe('score', () => {
  it('ranks title matches above parent and text matches', () => {
    const exact = score(entry({ title: 'run' }), ['run']);
    const prefix = score(entry({ title: 'running' }), ['run']);
    const word = score(entry({ title: 'pipeline run loop' }), ['run']);
    const inner = score(entry({ title: 'overrun' }), ['run']);
    const parent = score(entry({ title: 'x', parent: 'run' }), ['run']);
    const text = score(entry({ title: 'x', parent: 'y', text: 'run' }), ['run']);
    const ranks = [exact, prefix, word, inner, parent, text].map(value => value ?? -1);
    expect(ranks).toEqual([...ranks].sort((a, b) => b - a));
    expect(new Set(ranks).size).toBe(ranks.length);
  });

  it('requires every word to match', () => {
    expect(score(entry({ title: 'Pipelines' }), ['pipe', 'zebra'])).toBeNull();
  });

  it('treats regular expression characters as text', () => {
    expect(score(entry({ title: 'run()' }), ['run(', '('])).not.toBeNull();
  });

  it('ranks a whole page above one of its sections', () => {
    const page = score(entry({ title: 'Agents' }), ['agents']) ?? 0;
    const section = score(entry({ title: 'Agents', parent: 'Docs' }), ['agents']) ?? 0;
    expect(page).toBeGreaterThan(section);
  });
});

describe('search', () => {
  it('suggests the main pages before the visitor types', () => {
    const groups = search(INDEX, '');
    expect(groups).toHaveLength(1);
    expect(groups[0]?.entries.map(item => item.url)).toEqual(['/docs/getting-started', '/docs/pipelines']);
  });

  it('groups results by kind, best group first', () => {
    const groups = search(INDEX, 'createtool');
    expect(groups.map(group => group.kind)).toEqual(['API']);
    const mixed = search(INDEX, 'routing');
    expect(mixed[0]?.kind).toBe('Examples');
  });

  it('finds sections by their page', () => {
    const urls = search(INDEX, 'pipelines').flatMap(group => group.entries.map(item => item.url));
    expect(urls).toEqual(['/docs/pipelines', '/docs/pipelines#running']);
  });

  it('returns nothing when no entry matches', () => {
    expect(search(INDEX, 'zebra')).toEqual([]);
  });
});

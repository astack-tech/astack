import { describe, expect, it } from 'vitest';

import { getAllDocs } from '../docs';
import { LOCALES, docsPath } from '../i18n';
import { renderMarkdown } from '../markdown';
import { buildSearchIndex } from '../search';

describe('the search index', () => {
  const index = buildSearchIndex();

  it('covers docs, the API reference, examples and the blog', () => {
    const kinds = new Set(index.map(item => item.kind));
    expect([...kinds].sort()).toEqual(['API', 'Blog', 'Docs', 'Examples']);
  });

  it('points every docs section at an anchor the rendered page has', async () => {
    const ids = new Map<string, Set<string>>();
    for (const locale of LOCALES) {
      for (const doc of getAllDocs(locale)) {
        const html = await renderMarkdown(doc.content);
        ids.set(
          docsPath(locale, doc.slug),
          new Set([...html.matchAll(/ id="([^"]+)"/g)].map(m => m[1] ?? ''))
        );
      }
    }
    const sections = index.filter(item => item.kind === 'Docs' && item.url.includes('#'));
    expect(sections.length).toBeGreaterThan(10);
    for (const section of sections) {
      const [page = '', anchor = ''] = section.url.split('#');
      expect(ids.get(page)?.has(decodeURIComponent(anchor)), section.url).toBe(true);
    }
  });

  it('stores plain text without markdown or table syntax', () => {
    for (const item of index) {
      expect(item.text, item.url).not.toMatch(/```|\|\s*---|\]\(/);
      expect(item.text.length, item.url).toBeLessThanOrEqual(221);
    }
  });
});

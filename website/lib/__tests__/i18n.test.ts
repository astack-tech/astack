import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { LANGUAGE_TAG, LOCALES, docsPath, labels, otherLocale } from '../i18n';
import { getAllDocs } from '../docs';
import { renderMarkdown, slugify } from '../markdown';
import { buildSearchIndex } from '../search';
import { search } from '../search-query';

const sha256 = (text: string) => createHash('sha256').update(text).digest('hex');
const headings = (markdown: string) => [...markdown.matchAll(/^## (.+)$/gm)].length;

describe('slugify', () => {
  it('keeps English anchors unchanged', () => {
    expect(slugify('How AStack compares')).toBe('how-astack-compares');
    expect(slugify('<code>run()</code> and ports')).toBe('run-and-ports');
  });

  it('keeps Chinese headings readable instead of emptying them', () => {
    // Chinese text is built from code points: source files are English only.
    const run = String.fromCodePoint(0x8FD0, 0x884C, 0x7BA1, 0x9053);
    expect(slugify(run)).toBe(run);
    const vs = String.fromCodePoint(0x4E0E);
    const contrast = String.fromCodePoint(0x5BF9, 0x6BD4);
    expect(slugify(`${vs} PocketFlow ${contrast}`)).toBe(`${vs}-pocketflow-${contrast}`);
  });
});

describe('locales', () => {
  it('builds docs paths per locale', () => {
    expect(docsPath('en', 'agents')).toBe('/docs/agents');
    expect(docsPath('zh', 'agents')).toBe('/zh/docs/agents');
  });

  it('switches between the two languages', () => {
    expect(otherLocale('en')).toBe('zh');
    expect(otherLocale('zh')).toBe('en');
    expect(LANGUAGE_TAG.zh).toBe('zh-CN');
  });

  it('has every label in every locale', () => {
    const keys = Object.keys(labels('en')).sort();
    for (const locale of LOCALES) {
      expect(Object.keys(labels(locale)).sort()).toEqual(keys);
    }
  });
});

describe('Chinese docs', () => {
  const english = getAllDocs('en');
  const chinese = getAllDocs('zh');

  it('translate every English page', () => {
    expect(chinese.map(doc => doc.slug).sort()).toEqual(english.map(doc => doc.slug).sort());
  });

  it('record the English text they translate, so a change to it fails here', () => {
    for (const doc of chinese) {
      const source = fs.readFileSync(path.join(process.cwd(), 'content/docs', `${doc.slug}.md`), 'utf8');
      expect(doc.source, `${doc.slug}: update the translation, then its source hash`).toBe(
        sha256(source)
      );
    }
  });

  it('keep the structure of the English page', () => {
    for (const doc of chinese) {
      const original = english.find(item => item.slug === doc.slug);
      expect(original).toBeDefined();
      expect(doc.order).toBe(original?.order);
      expect(doc.examples).toEqual(original?.examples);
      expect(doc.api).toEqual(original?.api);
      expect(headings(doc.content), doc.slug).toBe(headings(original?.content ?? ''));
    }
  });

  it('give every section an anchor the search index points at', async () => {
    const index = buildSearchIndex();
    for (const doc of chinese) {
      const html = await renderMarkdown(doc.content);
      const ids = new Set([...html.matchAll(/ id="([^"]+)"/g)].map(match => match[1] ?? ''));
      const sections = index.filter(item => item.url.startsWith(`${docsPath('zh', doc.slug)}#`));
      expect(sections.length, doc.slug).toBe(headings(doc.content));
      for (const section of sections) {
        const anchor = decodeURIComponent(section.url.split('#')[1] ?? '');
        expect(anchor.length, section.url).toBeGreaterThan(0);
        expect(ids.has(anchor), section.url).toBe(true);
      }
    }
  });

  it('can be found by a Chinese query', () => {
    // "pipeline" in Chinese, built from code points.
    const query = String.fromCodePoint(0x7ba1, 0x9053);
    const urls = search(buildSearchIndex(), query).flatMap(group => group.entries.map(e => e.url));
    expect(urls).toContain(docsPath('zh', 'pipelines'));
  });
});

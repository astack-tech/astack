import { apiHref, getAllApiPages } from './api-docs';
import { getAllPosts } from './blog';
import { getAllExamples } from './cookbook';
import { getAllDocs } from './docs';
import { LOCALES, docsPath } from './i18n';
import type { Locale } from './i18n';
import { slugify } from './markdown';

/** What a search result points at. The order is the order of result groups. */
export type SearchKind = 'Docs' | 'API' | 'Examples' | 'Blog';

export interface SearchEntry {
  kind: SearchKind;
  title: string;
  /** The page a section belongs to, or the package of an API page. */
  parent?: string;
  url: string;
  /** Plain text the entry is found by, shortened for display. */
  text: string;
}

const MAX_TEXT = 220;

/** Removes markdown syntax, so the text reads as plain prose. */
function plain(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/:?-{3,}:?/g, ' ')
    .replace(/[`*_]/g, '')
    .replace(/[>#|]/g, ' ')
    .replace(/^\s*[-+]\s+/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function shorten(text: string): string {
  return text.length <= MAX_TEXT ? text : `${text.slice(0, MAX_TEXT).replace(/\s\S*$/, '')}…`;
}

/** Splits a docs page at its `##` headings: one entry for the page, one per section. */
function docEntries(locale: Locale): SearchEntry[] {
  return getAllDocs(locale).flatMap(doc => {
    const url = docsPath(locale, doc.slug);
    const [intro = '', ...sections] = doc.content.split(/^## /m);
    const page: SearchEntry = {
      kind: 'Docs',
      title: doc.title,
      url,
      text: shorten(plain(`${doc.description} ${intro}`)),
    };
    return [
      page,
      ...sections.map((section): SearchEntry => {
        const [heading = '', ...body] = section.split('\n');
        const title = heading.replace(/`/g, '').trim();
        return {
          kind: 'Docs',
          title,
          parent: doc.title,
          url: `${url}#${slugify(title)}`,
          text: shorten(plain(body.join('\n'))),
        };
      }),
    ];
  });
}

/** Builds the search index for the whole site. */
export function buildSearchIndex(): SearchEntry[] {
  return [
    ...LOCALES.flatMap(docEntries),
    ...getAllApiPages().map((page): SearchEntry => ({
      kind: 'API',
      title: page.kind === 'Package' ? `@astack-tech/${page.pkg}` : page.title,
      parent: page.kind === 'Package' ? 'Package' : `${page.kind} · @astack-tech/${page.pkg}`,
      url: apiHref(page.segments),
      text: shorten(plain(page.summary)),
    })),
    ...getAllExamples().map((example): SearchEntry => ({
      kind: 'Examples',
      title: example.title,
      url: `/examples/${example.name}`,
      text: example.description,
    })),
    ...getAllPosts().map((post): SearchEntry => ({
      kind: 'Blog',
      title: post.title,
      url: `/blog/${post.slug}`,
      text: shorten(post.excerpt),
    })),
  ];
}

import { apiHref, getAllApiPages } from './api-docs';
import { getAllPosts } from './blog';
import { getAllExamples } from './cookbook';
import { getAllDocs } from './docs';
import { slugify } from './markdown';

/** What a search result points at. The order is the order of result groups. */
export const SEARCH_KINDS = ['Docs', 'API', 'Examples', 'Blog'] as const;
export type SearchKind = (typeof SEARCH_KINDS)[number];

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
function docEntries(): SearchEntry[] {
  return getAllDocs().flatMap(doc => {
    const url = `/docs/${doc.slug}`;
    const [intro = '', ...sections] = doc.content.split(/^## /m);
    const page: SearchEntry = {
      kind: 'Docs',
      title: doc.title,
      url,
      text: shorten(plain(`${doc.description} ${intro}`)),
    };
    return [
      page,
      ...sections.map(section => {
        const [heading = '', ...body] = section.split('\n');
        const title = heading.replace(/`/g, '').trim();
        return {
          kind: 'Docs' as const,
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
    ...docEntries(),
    ...getAllApiPages().map(page => ({
      kind: 'API' as const,
      title: page.kind === 'Package' ? `@astack-tech/${page.pkg}` : page.title,
      parent: page.kind === 'Package' ? 'Package' : `${page.kind} · @astack-tech/${page.pkg}`,
      url: apiHref(page.segments),
      text: shorten(plain(page.summary)),
    })),
    ...getAllExamples().map(example => ({
      kind: 'Examples' as const,
      title: example.title,
      url: `/examples/${example.name}`,
      text: example.description,
    })),
    ...getAllPosts().map(post => ({
      kind: 'Blog' as const,
      title: post.title,
      url: `/blog/${post.slug}`,
      text: shorten(post.excerpt),
    })),
  ];
}

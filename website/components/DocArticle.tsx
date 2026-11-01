import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Breadcrumb from '@/components/Breadcrumb';
import DocsNav from '@/components/DocsNav';
import ExampleCard from '@/components/ExampleCard';
import Footer from '@/components/Footer';
import InlineCode from '@/components/InlineCode';
import Navbar from '@/components/Navbar';
import PagerLinks from '@/components/PagerLinks';
import RichContent from '@/components/RichContent';
import Toc from '@/components/Toc';
import { apiHref, getApiPage } from '@/lib/api-docs';
import { getExamplesForDoc } from '@/lib/cookbook';
import { getAllDocs, getDoc } from '@/lib/docs';
import { LANGUAGE_TAG, docsPath, labels, otherLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { renderMarkdown, slugify } from '@/lib/markdown';

const SITE = 'https://astack.tech';

/** Metadata of a docs page in one locale, with links to the page in every locale. */
export function docMetadata(slug: string, locale: Locale): Metadata {
  const doc = getDoc(slug, locale);
  if (!doc) {
    return { title: 'Page not found' };
  }
  const text = labels(locale);
  const translated = getDoc(slug, otherLocale(locale)) !== undefined;
  return {
    title: `${doc.title} · ${text.docsTitleSuffix}`,
    description: doc.description,
    alternates: {
      canonical: `${SITE}${docsPath(locale, slug)}`,
      ...(translated
        ? {
            languages: {
              [LANGUAGE_TAG.en]: `${SITE}${docsPath('en', slug)}`,
              [LANGUAGE_TAG.zh]: `${SITE}${docsPath('zh', slug)}`,
            },
          }
        : {}),
    },
    openGraph: { title: `${doc.title} · ${text.docsSiteName}`, description: doc.description },
    twitter: { title: `${doc.title} · ${text.docsSiteName}`, description: doc.description },
  };
}

/** One docs page: navigation, article, related examples and API pages, and contents. */
export default async function DocArticle({ slug, locale }: { slug: string; locale: Locale }) {
  const docs = getAllDocs(locale);
  const index = docs.findIndex(doc => doc.slug === slug);
  const doc = docs[index];
  if (!doc) {
    notFound();
  }
  const text = labels(locale);
  const other = otherLocale(locale);
  const counterpart = getDoc(slug, other);

  const html = await renderMarkdown(doc.content);
  const headings = [...doc.content.matchAll(/^## (.+)$/gm)].map(match => {
    const heading = (match[1] ?? '').replace(/`/g, '');
    return { text: heading, id: slugify(heading) };
  });
  const examples = getExamplesForDoc(doc.slug, doc.examples);
  const apiPages = doc.api.map(entry => {
    const page = getApiPage(entry.split('/'));
    if (!page) {
      throw new Error(`docs/${doc.slug}.md: api entry '${entry}' does not exist`);
    }
    return page;
  });
  const previous = docs[index - 1];
  const next = docs[index + 1];

  return (
    <>
      <Navbar />
      <main id="main-content" className="docs frame" lang={LANGUAGE_TAG[locale]}>
        <DocsNav docs={docs} current={doc.slug} locale={locale} />
        <article className="docs-main">
          <header className="docs-head">
            <div className="docs-head-bar">
              <Breadcrumb
                label={text.breadcrumb}
                items={[
                  { label: text.home, href: '/' },
                  { label: text.docs, href: docsPath(locale, docs[0]?.slug ?? slug) },
                  { label: doc.title },
                ]}
              />
              {counterpart && (
                <Link
                  className="chip docs-language"
                  href={docsPath(other, slug)}
                  hrefLang={LANGUAGE_TAG[other]}
                  lang={LANGUAGE_TAG[other]}
                  aria-label={text.switchLanguageLabel}
                >
                  {text.switchLanguage}
                </Link>
              )}
            </div>
            <h1>{doc.title}</h1>
            <p>{doc.description}</p>
          </header>
          <RichContent className="article-content" html={html} />
          {examples.length > 0 && (
            <section className="docs-related" aria-labelledby="docs-examples-title">
              <h2 id="docs-examples-title">{text.examplesForPage}</h2>
              <div className="board related-examples" lang="en">
                {examples.map(example => (
                  <ExampleCard key={example.name} example={example} />
                ))}
              </div>
            </section>
          )}
          {apiPages.length > 0 && (
            <section className="docs-related" aria-labelledby="docs-api-title">
              <h2 id="docs-api-title">{text.apiReference}</h2>
              <ul className="api-list" lang="en">
                {apiPages.map(page => (
                  <li key={page.segments.join('/')}>
                    <Link className="tile api-item" href={apiHref(page.segments)}>
                      <code>{page.title}</code>
                      {page.summary && (
                        <span>
                          <InlineCode text={page.summary} />
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <PagerLinks
            label={text.pagerLabel}
            previousLabel={text.previous}
            nextLabel={text.next}
            previous={previous ? { href: docsPath(locale, previous.slug), title: previous.title } : undefined}
            next={next ? { href: docsPath(locale, next.slug), title: next.title } : undefined}
          />
        </article>
        {headings.length > 1 ? (
          <Toc headings={headings} title={text.onThisPage} />
        ) : (
          <div aria-hidden="true" />
        )}
      </main>
      <Footer />
    </>
  );
}

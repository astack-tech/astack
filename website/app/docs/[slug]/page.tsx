import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Breadcrumb from '@/components/Breadcrumb';
import DocsNav from '@/components/DocsNav';
import ExampleCard from '@/components/ExampleCard';
import InlineCode from '@/components/InlineCode';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import PagerLinks from '@/components/PagerLinks';
import RichContent from '@/components/RichContent';
import Toc from '@/components/Toc';
import { apiHref, getApiPage } from '@/lib/api-docs';
import { getExamplesForDoc } from '@/lib/cookbook';
import { getAllDocs, getDoc } from '@/lib/docs';
import { renderMarkdown, slugify } from '@/lib/markdown';

interface DocPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return getAllDocs().map(doc => ({ slug: doc.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) {
    return { title: 'Page not found' };
  }
  return {
    title: `${doc.title} · Docs`,
    description: doc.description,
    alternates: { canonical: `https://astack.tech/docs/${slug}` },
    openGraph: {
      title: `${doc.title} · AStack docs`,
      description: doc.description,
    },
    twitter: {
      title: `${doc.title} · AStack docs`,
      description: doc.description,
    },
  };
}

export default async function DocPageRoute({ params }: DocPageProps) {
  const { slug } = await params;
  const docs = getAllDocs();
  const index = docs.findIndex(doc => doc.slug === slug);
  const doc = docs[index];
  if (!doc) {
    notFound();
  }

  const html = await renderMarkdown(doc.content);
  const headings = [...doc.content.matchAll(/^## (.+)$/gm)].map(match => {
    const text = match[1] ?? '';
    return { text: text.replace(/`/g, ''), id: slugify(text.replace(/`/g, '')) };
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
      <main id="main-content" className="docs frame">
        <DocsNav docs={docs} current={doc.slug} />
        <article className="docs-main">
          <header className="docs-head">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Docs', href: '/docs' },
                { label: doc.title },
              ]}
            />
            <h1>{doc.title}</h1>
            <p>{doc.description}</p>
          </header>
          <RichContent className="article-content" html={html} />
          {examples.length > 0 && (
            <section className="docs-related" aria-labelledby="docs-examples-title">
              <h2 id="docs-examples-title">Examples for this page</h2>
              <div className="board related-examples">
                {examples.map(example => (
                  <ExampleCard key={example.name} example={example} />
                ))}
              </div>
            </section>
          )}
          {apiPages.length > 0 && (
            <section className="docs-related" aria-labelledby="docs-api-title">
              <h2 id="docs-api-title">API reference</h2>
              <ul className="api-list">
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
            label="Documentation pages"
            previous={
              previous ? { href: `/docs/${previous.slug}`, title: previous.title } : undefined
            }
            next={next ? { href: `/docs/${next.slug}`, title: next.title } : undefined}
          />
        </article>
        {headings.length > 1 ? <Toc headings={headings} /> : <div aria-hidden="true" />}
      </main>
      <Footer />
    </>
  );
}

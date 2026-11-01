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
      <main id="main-content" className="docs-page shell">
        <DocsNav docs={docs} current={doc.slug} />
        <article className="docs-article">
          <header className="docs-heading">
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
          <RichContent className="prose article-content docs-content" html={html} />
          {examples.length > 0 && (
            <section className="docs-examples" aria-labelledby="docs-examples-title">
              <p className="eyebrow">RUN IT</p>
              <h2 id="docs-examples-title">Examples for this page</h2>
              <div className="cookbook-grid">
                {examples.map(example => (
                  <ExampleCard key={example.name} example={example} />
                ))}
              </div>
            </section>
          )}
          {apiPages.length > 0 && (
            <nav className="api-members docs-api-links" aria-labelledby="docs-api-title">
              <section>
                <h2 id="docs-api-title">API reference</h2>
                <ul>
                  {apiPages.map(page => (
                    <li key={page.segments.join('/')}>
                      <Link href={apiHref(page.segments)}>
                        <span className="mono">{page.title}</span>
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
            </nav>
          )}
          <PagerLinks
            label="Documentation pages"
            previous={
              previous ? { href: `/docs/${previous.slug}`, title: previous.title } : undefined
            }
            next={next ? { href: `/docs/${next.slug}`, title: next.title } : undefined}
          />
        </article>
        {headings.length > 1 && (
          <aside className="docs-toc" aria-label="On this page">
            <p className="eyebrow">ON THIS PAGE</p>
            <ol>
              {headings.map(heading => (
                <li key={heading.id}>
                  <a href={`#${heading.id}`}>{heading.text}</a>
                </li>
              ))}
            </ol>
          </aside>
        )}
      </main>
      <Footer />
    </>
  );
}

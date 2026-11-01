import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRightIcon, BookOpenTextIcon, KeyIcon } from '@phosphor-icons/react/dist/ssr';

import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import PagerLinks from '@/components/PagerLinks';
import RichContent from '@/components/RichContent';
import { TIERS, formatOrder, getAllExamples, getExample, splitReadme } from '@/lib/cookbook';
import { getDoc } from '@/lib/docs';
import { renderMarkdown } from '@/lib/markdown';

interface ExamplePageProps {
  params: Promise<{ name: string }>;
}

const SOURCE_ROOT = 'https://github.com/astack-tech/astack/tree/master/examples';

export function generateStaticParams(): { name: string }[] {
  return getAllExamples().map(example => ({ name: example.name }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: ExamplePageProps): Promise<Metadata> {
  const { name } = await params;
  const example = getExample(name);
  if (!example) {
    return { title: 'Example not found' };
  }
  return {
    title: `${example.title} · Examples`,
    description: example.description,
    alternates: { canonical: `https://astack.tech/examples/${name}` },
    openGraph: {
      title: `${example.title} · AStack examples`,
      description: example.description,
    },
    twitter: {
      title: `${example.title} · AStack examples`,
      description: example.description,
    },
  };
}

export default async function ExamplePage({ params }: ExamplePageProps) {
  const { name } = await params;
  const example = getExample(name);
  if (!example) {
    notFound();
  }

  const all = getAllExamples();
  const position = all.findIndex(item => item.name === name);
  const previous = all[position - 1];
  const next = all[position + 1];
  const concept = getDoc(example.doc);
  const tier = TIERS.find(item => item.id === example.tier);
  const { overview, run } = splitReadme(example.readme);

  const [overviewHtml, codeHtml, runHtml] = await Promise.all([
    renderMarkdown(overview),
    renderMarkdown(`\`\`\`typescript\n${example.code}\`\`\``, { headingIds: false }),
    renderMarkdown(run, { headingIds: false }),
  ]);

  return (
    <>
      <Navbar />
      <main id="main-content" className="example-page shell">
        <header className="example-heading">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Examples', href: '/examples' },
              { label: example.title },
            ]}
          />
          <div className="example-meta">
            <span className="cookbook-order mono">{formatOrder(example.order)}</span>
            <span>{tier?.label ?? example.tier}</span>
            {example.requiresApiKey ? (
              <span className="cookbook-badge">
                <KeyIcon size={12} weight="bold" /> DEEPSEEK_API_KEY
              </span>
            ) : (
              <span className="cookbook-badge cookbook-badge-quiet">Runs offline</span>
            )}
          </div>
          <h1>{example.title}</h1>
          <p>{example.description}</p>
        </header>

        <div className="example-body">
          <RichContent className="prose article-content example-overview" html={overviewHtml} />

          <section className="example-code" aria-labelledby="code">
            <div className="example-section-title">
              <h2 id="code">The program</h2>
              <span className="mono">examples/{example.name}/index.ts</span>
            </div>
            <RichContent className="article-content example-source" html={codeHtml} />
          </section>

          <section className="example-run" aria-labelledby="run">
            <h2 id="run">Run it</h2>
            <RichContent className="prose article-content" html={runHtml} />
          </section>

          {concept && (
            <Link className="example-concept" href={`/docs/${concept.slug}`}>
              <BookOpenTextIcon size={22} weight="duotone" />
              <span>
                <span className="eyebrow">CONCEPT</span>
                <b>{concept.title}</b>
                <span>{concept.description}</span>
              </span>
            </Link>
          )}

          <a className="text-link example-source-link" href={`${SOURCE_ROOT}/${example.name}`}>
            View the folder on GitHub <ArrowUpRightIcon size={13} />
          </a>

          <PagerLinks
            label="Examples"
            previous={
              previous ? { href: `/examples/${previous.name}`, title: previous.title } : undefined
            }
            next={next ? { href: `/examples/${next.name}`, title: next.title } : undefined}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

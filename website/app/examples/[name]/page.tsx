import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRightIcon, BookOpenTextIcon, KeyIcon } from '@phosphor-icons/react/dist/ssr';

import Breadcrumb from '@/components/Breadcrumb';
import { TIER_HUE } from '@/components/ExampleCard';
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
      <main id="main-content" className="frame example-page">
        <header className="page-head example-head">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Examples', href: '/examples' },
              { label: example.title },
            ]}
          />
          <div className="board">
            <div className="tile example-title-tile">
              <p className="example-meta">
                <span className={`example-order block hue-${TIER_HUE[example.tier]}`}>
                  {formatOrder(example.order)}
                </span>
                <span>{tier?.label ?? example.tier}</span>
                {example.requiresApiKey ? (
                  <span className="chip">
                    <KeyIcon size={12} weight="bold" aria-hidden="true" /> DEEPSEEK_API_KEY
                  </span>
                ) : (
                  <span className="chip">Runs offline</span>
                )}
              </p>
              <h1>{example.title}</h1>
              <p className="example-lead">{example.description}</p>
            </div>
          </div>
        </header>

        <div className="example-layout">
        <div className="example-body">
          <RichContent className="article-content example-overview" html={overviewHtml} />

          <section className="example-section" aria-labelledby="code">
            <div className="example-section-head">
              <h2 id="code">The program</h2>
              <code>examples/{example.name}/index.ts</code>
            </div>
            <RichContent className="article-content" html={codeHtml} />
          </section>

          <section className="example-section" aria-labelledby="run">
            <div className="example-section-head">
              <h2 id="run">Run it</h2>
            </div>
            <RichContent className="article-content" html={runHtml} />
          </section>

          <PagerLinks
            label="Examples"
            previous={
              previous ? { href: `/examples/${previous.name}`, title: previous.title } : undefined
            }
            next={next ? { href: `/examples/${next.name}`, title: next.title } : undefined}
          />
        </div>
        <aside className="example-aside" aria-label="About this example">
          {concept && (
            <Link className="tile example-concept" href={`/docs/${concept.slug}`}>
              <span className="example-concept-kicker">
                <BookOpenTextIcon size={16} aria-hidden="true" /> Concept
              </span>
              <span className="example-concept-title">{concept.title}</span>
              <span>{concept.description}</span>
            </Link>
          )}
          <a className="tile example-source" href={`${SOURCE_ROOT}/${example.name}`}>
            <span>View the folder on GitHub</span>
            <ArrowUpRightIcon size={16} aria-hidden="true" />
          </a>
        </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

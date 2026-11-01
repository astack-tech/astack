import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr';

import Breadcrumb from '@/components/Breadcrumb';
import ExampleCard from '@/components/ExampleCard';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { TIERS, getAllExamples } from '@/lib/cookbook';

export const metadata: Metadata = {
  title: 'Examples',
  description:
    'Short, runnable AStack examples. Each one shows one idea, from a single component to a streaming agent server.',
  alternates: { canonical: 'https://astack.tech/examples' },
};

export default function ExamplesPage() {
  const examples = getAllExamples();
  return (
    <>
      <Navbar />
      <main id="main-content" className="cookbook-page shell">
        <header className="cookbook-heading">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Examples' }]} />
          <p className="eyebrow">COOKBOOK</p>
          <h1>
            One idea per file.
            <span> Read them in order.</span>
          </h1>
          <p>
            Every example is a single <code>index.ts</code> that uses only what the earlier examples
            introduced. The code on these pages is the code in the repository.
          </p>
          <div className="cookbook-heading-actions">
            <Link className="button-primary" href="/examples/component">
              Start with example 01 <ArrowRightIcon size={16} />
            </Link>
            <Link className="text-link" href="/docs/getting-started">
              Read the docs first
            </Link>
          </div>
        </header>
        {TIERS.map(tier => {
          const items = examples.filter(example => example.tier === tier.id);
          if (items.length === 0) {
            return null;
          }
          return (
            <section key={tier.id} className="cookbook-tier" aria-labelledby={`tier-${tier.id}`}>
              <div className="cookbook-tier-heading">
                <h2 id={`tier-${tier.id}`}>{tier.label}</h2>
                <p>{tier.description}</p>
              </div>
              <div className="cookbook-grid">
                {items.map(example => (
                  <ExampleCard key={example.name} example={example} />
                ))}
              </div>
            </section>
          );
        })}
        <section className="cookbook-run" aria-labelledby="cookbook-run-title">
          <h2 id="cookbook-run-title">Run any example</h2>
          <pre tabIndex={0} aria-label="Commands">
            <code>
              {
                'git clone https://github.com/astack-tech/astack && cd astack\npnpm install && pnpm build\npnpm --filter @astack-examples/pipeline start'
              }
            </code>
          </pre>
          <p>
            Examples marked <b>API key</b> need <code>DEEPSEEK_API_KEY</code> in the environment.
            The others run offline, and CI runs them on every change.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

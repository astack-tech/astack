import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr';

import Breadcrumb from '@/components/Breadcrumb';
import CopyButton from '@/components/CopyButton';
import ExampleCard, { TIER_HUE } from '@/components/ExampleCard';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { TIERS, getAllExamples } from '@/lib/cookbook';

export const metadata: Metadata = {
  title: 'Examples',
  description:
    'Short, runnable AStack examples. Each one shows one idea, from a single component to a streaming agent server.',
  alternates: { canonical: 'https://astack.tech/examples' },
};

const RUN_COMMANDS =
  'git clone https://github.com/astack-tech/astack && cd astack\npnpm install && pnpm build\npnpm --filter @astack-examples/pipeline start';

/**
 * The tier heading fills the cells the tier's cards leave free, so every row of the
 * board is full: three cards per row on wide screens, two on tablets.
 */
function headSpan(cards: number): React.CSSProperties {
  const wide = 12 - ((cards * 4) % 12);
  const medium = cards % 2 === 0 ? 12 : 6;
  return { '--head-span': String(wide), '--head-span-md': String(medium) };
}

export default function ExamplesPage() {
  const examples = getAllExamples();
  return (
    <>
      <Navbar />
      <main id="main-content" className="frame">
        <header className="page-head">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Examples' }]} />
          <div className="section-head">
            <h1 className="page-title">One idea per file. Read them in order.</h1>
            <div>
              <p>
                Every example is a single <code>index.ts</code> that uses only what the earlier
                examples introduced. The code on these pages is the code in the repository.
              </p>
              <div className="page-actions">
                <Link className="button" href="/examples/component">
                  Start with example 01 <ArrowRightIcon size={16} />
                </Link>
                <Link className="link" href="/docs/getting-started">
                  Read the docs first
                </Link>
              </div>
            </div>
          </div>
        </header>
        {TIERS.map(tier => {
          const items = examples.filter(example => example.tier === tier.id);
          if (items.length === 0) {
            return null;
          }
          return (
            <section key={tier.id} className="tier" aria-labelledby={`tier-${tier.id}`}>
              <div className="board">
                <div
                  className={`tile tier-head block hue-${TIER_HUE[tier.id]}`}
                  style={headSpan(items.length)}
                >
                  <h2 id={`tier-${tier.id}`}>{tier.label}</h2>
                  <p>{tier.description}</p>
                </div>
                {items.map(example => (
                  <ExampleCard key={example.name} example={example} />
                ))}
              </div>
            </section>
          );
        })}
        <section className="section run-any" aria-labelledby="run-any-title">
          <div className="section-head">
            <h2 id="run-any-title">Run any example</h2>
            <p>
              Examples marked <b>API key</b> need <code>DEEPSEEK_API_KEY</code> in the environment.
              The others run offline, and CI runs them on every change.
            </p>
          </div>
          <div className="code">
            <div className="code-bar">
              <span>Terminal</span>
              <CopyButton text={RUN_COMMANDS} size="sm" />
            </div>
            <pre tabIndex={0} aria-label="Commands">
              <code>{RUN_COMMANDS}</code>
            </pre>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

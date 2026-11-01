import Link from 'next/link';
import { ArrowRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr';

import ExampleCard from './ExampleCard';
import { getAllExamples } from '@/lib/cookbook';

/** Examples featured on the homepage, in learning order. */
const FEATURED = ['pipeline', 'routing', 'workflow', 'agent', 'streaming-agent', 'rlm-agent'];

export default function UseCases() {
  const featured = getAllExamples().filter(example => FEATURED.includes(example.name));
  return (
    <section id="use-cases" className="section examples-section">
      <div className="shell">
        <div className="section-heading">
          <p className="eyebrow">EXAMPLES</p>
          <h2>Start with working code.</h2>
          <p>
            Each example is one short file that shows one idea. The code you read here is the code
            that runs in CI.
          </p>
        </div>
        <div className="cookbook-grid">
          {featured.map(example => (
            <ExampleCard key={example.name} example={example} />
          ))}
        </div>
        <Link className="section-link" href="/examples">
          View all {getAllExamples().length} examples <ArrowRightIcon size={15} />
        </Link>
        <Link className="journal-feature" href="/blog/implementing-rlm-recursive-language-model">
          <span className="journal-mark" aria-hidden="true">
            RLM
          </span>
          <div>
            <span className="eyebrow">FROM THE ENGINEERING BLOG</span>
            <h3>Implementing recursive language models</h3>
            <p>Inside AStack&apos;s recursive language model implementation.</p>
          </div>
          <ArrowUpRightIcon size={24} />
        </Link>
      </div>
    </section>
  );
}

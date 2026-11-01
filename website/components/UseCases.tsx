import Link from 'next/link';
import { ArrowRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr';

import ExampleCard from './ExampleCard';
import { getAllExamples } from '@/lib/cookbook';
import { BlurFade } from './magicui/blur-fade';

/** Examples featured on the homepage, in learning order. */
const FEATURED = ['pipeline', 'routing', 'workflow', 'agent', 'streaming-agent', 'rlm-agent'];

export default function UseCases() {
  const all = getAllExamples();
  const featured = all.filter(example => FEATURED.includes(example.name));
  return (
    <section id="use-cases" className="section" aria-labelledby="examples-title">
      <BlurFade className="section-head">
        <h2 id="examples-title">Start with working code.</h2>
        <p>
          Each example is one short file that shows one idea. The code you read here is the code
          that runs in CI.
        </p>
      </BlurFade>

      <div className="board example-grid">
        {featured.map(example => (
          <ExampleCard key={example.name} example={example} />
        ))}
        <Link className="tile all-examples" href="/examples">
          <span>View all {all.length} examples</span>
          <ArrowRightIcon size={24} />
        </Link>
        <Link className="tile journal" href="/blog/implementing-rlm-recursive-language-model">
          <span className="journal-mark block hue-rose" aria-hidden="true">
            RLM
          </span>
          <span className="journal-text">
            <span className="journal-kicker">From the engineering blog</span>
            <span className="journal-title">Implementing recursive language models</span>
            <span>Inside AStack&apos;s recursive language model implementation.</span>
          </span>
          <ArrowUpRightIcon size={24} />
        </Link>
      </div>
    </section>
  );
}

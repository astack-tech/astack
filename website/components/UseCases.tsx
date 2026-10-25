import Link from 'next/link';
import { ArrowUpRightIcon, ArrowRightIcon } from '@phosphor-icons/react/dist/ssr';

const root = 'https://github.com/astack-tech/astack/tree/master/examples';
const cases = [
  [
    'Agent with tools',
    'Create agents that use tools for real-world tasks. Read files, write results, and handle multi-round tool execution.',
    'agent-with-tools',
    'agent.run(task)',
  ],
  [
    'Deep research',
    'Automated research pipelines with web search, content analysis, and structured reports.',
    'simple-deep-research',
    'search → analyze → report',
  ],
  [
    'RAG pipeline',
    'Retrieval-augmented generation with vector stores. Connect splitting, embedding, retrieval, and generation components.',
    '',
    'split → embed → retrieve',
  ],
  [
    'Multi-agent',
    'Coordinate multiple agents for complex tasks through component composition and agent-to-agent events.',
    '',
    'agent.out → agent.in',
  ],
  [
    'Workflow automation',
    'Complex workflows with branching and parallel execution. Express routing through data dependencies.',
    'pipeline-advanced-test',
    'branch → transform → join',
  ],
  [
    'Recursive language models',
    'Explore large contexts programmatically with RLMAgent, recursive subqueries, and FileSystemContext.',
    'rlm-agent',
    'context → query → recurse',
  ],
];
export default function UseCases() {
  return (
    <section id="use-cases" className="section examples-section">
      <div className="shell">
        <div className="section-heading">
          <p className="eyebrow">BUILT WITH ASTACK</p>
          <h2>Start with working code.</h2>
          <p>
            Examples you can run. Components you can reuse. Compose the same primitives into
            different kinds of AI systems.
          </p>
        </div>
        <div className="examples-grid">
          {cases.map(([title, description, path, code]) => (
            <a className="example-item" key={title} href={`${root}/${path}`}>
              <div className="example-top">
                <code>{code}</code>
                <ArrowUpRightIcon size={18} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="example-link">
                View on GitHub <ArrowRightIcon size={14} />
              </span>
            </a>
          ))}
        </div>
        <a className="section-link" href={root}>
          View all examples <ArrowRightIcon size={15} />
        </a>
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

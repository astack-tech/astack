import Link from 'next/link';
import { ArrowRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr';
import FlowDiagram from './FlowDiagram';
import CopyButton from './CopyButton';

export default function Hero() {
  return (
    <section className="hero shell" aria-labelledby="hero-title">
      <div className="hero-copy">
        <a className="hero-eyebrow" href="https://github.com/astack-tech/astack">
          OPEN SOURCE · TYPESCRIPT · MIT <ArrowUpRightIcon size={13} />
        </a>
        <h1 id="hero-title">
          Build AI agents
          <br />
          <span>with components.</span>
        </h1>
        <p className="hero-description">
          A TypeScript framework for AI applications. Components exchange data through ports, and a
          pipeline connects them into a graph that runs on HLang&apos;s reactive flow runtime.
        </p>
        <div className="hero-actions">
          <a href="#quickstart" className="button-primary">
            Start building <ArrowRightIcon size={17} />
          </a>
          <Link href="/docs" className="text-link">
            Read the docs <ArrowRightIcon size={15} />
          </Link>
        </div>
        <div className="install-inline">
          <span aria-hidden="true">$</span>
          <code>npm install @astack-tech/core@beta</code>
          <CopyButton text="npm install @astack-tech/core@beta" size="sm" />
        </div>
      </div>
      <FlowDiagram />
    </section>
  );
}

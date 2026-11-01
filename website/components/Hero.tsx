import Link from 'next/link';
import { ArrowRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr';

import BetaNotification from './BetaNotification';
import CopyButton from './CopyButton';
import LiveStack from './home/LiveStack';
import StackHeap from './home/StackHeap';

/**
 * The first screen is one board: the name, the statement, the action and the
 * live pipeline, fitted edge to edge.
 */
export default function Hero() {
  return (
    <section className="board hero" aria-labelledby="hero-title">
      <div className="tile hero-name">
        <div className="hero-meta">
          <a href="https://github.com/astack-tech/astack">
            Open source · TypeScript · MIT <ArrowUpRightIcon size={12} />
          </a>
          <BetaNotification />
        </div>
        <StackHeap className="heap" />
        <h1 id="hero-title">
          Build AI agents
          <br />
          with components.
        </h1>
      </div>

      <div className="tile hero-statement">
        <p>
          A TypeScript framework for AI applications. Components exchange data through ports, and a
          pipeline connects them into a graph that runs on HLang&apos;s reactive flow runtime.
        </p>
      </div>

      <div className="tile hero-action">
        <a href="#quickstart" className="hero-start">
          Start building <ArrowRightIcon size={24} />
        </a>
        <div className="hero-action-foot">
          <div className="hero-install">
            <code>npm install @astack-tech/core@beta</code>
            <CopyButton text="npm install @astack-tech/core@beta" size="sm" />
          </div>
          <Link href="/docs" className="link">
            Read the docs <ArrowRightIcon size={14} />
          </Link>
        </div>
      </div>

      <div className="tile hero-live">
        <LiveStack />
      </div>
    </section>
  );
}

import Link from 'next/link';
import { ArrowRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr';

import { Brand } from './Brand';

/** The wordmark built from blocks: one translucent block per letter, bottoms on one line. */
const WORDMARK: [letter: string, hue: string, height: string][] = [
  ['a', 'silver', '72%'],
  ['s', 'blue', '100%'],
  ['t', 'rose', '84%'],
  ['a', 'mint', '64%'],
  ['c', 'amber', '92%'],
  ['k', 'silver', '78%'],
];

export default function Footer() {
  return (
    <footer className="site-footer frame">
      <div className="board footer-cta">
        <div className="tile cta-side block hue-blue" aria-hidden="true" />
        <div className="tile cta-main">
          <h2>Your next agent starts here.</h2>
          <Link href="/docs/getting-started" className="button">
            Start with the docs <ArrowRightIcon size={16} />
          </Link>
        </div>
        <div className="tile cta-side block hue-rose" aria-hidden="true" />
      </div>

      <div className="footer-wordmark" aria-hidden="true">
        {WORDMARK.map(([letter, hue, height], index) => (
          <span
            key={`${letter}-${String(index)}`}
            className={`block hue-${hue}`}
            style={{ '--h': height }}
          >
            {letter}
          </span>
        ))}
      </div>

      <div className="footer-links">
        <div className="footer-about">
          <Brand />
          <p>Everything is a component.</p>
        </div>
        <nav aria-labelledby="footer-learn">
          <h2 id="footer-learn">Learn</h2>
          <Link href="/docs">Docs</Link>
          <Link href="/examples">Examples</Link>
          <Link href="/docs/api">API reference</Link>
        </nav>
        <nav aria-labelledby="footer-project">
          <h2 id="footer-project">Project</h2>
          <Link href="/#computation-model">Computation model</Link>
          <Link href="/#comparison">Comparison</Link>
          <Link href="/blog">Blog</Link>
        </nav>
        <nav aria-labelledby="footer-community">
          <h2 id="footer-community">Community</h2>
          <a href="https://github.com/astack-tech/astack">
            GitHub <ArrowUpRightIcon size={12} />
          </a>
          <a href="https://www.npmjs.com/package/@astack-tech/core">
            npm <ArrowUpRightIcon size={12} />
          </a>
          <Link href="/brand">Brand & assets</Link>
        </nav>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} AStack.</span>
        <a href="https://github.com/astack-tech/astack/blob/master/LICENSE">
          Open source under the MIT License <ArrowUpRightIcon size={12} />
        </a>
      </div>
    </footer>
  );
}

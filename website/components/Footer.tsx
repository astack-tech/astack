import Link from 'next/link';
import { ArrowRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr';
import { Brand } from './Brand';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-invitation">
          <h2>Your next agent starts here.</h2>
          <Link href="/docs/getting-started" className="button-primary">
            Start with the docs <ArrowRightIcon size={17} />
          </Link>
        </div>
        <div className="footer-main">
          <div>
            <Brand />
            <p>Everything is a Component</p>
          </div>
          <nav aria-label="Footer navigation">
            <Link href="/docs">Docs</Link>
            <Link href="/examples">Examples</Link>
            <Link href="/#computation-model">Computation model</Link>
            <Link href="/#comparison">Comparison</Link>
            <Link href="/blog">Blog</Link>
            <a href="https://github.com/astack-tech/astack">
              GitHub <ArrowUpRightIcon size={12} />
            </a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} AStack.</span>
          <a href="https://github.com/astack-tech/astack/blob/master/LICENSE">
            Open source under the MIT License <ArrowUpRightIcon size={12} />
          </a>
          <Link href="/brand">
            Brand & assets <ArrowUpRightIcon size={12} />
          </Link>
        </div>
      </div>
    </footer>
  );
}

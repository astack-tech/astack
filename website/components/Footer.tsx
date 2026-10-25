import Link from 'next/link';
import { ArrowRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr';
import { Brand } from './Brand';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-invitation">
          <h2>Your next agent starts here.</h2>
          <a href="https://github.com/astack-tech/astack" className="button-primary">
            Read the source <ArrowRightIcon size={17} />
          </a>
        </div>
        <div className="footer-main">
          <div>
            <Brand />
            <p>Everything is a Component</p>
          </div>
          <nav aria-label="Footer navigation">
            <Link href="/#features">Features</Link>
            <Link href="/#computation-model">Computation Model</Link>
            <Link href="/#quickstart">Quick Start</Link>
            <Link href="/#use-cases">Use Cases</Link>
            <Link href="/blog">Blog</Link>
            <a href="https://deepwiki.com/astack-tech/astack">
              DeepWiki <ArrowUpRightIcon size={12} />
            </a>
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

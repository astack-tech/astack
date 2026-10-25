'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRightIcon, ListIcon, XIcon, GithubLogoIcon } from '@phosphor-icons/react';
import { Brand } from './Brand';
import { ThemeToggle } from './ThemeProvider';
import GitHubStars from './GitHubStars';

const links = [
  ['Framework', '/#features'],
  ['Architecture', '/#computation-model'],
  ['Examples', '/#use-cases'],
  ['Blog', '/blog'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  return (
    <header className="site-header">
      <nav className="site-nav shell" aria-label="Main navigation">
        <Brand />
        <div className="desktop-links">
          {links.map(([label, href]) => (
            <Link key={label} href={href}>
              {label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          <a
            className="github-link"
            href="https://github.com/astack-tech/astack"
            aria-label="AStack on GitHub"
          >
            <GithubLogoIcon size={19} /> <span>GitHub</span>
          </a>
          <GitHubStars />
          <ThemeToggle />
          <a className="nav-docs" href="https://deepwiki.com/astack-tech/astack">
            Documentation <ArrowUpRightIcon size={14} />
          </a>
          <button
            className="mobile-menu"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            onClick={() => setOpen(!open)}
          >
            {open ? <XIcon size={22} /> : <ListIcon size={22} />}
          </button>
        </div>
      </nav>
      {open && (
        <nav id="mobile-navigation" className="mobile-links shell" aria-label="Mobile navigation">
          {links.map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <a href="https://deepwiki.com/astack-tech/astack">
            Documentation <ArrowUpRightIcon size={14} />
          </a>
        </nav>
      )}
    </header>
  );
}

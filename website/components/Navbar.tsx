'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRightIcon, GithubLogoIcon, ListIcon, XIcon } from '@phosphor-icons/react';

import { Brand } from './Brand';
import GitHubStars from './GitHubStars';
import Search from './Search';
import { ThemeToggle } from './ThemeProvider';

const LINKS: [label: string, href: string][] = [
  ['Docs', '/docs'],
  ['Examples', '/examples'],
  ['API', '/docs/api'],
  ['Architecture', '/#computation-model'],
  ['Blog', '/blog'],
];

/** Marks the link of the current section. `/docs/api` belongs to API, not to Docs. */
function isCurrent(pathname: string, href: string): boolean {
  if (href.includes('#')) {
    return false;
  }
  if (href === '/docs') {
    return pathname.startsWith('/docs') && !pathname.startsWith('/docs/api');
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedOn, setOpenedOn] = useState(pathname);

  // Close the menu on navigation (including back and forward), on Escape, and when the
  // screen grows past the menu.
  if (openedOn !== pathname) {
    setOpenedOn(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    const wide = window.matchMedia('(min-width: 1001px)');
    const onWide = () => {
      if (wide.matches) {
        setOpen(false);
      }
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    wide.addEventListener('change', onWide);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', onWide);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
  };

  return (
    <header className="site-header">
      <nav className="site-nav frame" aria-label="Main navigation">
        <Brand />
        <div className="nav-links">
          {LINKS.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              aria-current={isCurrent(pathname, href) ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          <Search />
          <a className="nav-github" href="https://github.com/astack-tech/astack">
            <GithubLogoIcon size={16} aria-hidden="true" />
            GitHub
            <GitHubStars />
          </a>
          <ThemeToggle />
          <Link className="button nav-start" href="/docs/getting-started">
            Get started <ArrowRightIcon size={14} />
          </Link>
          <button
            className="menu-button"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open ? <XIcon size={20} /> : <ListIcon size={20} />}
          </button>
        </div>
      </nav>
      {open && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Menu">
          <div className="board">
            {LINKS.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                aria-current={isCurrent(pathname, href) ? 'page' : undefined}
                onClick={close}
              >
                {label}
              </Link>
            ))}
            <a className="mobile-github" href="https://github.com/astack-tech/astack">
              GitHub <GithubLogoIcon size={20} aria-hidden="true" />
            </a>
            <Link className="mobile-start" href="/docs/getting-started" onClick={close}>
              Get started <ArrowRightIcon size={20} />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

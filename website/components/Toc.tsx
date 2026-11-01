'use client';

import { useEffect, useState } from 'react';

interface TocProps {
  headings: { id: string; text: string }[];
}

/** "On this page": marks the section being read as the page scrolls. */
export default function Toc({ headings }: TocProps) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = headings
      .map(heading => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) {
      return;
    }
    // The active section is the last heading above a line 30% down the viewport.
    const update = () => {
      const line = window.innerHeight * 0.3;
      let current: string | null = null;
      for (const target of targets) {
        if (target.getBoundingClientRect().top <= line) {
          current = target.id;
        }
      }
      setActive(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [headings]);

  return (
    <aside className="toc" aria-labelledby="toc-title">
      <h2 id="toc-title">On this page</h2>
      <ol>
        {headings.map(heading => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={active === heading.id ? 'location' : undefined}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}

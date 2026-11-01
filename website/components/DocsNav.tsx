import Link from 'next/link';
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr';

import type { DocPage } from '@/lib/docs';

interface DocsNavProps {
  docs: Pick<DocPage, 'slug' | 'title'>[];
  current: string;
}

function DocsLinks({ docs, current }: DocsNavProps) {
  return (
    <ol className="docs-nav-list">
      {docs.map((doc, index) => (
        <li key={doc.slug}>
          <Link href={`/docs/${doc.slug}`} aria-current={doc.slug === current ? 'page' : undefined}>
            <span className="mono" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            {doc.title}
          </Link>
        </li>
      ))}
    </ol>
  );
}

/**
 * Documentation navigation. Desktop shows a sticky list; small screens show a
 * collapsible menu that works without JavaScript.
 */
export default function DocsNav({ docs, current }: DocsNavProps) {
  const currentTitle = docs.find(doc => doc.slug === current)?.title ?? 'Documentation';
  return (
    <>
      <details className="docs-nav-mobile">
        <summary>
          <span>
            <span className="eyebrow">DOCS</span>
            {currentTitle}
          </span>
          <CaretDownIcon size={16} aria-hidden="true" />
        </summary>
        <nav aria-label="Documentation">
          <DocsLinks docs={docs} current={current} />
          <Link className="docs-nav-examples" href="/examples">
            All examples
          </Link>
        </nav>
      </details>
      <aside className="docs-nav-desktop">
        <nav aria-label="Documentation">
          <p className="eyebrow">DOCUMENTATION</p>
          <DocsLinks docs={docs} current={current} />
          <Link className="docs-nav-examples" href="/examples">
            All examples
          </Link>
        </nav>
      </aside>
    </>
  );
}

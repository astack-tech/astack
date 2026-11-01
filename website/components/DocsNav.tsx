import Link from 'next/link';
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr';

import { API_PACKAGES, apiHref } from '@/lib/api-docs';
import type { ApiPackage } from '@/lib/api-docs';
import type { DocPage } from '@/lib/docs';
import { docsPath, labels } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

interface DocsNavProps {
  docs: Pick<DocPage, 'slug' | 'title'>[];
  /** Slug of the current docs page, or `api:<package>` / `api:` on API reference pages. */
  current: string;
  /** Language of the docs pages. The API reference is English only. */
  locale?: Locale | undefined;
}

/** Each package keeps one block color across the site. */
export const PACKAGE_HUE: Record<ApiPackage, string> = {
  core: 'silver',
  components: 'blue',
  tools: 'amber',
  integrations: 'mint',
};

function Links({ docs, current, locale = 'en' }: DocsNavProps) {
  const text = labels(locale);
  return (
    <>
      <h2 className="docs-nav-title">{text.documentation}</h2>
      <ul className="docs-nav-list">
        {docs.map(doc => (
          <li key={doc.slug}>
            <Link
              href={docsPath(locale, doc.slug)}
              aria-current={doc.slug === current ? 'page' : undefined}
            >
              {doc.title}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="docs-nav-title">{text.apiReference}</h2>
      <ul className="docs-nav-list" lang="en">
        <li>
          <Link href={apiHref([])} aria-current={current === 'api:' ? 'page' : undefined}>
            {text.overview}
          </Link>
        </li>
        {API_PACKAGES.map(pkg => (
          <li key={pkg}>
            <Link
              href={apiHref([pkg])}
              aria-current={current === `api:${pkg}` ? 'page' : undefined}
            >
              <span className={`swatch block hue-${PACKAGE_HUE[pkg]}`} aria-hidden="true" />
              @astack-tech/{pkg}
            </Link>
          </li>
        ))}
      </ul>
      <Link className="docs-nav-more" href="/examples">
        {text.allExamples}
      </Link>
    </>
  );
}

/**
 * Documentation navigation: a sticky column on wide screens, a menu that opens in
 * place on small screens (it works without JavaScript).
 */
export default function DocsNav({ docs, current, locale = 'en' }: DocsNavProps) {
  const text = labels(locale);
  const currentTitle =
    docs.find(doc => doc.slug === current)?.title ??
    (current.startsWith('api:') ? text.apiReference : text.documentation);
  return (
    <>
      <details className="docs-menu">
        <summary>
          <span>
            <span className="docs-menu-label">{text.docs}</span>
            {currentTitle}
          </span>
          <CaretDownIcon size={16} aria-hidden="true" />
        </summary>
        <nav aria-label="Documentation">
          <Links docs={docs} current={current} locale={locale} />
        </nav>
      </details>
      <aside className="docs-nav">
        <nav aria-label="Documentation">
          <Links docs={docs} current={current} locale={locale} />
        </nav>
      </aside>
    </>
  );
}

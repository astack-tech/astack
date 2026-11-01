import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Breadcrumb from '@/components/Breadcrumb';
import DocsNav, { PACKAGE_HUE } from '@/components/DocsNav';
import Footer from '@/components/Footer';
import InlineCode, { plainText } from '@/components/InlineCode';
import Navbar from '@/components/Navbar';
import RichContent from '@/components/RichContent';
import {
  API_PACKAGES,
  apiHref,
  getAllApiPages,
  getApiPage,
  getPackageGroups,
} from '@/lib/api-docs';
import type { ApiPage } from '@/lib/api-docs';
import { getAllDocs } from '@/lib/docs';
import { renderMarkdown } from '@/lib/markdown';

interface ApiPageProps {
  params: Promise<{ path?: string[] }>;
}

export function generateStaticParams(): { path: string[] }[] {
  return [{ path: [] }, ...getAllApiPages().map(page => ({ path: page.segments }))];
}

export const dynamicParams = false;

const OVERVIEW_DESCRIPTION =
  'Generated from the TypeScript sources and their TSDoc comments on every change, so it always matches the published code.';

export async function generateMetadata({ params }: ApiPageProps): Promise<Metadata> {
  const { path = [] } = await params;
  if (path.length === 0) {
    return {
      title: 'API reference · Docs',
      description: OVERVIEW_DESCRIPTION,
      alternates: { canonical: 'https://astack.tech/docs/api' },
      openGraph: { title: 'API reference · AStack', description: OVERVIEW_DESCRIPTION },
      twitter: { title: 'API reference · AStack', description: OVERVIEW_DESCRIPTION },
    };
  }
  const page = getApiPage(path);
  if (!page) {
    return { title: 'Page not found' };
  }
  const title = page.kind === 'Package' ? `@astack-tech/${page.pkg}` : page.title;
  return {
    title: `${title} · API`,
    description: plainText(page.summary),
    alternates: { canonical: `https://astack.tech${apiHref(page.segments)}` },
    openGraph: { title: `${title} · AStack API`, description: plainText(page.summary) },
    twitter: { title: `${title} · AStack API`, description: plainText(page.summary) },
  };
}

function Overview() {
  const packages = API_PACKAGES.map(pkg => getApiPage([pkg])).filter(
    (page): page is ApiPage => page !== undefined
  );
  return (
    <>
      <header className="docs-head">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Docs', href: '/docs' },
            { label: 'API reference' },
          ]}
        />
        <h1>API reference</h1>
        <p>{OVERVIEW_DESCRIPTION}</p>
      </header>
      <div className="board api-packages">
        {packages.map(page => (
          <Link key={page.pkg} href={apiHref([page.pkg])} className="tile api-package">
            <span className={`api-package-name block hue-${PACKAGE_HUE[page.pkg]}`}>
              @astack-tech/{page.pkg}
            </span>
            <span>
              <InlineCode text={page.summary} />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}

export default async function ApiReferencePage({ params }: ApiPageProps) {
  const { path = [] } = await params;
  const docs = getAllDocs();

  if (path.length === 0) {
    return (
      <>
        <Navbar />
        <main id="main-content" className="docs frame">
          <DocsNav docs={docs} current="api:" />
          <article className="docs-main">
            <Overview />
          </article>
          <div aria-hidden="true" />
        </main>
        <Footer />
      </>
    );
  }

  const page = getApiPage(path);
  if (!page) {
    notFound();
  }

  const isPackage = page.kind === 'Package';
  // Package pages list members below, so keep only TypeDoc's package overview text.
  const markdown = isPackage ? (page.markdown.split(/\n## /u)[0] ?? '') : page.markdown;
  const html = await renderMarkdown(markdown);
  const groups = isPackage ? getPackageGroups(page.pkg) : [];
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Docs', href: '/docs' },
    { label: 'API', href: apiHref([]) },
    ...(isPackage
      ? [{ label: `@astack-tech/${page.pkg}` }]
      : [{ label: `@astack-tech/${page.pkg}`, href: apiHref([page.pkg]) }, { label: page.title }]),
  ];

  return (
    <>
      <Navbar />
      <main id="main-content" className="docs frame">
        <DocsNav docs={docs} current={`api:${page.pkg}`} />
        <article className="docs-main">
          <header className="docs-head">
            <Breadcrumb items={crumbs} />
            <p className="docs-kind">
              <span className={`chip block hue-${PACKAGE_HUE[page.pkg]}`}>
                {isPackage ? 'Package' : page.kind}
              </span>
              {!isPackage && <span>@astack-tech/{page.pkg}</span>}
            </p>
            <h1 className="api-title">{isPackage ? `@astack-tech/${page.pkg}` : page.title}</h1>
          </header>
          <RichContent className="article-content api-content" html={html} />
          {groups.length > 0 && (
            <nav className="api-groups" aria-label={`@astack-tech/${page.pkg} members`}>
              {groups.map(group => (
                <section key={group.label} className="docs-related">
                  <h2>{group.label}</h2>
                  <ul className="api-list">
                    {group.pages.map(member => (
                      <li key={member.segments.join('/')}>
                        <Link className="tile api-item" href={apiHref(member.segments)}>
                          <code>{member.title}</code>
                          {member.summary && (
                            <span>
                              <InlineCode text={member.summary} />
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </nav>
          )}
        </article>
        <div aria-hidden="true" />
      </main>
      <Footer />
    </>
  );
}

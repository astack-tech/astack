import Link from 'next/link';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr';
import { formatDate, getAllPosts } from '@/lib/blog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

const POSTS_PER_PAGE = 10;
export const metadata: Metadata = {
  title: 'Engineering blog',
  description:
    'AStack release notes, component guides, and engineering articles about AI agents and pipelines.',
  alternates: { canonical: 'https://astack.tech/blog' },
};
interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const allPosts = getAllPosts();
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  const requested = Number(params.page);
  const currentPage = Number.isSafeInteger(requested)
    ? Math.min(totalPages, Math.max(1, requested))
    : 1;
  const posts = allPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  return (
    <>
      <Navbar />
      <main id="main-content" className="frame">
        <header className="page-head">
          <div className="section-head">
            <h1 className="page-title">Notes from the source.</h1>
            <p>Release notes, tutorials, and implementation details from the AStack team.</p>
          </div>
        </header>
        {posts.length ? (
          <ol className="board posts">
            {posts.map(post => (
              <li key={post.slug} className="post">
                <Link className="tile post-link" href={`/blog/${post.slug}`}>
                  <span className="post-meta">
                    <time dateTime={post.date}>{formatDate(post.date, 'short')}</time>
                    <span>{post.readingTime}</span>
                    <span>{post.author}</span>
                  </span>
                  <span className="post-text">
                    <span className="post-tags">
                      {post.tags.map(tag => (
                        <span key={tag} className="chip">
                          {tag}
                        </span>
                      ))}
                    </span>
                    <span className="post-title">{post.title}</span>
                    <span className="post-excerpt">{post.excerpt}</span>
                    <span className="example-open">
                      Read article <ArrowRightIcon size={14} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="tile">There are no published articles yet.</p>
        )}
        {totalPages > 1 && (
          <nav className="pagination" aria-label="Blog pagination">
            {currentPage > 1 ? (
              <Link href={`/blog?page=${String(currentPage - 1)}`}>Previous</Link>
            ) : (
              <span aria-disabled="true">Previous</span>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Link
                href={`/blog?page=${String(page)}`}
                key={page}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Link>
            ))}
            {currentPage < totalPages ? (
              <Link href={`/blog?page=${String(currentPage + 1)}`}>Next</Link>
            ) : (
              <span aria-disabled="true">Next</span>
            )}
          </nav>
        )}
      </main>
      <Footer />
    </>
  );
}

import Link from 'next/link';
import { ArrowRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr';
import { getAllPosts } from '@/lib/blog';
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
      <main id="main-content" className="journal-page shell">
        <div className="journal-heading">
          <p className="eyebrow">ASTACK ENGINEERING</p>
          <h1>
            Notes from
            <br />
            <span>the source.</span>
          </h1>
          <p>Release notes, tutorials, and implementation details from the AStack team.</p>
        </div>
        <div className="journal-list">
          {posts.length ? (
            posts.map(post => (
              <article key={post.slug}>
                <div className="journal-date">
                  <time dateTime={post.date}>
                    {new Date(`${post.date}T00:00:00Z`).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      timeZone: 'UTC',
                    })}
                  </time>
                  <span>{post.readingTime}</span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <div className="article-tags">
                    {post.tags.map(tag => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <span className="text-link">
                    Read article <ArrowRightIcon size={14} />
                  </span>
                </Link>
                <ArrowUpRightIcon className="journal-arrow" size={22} />
                <span className="journal-author">{post.author}</span>
              </article>
            ))
          ) : (
            <p className="empty-posts">There are no published articles yet.</p>
          )}
        </div>
        {totalPages > 1 && (
          <nav className="pagination" aria-label="Blog pagination">
            {currentPage > 1 ? (
              <Link href={`/blog?page=${currentPage - 1}`}>Previous</Link>
            ) : (
              <span aria-disabled="true">Previous</span>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Link
                href={`/blog?page=${page}`}
                key={page}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Link>
            ))}
            {currentPage < totalPages ? (
              <Link href={`/blog?page=${currentPage + 1}`}>Next</Link>
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

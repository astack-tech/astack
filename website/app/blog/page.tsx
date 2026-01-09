/**
 * Blog List Page
 *
 * Displays all blog posts with pagination
 */

import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import BlogNavbar from '@/components/BlogNavbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

const POSTS_PER_PAGE = 10;

export const metadata: Metadata = {
  title: 'Blog - AStack',
  description:
    'Official AStack blog featuring release notes, agent building tutorials, framework updates, and announcements from the AStack team.',
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const allPosts = getAllPosts();

  // Calculate pagination
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, endIndex);

  return (
    <>
      <BlogNavbar />
      <main className="min-h-screen bg-black pt-16">{/* pt-16 for navbar height */}
      {/* Header */}
      <div className="relative py-16 overflow-hidden">{/* 减少 py-24 到 py-16 */}
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00F0FF]/10 rounded-full"
            style={{ filter: 'blur(200px)' }}
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400">
              Release notes, tutorials, and official announcements from the AStack team
            </p>
          </div>
        </div>
      </div>

      {/* Blog posts grid */}
      <div className="container mx-auto px-4 md:px-6 py-12 pb-24">{/* 减少顶部间距，保持底部间距 */}
        <div className="max-w-5xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group glass rounded-2xl p-6 hover:bg-white/5 transition-all"
                >
                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs rounded-full bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-[#00F0FF] transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{post.author}</span>
                    <span>•</span>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                  </div>

                  {/* Read more indicator */}
                  <div className="mt-4 flex items-center gap-2 text-[#00F0FF] text-sm font-medium">
                    <span>Read more</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="container mx-auto px-4 md:px-6 pb-16">
          <div className="max-w-5xl mx-auto flex justify-center items-center gap-2">
            {/* Previous button */}
            {currentPage > 1 ? (
              <Link
                href={`/blog?page=${currentPage - 1}`}
                className="px-4 py-2 rounded-lg glass text-gray-400 hover:text-[#00F0FF] transition-colors"
              >
                Previous
              </Link>
            ) : (
              <button
                className="px-4 py-2 rounded-lg glass text-gray-600 cursor-not-allowed"
                disabled
              >
                Previous
              </button>
            )}

            {/* Page numbers */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/blog?page=${page}`}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    page === currentPage
                      ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30'
                      : 'glass text-gray-400 hover:text-[#00F0FF]'
                  }`}
                >
                  {page}
                </Link>
              ))}
            </div>

            {/* Next button */}
            {currentPage < totalPages ? (
              <Link
                href={`/blog?page=${currentPage + 1}`}
                className="px-4 py-2 rounded-lg glass text-gray-400 hover:text-[#00F0FF] transition-colors"
              >
                Next
              </Link>
            ) : (
              <button
                className="px-4 py-2 rounded-lg glass text-gray-600 cursor-not-allowed"
                disabled
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </main>
    <Footer />
    </>
  );
}

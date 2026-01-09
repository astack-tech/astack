/**
 * Blog Post Detail Page
 *
 * Displays individual blog post with markdown rendering
 */

import { notFound } from 'next/navigation';
import { getAllPostSlugs, getPostBySlug, markdownToHtml } from '@/lib/blog';
import BlogNavbar from '@/components/BlogNavbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';
import 'highlight.js/styles/github-dark.css';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - AStack Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || !post.content) {
    notFound();
  }

  const contentHtml = await markdownToHtml(post.content);

  return (
    <>
      <BlogNavbar />
      <main className="min-h-screen bg-black pt-16">{/* pt-16 for navbar height */}
      {/* Header */}
      <div className="relative py-12 overflow-hidden border-b border-white/5">{/* 减少 py-16 到 py-12 */}
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-grid opacity-20" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog', href: '/blog' },
                { label: post.title },
              ]}
            />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-gray-400">
              <span className="font-medium">{post.author}</span>
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
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="container mx-auto px-4 md:px-6 pt-0 pb-12">{/* 移除顶部 padding，紧贴上方 */}
        <div className="max-w-3xl mx-auto">
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-[#00F0FF] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-semibold
              prose-code:text-[#00F0FF] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
              prose-ul:text-gray-300 prose-ul:my-6
              prose-ol:text-gray-300 prose-ol:my-6
              prose-li:my-2
              prose-blockquote:border-l-[#00F0FF] prose-blockquote:text-gray-400 prose-blockquote:italic
              prose-img:rounded-xl prose-img:border prose-img:border-white/10"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </article>
    </main>
    <Footer />
    </>
  );
}

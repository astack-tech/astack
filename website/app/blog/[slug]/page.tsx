import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr';
import { getAllPostSlugs, getPostBySlug, markdownToHtml } from '@/lib/blog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}
export async function generateStaticParams() {
  return getAllPostSlugs().map(slug => ({ slug }));
}
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Article not found' };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://astack.tech/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: '/brand/social-card.png', width: 1200, height: 630 }],
    },
  };
}
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post?.content) notFound();
  const contentHtml = await markdownToHtml(post.content.trimStart().replace(/^# .+\r?\n/, ''));
  return (
    <>
      <Navbar />
      <main id="main-content" className="article-page shell">
        <header className="article-heading">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title },
            ]}
          />
          <div className="article-tags">
            {post.tags.map(tag => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="article-meta">
            <span>{post.author}</span>
            <time dateTime={post.date}>
              {new Date(`${post.date}T00:00:00Z`).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC',
              })}
            </time>
            <span>{post.readingTime}</span>
          </div>
        </header>
        <article
          className="prose article-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        <Link href="/blog" className="text-link article-back">
          <ArrowLeftIcon size={16} />
          Back to all articles
        </Link>
      </main>
      <Footer />
    </>
  );
}

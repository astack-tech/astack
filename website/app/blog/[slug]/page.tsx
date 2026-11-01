import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr';
import { formatDate, getAllPostSlugs, getPostBySlug, markdownToHtml } from '@/lib/blog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import RichContent from '@/components/RichContent';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}
export function generateStaticParams(): { slug: string }[] {
  return getAllPostSlugs().map(slug => ({ slug }));
}
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: 'Article not found' };
  }
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
  if (post?.content === undefined || post.content === '') {
    notFound();
  }
  const contentHtml = await markdownToHtml(post.content.trimStart().replace(/^# .+\r?\n/, ''));
  return (
    <>
      <Navbar />
      <main id="main-content" className="frame post-page">
        <header className="docs-head post-head">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title },
            ]}
          />
          <p className="post-tags">
            {post.tags.map(tag => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </p>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <p className="post-meta">
            <span>{post.author}</span>
            <time dateTime={post.date}>{formatDate(post.date, 'long')}</time>
            <span>{post.readingTime}</span>
          </p>
        </header>
        <article className="post-body">
          <RichContent className="article-content" html={contentHtml} />
        </article>
        <Link href="/blog" className="link post-back">
          <ArrowLeftIcon size={16} />
          Back to all articles
        </Link>
      </main>
      <Footer />
    </>
  );
}

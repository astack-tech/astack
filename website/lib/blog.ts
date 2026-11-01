/**
 * Blog utilities for reading and processing markdown blog posts
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { renderMarkdown } from './markdown';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  tags: string[];
  content?: string;
  readingTime?: string;
}

/**
 * Get all blog post slugs
 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''));
}

/**
 * Get all blog posts metadata (sorted by date, newest first)
 */
export function getAllPosts(): BlogPost[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map(slug => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
  return posts;
}

/**
 * Get a single blog post by slug
 */
export function getPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Calculate reading time
  // Remove code blocks first (they read faster)
  const contentWithoutCode = content.replace(/```[\s\S]*?```/g, '');
  // Count words (English) and characters (for code/Chinese)
  const words = contentWithoutCode.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  // Average reading speed: 200 words per minute for English
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  const readingTime = minutes === 1 ? '1 min read' : `${String(minutes)} mins read`;

  const meta = data as Record<string, unknown>;
  const text = (key: string, fallback: string): string => {
    const value = meta[key];
    return typeof value === 'string' && value.length > 0 ? value : fallback;
  };
  const tags = Array.isArray(meta['tags'])
    ? meta['tags'].filter((tag): tag is string => typeof tag === 'string')
    : [];

  return {
    slug,
    title: text('title', 'Untitled'),
    date: text('date', new Date().toISOString()),
    excerpt: text('excerpt', ''),
    author: text('author', 'AStack Team'),
    tags,
    content,
    readingTime,
  };
}

/**
 * Converts markdown content to HTML.
 */
export function markdownToHtml(markdown: string): Promise<string> {
  return renderMarkdown(markdown);
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.tags.includes(tag));
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tags = new Set<string>();
  allPosts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/** Formats a post date (`YYYY-MM-DD`) the same way on the server and the client. */
export function formatDate(date: string, style: 'short' | 'long'): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: style,
    day: 'numeric',
    timeZone: 'UTC',
  });
}

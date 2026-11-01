import type { MetadataRoute } from 'next';

import { getAllPosts } from '@/lib/blog';
import { getAllExamples } from '@/lib/cookbook';
import { getAllDocs } from '@/lib/docs';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://astack.tech';
  const currentDate = new Date();

  // Get all blog posts
  const posts = getAllPosts();
  const blogEntries: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const docEntries: MetadataRoute.Sitemap = getAllDocs().map(doc => ({
    url: `${baseUrl}/docs/${doc.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));
  const exampleEntries: MetadataRoute.Sitemap = getAllExamples().map(example => ({
    url: `${baseUrl}/examples/${example.name}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#features`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#computation-model`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#quickstart`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#comparison`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#use-cases`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/brand`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/examples`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...docEntries,
    ...exampleEntries,
    ...blogEntries,
  ];
}

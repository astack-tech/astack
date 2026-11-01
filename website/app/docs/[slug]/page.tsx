import type { Metadata } from 'next';

import DocArticle, { docMetadata } from '@/components/DocArticle';
import { getAllDocs } from '@/lib/docs';

interface DocPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return getAllDocs('en').map(doc => ({ slug: doc.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  return docMetadata(slug, 'en');
}

export default async function DocPageRoute({ params }: DocPageProps) {
  const { slug } = await params;
  return <DocArticle slug={slug} locale="en" />;
}

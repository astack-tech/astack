import { renderOgCard, OG_SIZE } from '@/lib/og-card';
import { getAllDocs, getDoc } from '@/lib/docs';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'AStack documentation page';

export function generateStaticParams(): { slug: string }[] {
  return getAllDocs().map(doc => ({ slug: doc.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  return renderOgCard({
    eyebrow: 'Docs',
    title: doc?.title ?? 'Documentation',
    description: doc?.description ?? '',
  });
}

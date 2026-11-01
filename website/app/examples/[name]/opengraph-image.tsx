import { renderOgCard, OG_SIZE } from '@/lib/og-card';
import { TIERS, formatOrder, getAllExamples, getExample } from '@/lib/cookbook';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'AStack example';

export function generateStaticParams(): { name: string }[] {
  return getAllExamples().map(example => ({ name: example.name }));
}

export default async function Image({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const example = getExample(name);
  const tier = TIERS.find(item => item.id === example?.tier)?.label ?? '';
  return renderOgCard({
    eyebrow: example ? `Example ${formatOrder(example.order)} · ${tier}` : 'Example',
    title: example?.title ?? 'Example',
    description: example?.description ?? '',
  });
}

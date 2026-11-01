import Link from 'next/link';
import { ArrowRightIcon, KeyIcon } from '@phosphor-icons/react/dist/ssr';

import { formatOrder } from '@/lib/cookbook';
import type { ExampleSummary } from '@/lib/cookbook';

import { MagicCard } from './magicui/magic-card';

interface ExampleCardProps {
  example: ExampleSummary;
}

/** Card that links to one example page. */
export default function ExampleCard({ example }: ExampleCardProps) {
  return (
    <MagicCard
      className="cookbook-card-frame"
      gradientFrom="var(--silver-edge)"
      gradientTo="var(--line)"
      gradientColor="var(--silver-glow)"
      gradientOpacity={0.3}
    >
      <Link className="cookbook-card" href={`/examples/${example.name}`}>
        <span className="cookbook-card-top">
          <span className="cookbook-order mono">{formatOrder(example.order)}</span>
          {example.requiresApiKey ? (
            <span className="cookbook-badge" title="Needs DEEPSEEK_API_KEY">
              <KeyIcon size={12} weight="bold" /> API key
            </span>
          ) : (
            <span className="cookbook-badge cookbook-badge-quiet">Offline</span>
          )}
        </span>
        <span className="cookbook-card-title">{example.title}</span>
        <span className="cookbook-card-description">{example.description}</span>
        <span className="cookbook-card-link">
          Open example <ArrowRightIcon size={14} />
        </span>
      </Link>
    </MagicCard>
  );
}

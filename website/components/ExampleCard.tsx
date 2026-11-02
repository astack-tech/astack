import Link from 'next/link';
import { ArrowRightIcon, KeyIcon } from '@phosphor-icons/react/dist/ssr';

import { formatOrder } from '@/lib/cookbook';
import type { ExampleSummary } from '@/lib/cookbook';

import { MagicCard } from './magicui/magic-card';

/** Each tier keeps one block color across the site. */
export const TIER_HUE: Record<ExampleSummary['tier'], string> = {
  basics: 'blue',
  llm: 'amber',
  advanced: 'rose',
};

/** A tile that links to one example page. */
export default function ExampleCard({ example }: { example: ExampleSummary }) {
  return (
    <MagicCard
      className="tile tile-card example-card"
      gradientSize={260}
      gradientFrom="var(--spot-edge)"
      gradientTo="transparent"
      gradientColor="var(--spot)"
      gradientOpacity={1}
    >
      <Link href={`/examples/${example.name}`} className="example-link">
        <span className="example-top">
          <span className={`example-order block hue-${TIER_HUE[example.tier]}`}>
            {formatOrder(example.order)}
          </span>
          {example.requiresApiKey ? (
            <span
              className="chip"
              title="Calls a model. Uses DEEPSEEK_API_KEY as written; any model provider works."
            >
              <KeyIcon size={12} weight="bold" aria-hidden="true" /> API key
            </span>
          ) : (
            <span className="chip">Offline</span>
          )}
        </span>
        <span className="example-title">{example.title}</span>
        <span className="example-description">{example.description}</span>
        <span className="example-open">
          Open example <ArrowRightIcon size={14} />
        </span>
      </Link>
    </MagicCard>
  );
}

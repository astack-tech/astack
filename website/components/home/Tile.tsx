import { MagicCard } from '@/components/magicui/magic-card';
import { cn } from '@/lib/utils';

interface TileProps {
  children: React.ReactNode;
  className?: string | undefined;
}

/**
 * A filled tile of the board. Magic UI's MagicCard adds the light that follows the
 * pointer; at rest the tile is a flat field one tone off the page.
 */
export default function Tile({ children, className }: TileProps) {
  return (
    <MagicCard
      className={cn('tile tile-card', className)}
      gradientSize={260}
      gradientFrom="var(--spot-edge)"
      gradientTo="transparent"
      gradientColor="var(--spot)"
      gradientOpacity={1}
    >
      <div className="tile-body">{children}</div>
    </MagicCard>
  );
}

import { COLS, PIECES, ROWS, piecePath } from '@/lib/well';

/** Size of one cell in SVG units. CSS sets the rendered size. */
const UNIT = 40;

/**
 * The hero's well: the pieces from lib/well.ts, each drawn as one SVG path, so seams
 * appear only between pieces. A 2px stroke in the tile colour draws the seams.
 */
export default function StackHeap({ className }: { className?: string }) {
  return (
    <svg
      className={`well ${className ?? ''}`}
      viewBox={`0 0 ${String(COLS * UNIT)} ${String(ROWS * UNIT)}`}
      role="img"
      aria-label="Twelve blocks fitted into one rectangle"
    >
      {PIECES.map((piece, index) => (
        <path
          key={piece.cells.map(cell => cell.join(',')).join(';')}
          className={`well-piece hue-${piece.hue}`}
          d={piecePath(piece.cells, UNIT)}
          style={{
            '--order': String(index),
            // A piece falls from above the well to its resting row.
            '--fall': String(Math.min(...piece.cells.map(([, y]) => y)) + 3),
          }}
        />
      ))}
    </svg>
  );
}

/**
 * "A stack": twelve tetrominoes that tile an 8 × 6 well exactly, with no hole and no
 * overhang. They fall in the order gravity allows, each resting on the pieces below,
 * and lock into one rectangle: separate components, composed into one whole.
 *
 * The tiling, the drop order and the colors (no two touching pieces share a color)
 * were computed once by a small solver and are stored here as data. A 2px stroke in
 * the tile color draws the seams between pieces.
 */

const COLS = 8;
const ROWS = 6;

type Cell = [x: number, y: number];

const PIECES: { hue: string; cells: Cell[] }[] = [
  { hue: 'silver', cells: [[0, 5], [1, 4], [1, 5], [2, 5]] },
  { hue: 'blue', cells: [[2, 4], [3, 4], [3, 5], [4, 5]] },
  { hue: 'mint', cells: [[6, 5], [7, 3], [7, 4], [7, 5]] },
  { hue: 'amber', cells: [[4, 4], [5, 4], [5, 5], [6, 4]] },
  { hue: 'rose', cells: [[0, 1], [0, 2], [0, 3], [0, 4]] },
  { hue: 'aqua', cells: [[1, 2], [1, 3], [2, 2], [2, 3]] },
  { hue: 'silver', cells: [[3, 1], [3, 2], [3, 3], [4, 3]] },
  { hue: 'blue', cells: [[4, 2], [5, 2], [5, 3], [6, 3]] },
  { hue: 'mint', cells: [[5, 0], [5, 1], [6, 1], [6, 2]] },
  { hue: 'amber', cells: [[6, 0], [7, 0], [7, 1], [7, 2]] },
  { hue: 'blue', cells: [[0, 0], [1, 0], [1, 1], [2, 1]] },
  { hue: 'rose', cells: [[2, 0], [3, 0], [4, 0], [4, 1]] },
];

const UNIT = 40;

/**
 * The outline of a piece: every cell edge that is not shared with another cell of the
 * same piece, chained into one closed loop. Tetrominoes have no holes, so one loop is
 * the whole shape. Filling and stroking that loop gives a piece without inner seams.
 */
function piecePath(cells: Cell[]): string {
  const key = (x: number, y: number) => `${String(x)},${String(y)}`;
  const edges = new Map<string, [number, number]>();
  for (const [x, y] of cells) {
    // Clockwise edges of the cell; a shared edge appears once in each direction.
    const corners: [number, number][] = [
      [x, y],
      [x + 1, y],
      [x + 1, y + 1],
      [x, y + 1],
    ];
    corners.forEach(([ax, ay], i) => {
      const [bx, by] = corners[(i + 1) % 4] ?? [ax, ay];
      const reverse = `${key(bx, by)}>${key(ax, ay)}`;
      if (edges.has(reverse)) {
        edges.delete(reverse);
      } else {
        edges.set(`${key(ax, ay)}>${key(bx, by)}`, [bx, by]);
      }
    });
  }
  const next = new Map<string, [number, number]>();
  for (const [edge, end] of edges) {
    next.set(edge.split('>')[0] ?? '', end);
  }
  const [start] = next.keys();
  const points: string[] = [];
  let current = start ?? '';
  do {
    const [px, py] = current.split(',').map(Number);
    points.push(`${String((px ?? 0) * UNIT)} ${String((py ?? 0) * UNIT)}`);
    const end = next.get(current);
    current = end ? key(end[0], end[1]) : (start ?? '');
  } while (current !== start && points.length <= edges.size);
  return `M${points.join('L')}Z`;
}

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
          d={piecePath(piece.cells)}
          style={
            {
              '--order': String(index),
              // A piece falls from above the well to its resting row.
              '--fall': String(Math.min(...piece.cells.map(([, y]) => y)) + 3),
            } as React.CSSProperties
          }
        />
      ))}
    </svg>
  );
}

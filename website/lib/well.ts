/**
 * "A stack": twelve tetrominoes that tile an 8 x 6 well exactly, with no hole and no
 * overhang, listed in the order gravity lets them fall. The tiling, the order and the
 * colours (no two touching pieces share one) were computed once by a solver; the
 * tests in __tests__/well.test.ts check each property.
 */

export const COLS = 8;
export const ROWS = 6;

export type Cell = [x: number, y: number];

export const PIECES: { hue: string; cells: Cell[] }[] = [
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

type Point = readonly [x: number, y: number];

const id = ([x, y]: Point): string => `${String(x)},${String(y)}`;

/**
 * The outline of a piece: every cell edge that is not shared with another cell of the
 * same piece, walked as one closed loop and reduced to its corners. Tetrominoes have
 * no holes, so one loop is the whole shape. Filling and stroking that loop gives a
 * piece without inner seams.
 */
export function piecePath(cells: readonly Cell[], unit: number): string {
  // Each cell adds its four clockwise edges; an edge shared by two cells cancels out.
  const edges = new Map<string, readonly [Point, Point]>();
  for (const [x, y] of cells) {
    const a: Point = [x, y];
    const b: Point = [x + 1, y];
    const c: Point = [x + 1, y + 1];
    const d: Point = [x, y + 1];
    const sides: (readonly [Point, Point])[] = [
      [a, b],
      [b, c],
      [c, d],
      [d, a],
    ];
    sides.forEach(([from, to]) => {
      const reverse = `${id(to)}>${id(from)}`;
      if (edges.has(reverse)) {
        edges.delete(reverse);
      } else {
        edges.set(`${id(from)}>${id(to)}`, [from, to]);
      }
    });
  }
  const [first] = edges.values();
  if (first === undefined) {
    return '';
  }
  const nextFrom = new Map([...edges.values()].map(([from, to]) => [id(from), to] as const));
  const loop: Point[] = [];
  let point = first[0];
  do {
    loop.push(point);
    // Every corner of a closed outline starts exactly one edge.
    point = nextFrom.get(id(point)) ?? first[0];
  } while (id(point) !== id(first[0]));
  // Keep only the turns: a point between two collinear edges adds nothing to the shape.
  const turns = loop.filter((current, i) => {
    const before = loop.at(i - 1) ?? current;
    const after = loop.at((i + 1) % loop.length) ?? current;
    const cross =
      (current[0] - before[0]) * (after[1] - current[1]) -
      (current[1] - before[1]) * (after[0] - current[0]);
    return cross !== 0;
  });
  return `M${turns.map(([x, y]) => `${String(x * unit)} ${String(y * unit)}`).join('L')}Z`;
}

import { describe, expect, it } from 'vitest';

import { COLS, PIECES, ROWS, piecePath } from '../well';

const key = (x: number, y: number) => `${String(x)},${String(y)}`;

describe('the well', () => {
  it('tiles every cell exactly once with tetrominoes', () => {
    const seen = new Map<string, number>();
    PIECES.forEach((piece, index) => {
      expect(piece.cells).toHaveLength(4);
      for (const [x, y] of piece.cells) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThan(COLS);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThan(ROWS);
        expect(seen.has(key(x, y))).toBe(false);
        seen.set(key(x, y), index);
      }
    });
    expect(seen.size).toBe(COLS * ROWS);
  });

  it('keeps every piece in one connected shape', () => {
    for (const piece of PIECES) {
      const cells = new Set(piece.cells.map(([x, y]) => key(x, y)));
      const [first] = piece.cells;
      const stack = first ? [first] : [];
      const reached = new Set<string>();
      while (stack.length > 0) {
        const cell = stack.pop();
        if (!cell || reached.has(key(...cell))) {
          continue;
        }
        reached.add(key(...cell));
        const [x, y] = cell;
        const neighbours: [number, number][] = [
          [x + 1, y],
          [x - 1, y],
          [x, y + 1],
          [x, y - 1],
        ];
        for (const [nx, ny] of neighbours) {
          if (cells.has(key(nx, ny))) {
            stack.push([nx, ny]);
          }
        }
      }
      expect(reached.size).toBe(4);
    }
  });

  it('never gives two touching pieces the same colour', () => {
    const owner = new Map<string, number>();
    PIECES.forEach((piece, index) => {
      for (const [x, y] of piece.cells) {
        owner.set(key(x, y), index);
      }
    });
    for (const [cell, index] of owner) {
      const [x = 0, y = 0] = cell.split(',').map(Number);
      for (const neighbour of [key(x + 1, y), key(x, y + 1)]) {
        const other = owner.get(neighbour);
        if (other !== undefined && other !== index) {
          expect(PIECES[other]?.hue).not.toBe(PIECES[index]?.hue);
        }
      }
    }
  });

  it('drops pieces in an order gravity allows', () => {
    const placed = new Set<string>();
    for (const piece of PIECES) {
      const own = new Set(piece.cells.map(([x, y]) => key(x, y)));
      for (const [x, y] of piece.cells) {
        const below = key(x, y + 1);
        if (y + 1 < ROWS && !own.has(below)) {
          expect(placed.has(below)).toBe(true);
        }
      }
      for (const [x, y] of piece.cells) {
        placed.add(key(x, y));
      }
    }
  });

  it('outlines a piece as one closed loop around its cells', () => {
    // An L tetromino has six corners.
    expect(piecePath([[0, 0], [0, 1], [0, 2], [1, 2]], 10)).toBe('M0 0L10 0L10 20L20 20L20 30L0 30Z');
    expect(piecePath([], 10)).toBe('');
    for (const piece of PIECES) {
      expect(piecePath(piece.cells, 40)).toMatch(/^M[\d ]+(L[\d ]+)+Z$/);
    }
  });
});

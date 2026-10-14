import { describe, expect, it } from 'vitest';
import { seededRng } from '../../../testing';
import { COUNT_TOTAL, canPlace, isFinished, makeLooseBlocks, stepMatched } from './count';

describe('makeLooseBlocks', () => {
  it('makes ten blocks with unique ids lying along the bottom of the canvas', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const blocks = makeLooseBlocks(56, seededRng(seed));
      expect(blocks).toHaveLength(COUNT_TOTAL);
      expect(new Set(blocks.map((b) => b.id)).size).toBe(COUNT_TOTAL);
      for (const b of blocks) {
        expect(b.x).toBeGreaterThanOrEqual(6);
        expect(b.x).toBeLessThanOrEqual(94);
        expect(b.y).toBeGreaterThanOrEqual(58);
        expect(b.y).toBeLessThanOrEqual(90);
      }
    }
  });
});

describe('placing blocks', () => {
  it('only the leftmost empty slot accepts a block', () => {
    expect(canPlace(0, 1, 0)).toBe(true);
    expect(canPlace(0, 3, 1)).toBe(false);
    expect(canPlace(2, 3, 2)).toBe(true);
    expect(canPlace(2, 3, 0)).toBe(false); // already filled
  });

  it('accepts nothing once the step is matched', () => {
    expect(canPlace(3, 3, 3)).toBe(false);
  });

  it('knows when a step is matched and when the task is finished', () => {
    expect(stepMatched(2, 3)).toBe(false);
    expect(stepMatched(3, 3)).toBe(true);
    expect(isFinished(9, 9)).toBe(false);
    expect(isFinished(9, 10)).toBe(false);
    expect(isFinished(10, 10)).toBe(true);
  });
});

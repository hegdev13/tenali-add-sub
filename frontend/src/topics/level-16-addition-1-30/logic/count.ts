/** Task 3: count the blocks (counting is adding one). Pure rules so they can be unit-tested. */

import type { Rng } from './papers';

export const COUNT_TOTAL = 10;

export interface LooseBlock {
  id: number;
  x: number; // centre, % of canvas width
  y: number; // centre, % of canvas height
  rot: number;
}

/** Blocks lie scattered along the bottom of the canvas, like the bits of paper in Task 1. */
export const makeLooseBlocks = (blockSize: number, rng: Rng = Math.random): LooseBlock[] => {
  const blocks: LooseBlock[] = [];
  for (let id = 0; id < COUNT_TOTAL; id++) {
    let x = 0;
    let y = 0;
    for (let attempt = 0; attempt < 40; attempt++) {
      x = 6 + rng() * 88;
      y = 58 + rng() * 32;
      // keep them from sitting on top of each other (canvas is roughly 900 x 380)
      const clear = blocks.every((b) => Math.hypot((b.x - x) * 9, (b.y - y) * 3.8) > blockSize + 8);
      if (clear) break;
    }
    blocks.push({ id, x, y, rot: Math.round(rng() * 50 - 25) });
  }
  return blocks;
};

/** A block is only accepted by the leftmost empty slot, and only until this step is matched. */
export const canPlace = (placed: number, step: number, targetSlot: number) =>
  placed < step && targetSlot === placed;

/** Has the child matched the reference for this step? */
export const stepMatched = (placed: number, step: number) => placed >= step;

export const isFinished = (placed: number, step: number) =>
  step === COUNT_TOTAL && placed === COUNT_TOTAL;

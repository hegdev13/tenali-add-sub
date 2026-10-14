/** Task 2: put the blocks 1-10 in order. Pure rules so they can be unit-tested. */

import type { Rng } from './papers';

export const ORDER_COUNT = 10;
export const ORDER_VALUES = Array.from({ length: ORDER_COUNT }, (_, i) => i + 1);

// each block is slightly bigger than the one before it
export const blockSize = (value: number) => 34 + (value - 1) * 3;

export type Cell = number | null;
export type Origin = { kind: 'tray' | 'slot'; index: number };

export const emptySlots = (): Cell[] => Array(ORDER_COUNT).fill(null);

/** A shuffled 1-10 that is never already in order. */
export const shuffledValues = (rng: Rng = Math.random): number[] => {
  let arr: number[];
  do {
    arr = [...ORDER_VALUES];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } while (arr.every((v, i) => v === i + 1));
  return arr;
};

export const isSolved = (slots: Cell[]) => slots.every((v, i) => v === i + 1);

export const allFilled = (slots: Cell[]) => slots.every((v) => v !== null);

/** The smallest block that is not yet in its own slot (what the hint hand moves next). */
export const nextMisplaced = (slots: Cell[]): number | undefined =>
  ORDER_VALUES.find((v) => slots[v - 1] !== v);

/**
 * Drop `value` (lifted from `origin`) onto slot `target` (-1 = no slot).
 * - onto another slot: it goes there; an occupant swaps into the cell the block came from
 * - onto no slot: a block from a slot returns to the tray, a tray block stays put
 */
export const applyDrop = (
  slots: Cell[],
  tray: Cell[],
  value: number,
  origin: Origin,
  target: number
) => {
  const nextSlots = [...slots];
  const nextTray = [...tray];
  if (origin.kind === 'slot' && target === origin.index) return { slots: nextSlots, tray: nextTray };

  if (origin.kind === 'slot') nextSlots[origin.index] = null;
  else nextTray[origin.index] = null;

  if (target >= 0) {
    const occupant = nextSlots[target];
    nextSlots[target] = value;
    if (occupant !== null) {
      if (origin.kind === 'slot') nextSlots[origin.index] = occupant;
      else nextTray[origin.index] = occupant;
    }
  } else if (origin.kind === 'slot') {
    const free = nextTray.indexOf(null);
    nextTray[free >= 0 ? free : 0] = value;
  } else {
    nextTray[origin.index] = value;
  }
  return { slots: nextSlots, tray: nextTray };
};

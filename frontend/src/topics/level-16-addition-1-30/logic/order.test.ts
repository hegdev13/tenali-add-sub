import { describe, expect, it } from 'vitest';
import { seededRng } from '../../../testing';
import {
  ORDER_COUNT,
  ORDER_VALUES,
  allFilled,
  applyDrop,
  blockSize,
  emptySlots,
  isSolved,
  nextMisplaced,
  shuffledValues,
  type Cell,
} from './order';

const tray = (values: number[]): Cell[] => [...values];

describe('shuffledValues', () => {
  it('is a permutation of 1-10 and never already in order', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const v = shuffledValues(seededRng(seed));
      expect([...v].sort((a, b) => a - b)).toEqual(ORDER_VALUES);
      expect(v.every((x, i) => x === i + 1)).toBe(false);
    }
  });
});

describe('blockSize', () => {
  it('makes each block slightly bigger than the previous one', () => {
    for (let v = 2; v <= ORDER_COUNT; v++) {
      expect(blockSize(v)).toBeGreaterThan(blockSize(v - 1));
    }
  });
});

describe('solving', () => {
  it('only counts the exact order 1-10 as solved', () => {
    expect(isSolved(ORDER_VALUES)).toBe(true);
    expect(isSolved(emptySlots())).toBe(false);
    expect(isSolved([2, 1, ...ORDER_VALUES.slice(2)])).toBe(false);
  });

  it('knows when every slot is filled', () => {
    expect(allFilled(emptySlots())).toBe(false);
    expect(allFilled([...ORDER_VALUES].reverse())).toBe(true);
  });

  it('hints the smallest block that is not in its place', () => {
    expect(nextMisplaced(emptySlots())).toBe(1);
    expect(nextMisplaced([1, 2, null, ...Array(7).fill(null)])).toBe(3);
    expect(nextMisplaced([1, 3, 2, ...ORDER_VALUES.slice(3)])).toBe(2);
    expect(nextMisplaced(ORDER_VALUES)).toBeUndefined();
  });
});

describe('applyDrop', () => {
  it('moves a tray block into an empty slot', () => {
    const r = applyDrop(emptySlots(), tray([5, 3]), 5, { kind: 'tray', index: 0 }, 4);
    expect(r.slots[4]).toBe(5);
    expect(r.tray[0]).toBeNull();
  });

  it('swaps the occupant back into the tray cell when dropped on a filled slot', () => {
    const slots = emptySlots();
    slots[2] = 9;
    const r = applyDrop(slots, tray([4]), 4, { kind: 'tray', index: 0 }, 2);
    expect(r.slots[2]).toBe(4);
    expect(r.tray[0]).toBe(9);
  });

  it('swaps two blocks between slots', () => {
    const slots = emptySlots();
    slots[0] = 7;
    slots[5] = 2;
    const r = applyDrop(slots, tray([]), 7, { kind: 'slot', index: 0 }, 5);
    expect(r.slots[5]).toBe(7);
    expect(r.slots[0]).toBe(2);
  });

  it('sends a slot block back to the tray when dropped outside any slot', () => {
    const slots = emptySlots();
    slots[3] = 6;
    const r = applyDrop(slots, [null, 8], 6, { kind: 'slot', index: 3 }, -1);
    expect(r.slots[3]).toBeNull();
    expect(r.tray).toContain(6);
  });

  it('leaves a tray block in place when dropped outside any slot', () => {
    const r = applyDrop(emptySlots(), tray([5, 3]), 3, { kind: 'tray', index: 1 }, -1);
    expect(r.tray).toEqual([5, 3]);
    expect(r.slots).toEqual(emptySlots());
  });

  it('does nothing when dropped back on its own slot', () => {
    const slots = emptySlots();
    slots[1] = 4;
    const r = applyDrop(slots, tray([]), 4, { kind: 'slot', index: 1 }, 1);
    expect(r.slots).toEqual(slots);
  });

  it('does not mutate its inputs', () => {
    const slots = emptySlots();
    const t = tray([1, 2]);
    applyDrop(slots, t, 1, { kind: 'tray', index: 0 }, 0);
    expect(slots).toEqual(emptySlots());
    expect(t).toEqual([1, 2]);
  });
});

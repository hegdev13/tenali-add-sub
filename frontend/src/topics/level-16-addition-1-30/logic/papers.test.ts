import { describe, expect, it } from 'vitest';
import { seededRng } from '../../../testing';
import { PAPER_COLORS, isInBasketCorner, makePapers } from './papers';

describe('makePapers', () => {
  it('makes the requested number with unique ids', () => {
    const papers = makePapers(12, seededRng(1));
    expect(papers).toHaveLength(12);
    expect(new Set(papers.map((p) => p.id)).size).toBe(12);
  });

  it('never drops a paper into the basket corner and stays inside the canvas', () => {
    for (let seed = 1; seed <= 20; seed++) {
      for (const p of makePapers(20, seededRng(seed))) {
        expect(isInBasketCorner(p.x, p.y)).toBe(false);
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(100);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(100);
      }
    }
  });

  it('gives each paper a colour from the palette and a polygon outline', () => {
    for (const p of makePapers(20, seededRng(7))) {
      expect(PAPER_COLORS).toContain(p.color);
      expect(p.clip.startsWith('polygon(')).toBe(true);
      expect(p.w).toBeGreaterThan(0);
      expect(p.h).toBeGreaterThan(0);
    }
  });

  it('is repeatable for the same seed', () => {
    expect(makePapers(5, seededRng(42))).toEqual(makePapers(5, seededRng(42)));
  });
});

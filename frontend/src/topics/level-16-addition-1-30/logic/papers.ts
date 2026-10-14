/** Task 1: bits of paper lying on the floor. Pure generators so they can be unit-tested. */

export type Rng = () => number;

export interface Paper {
  id: number;
  x: number; // centre, % of canvas width
  y: number; // centre, % of canvas height
  rot: number;
  w: number;
  h: number;
  clip: string;
  color: string;
}

export const PAPER_COLORS = [
  '#e63946',
  '#f4a300',
  '#2a9d4f',
  '#1d7fd6',
  '#8e44ad',
  '#ff7a1a',
  '#14b8a6',
  '#ec4899',
];

export const MIN_PAPERS = 1;
export const MAX_PAPERS = 20;
export const DEFAULT_PAPERS = 7;

const rand = (rng: Rng, min: number, max: number) => min + rng() * (max - min);
const clamp = (v: number) => Math.min(100, Math.max(0, v));
const toClip = (pts: [number, number][]) =>
  `polygon(${pts.map(([x, y]) => `${clamp(x).toFixed(1)}% ${clamp(y).toFixed(1)}%`).join(', ')})`;

// ragged blob: points around a centre with uneven radii, like a crumpled scrap
const scrapClip = (rng: Rng) => {
  const n = 6 + Math.floor(rng() * 4);
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const ang = ((i + rand(rng, -0.35, 0.35)) / n) * Math.PI * 2;
    const r = rand(rng, 0.55, 1) * 50;
    pts.push([50 + r * Math.cos(ang), 50 + r * Math.sin(ang)]);
  }
  return toClip(pts);
};

// roughly torn rectangle: jittered corners plus extra points along the edges
const tornClip = (rng: Rng) => {
  const j = () => rand(rng, -9, 9);
  return toClip([
    [4 + j(), 4 + j()],
    [rand(rng, 35, 65), rand(rng, 0, 8)],
    [96 + j(), 4 + j()],
    [100 - rand(rng, 0, 8), rand(rng, 35, 65)],
    [96 + j(), 96 + j()],
    [rand(rng, 35, 65), 100 - rand(rng, 0, 8)],
    [4 + j(), 96 + j()],
    [rand(rng, 0, 8), rand(rng, 35, 65)],
  ]);
};

// ripped-off corner: a triangle-ish piece with one extra ragged point
const triangleClip = (rng: Rng) =>
  toClip([
    [rand(rng, 30, 70), rand(rng, 0, 10)],
    [rand(rng, 85, 100), rand(rng, 78, 100)],
    [rand(rng, 45, 60), rand(rng, 88, 100)],
    [rand(rng, 0, 15), rand(rng, 75, 100)],
  ]);

const randomPaperLook = (rng: Rng) => {
  const kind = Math.floor(rng() * 5);
  if (kind === 0) return { w: rand(rng, 40, 52), h: rand(rng, 76, 92), clip: tornClip(rng) }; // strip
  if (kind === 1) return { w: rand(rng, 78, 94), h: rand(rng, 38, 50), clip: tornClip(rng) }; // sideways strip
  if (kind === 2) return { w: rand(rng, 56, 76), h: rand(rng, 56, 76), clip: triangleClip(rng) };
  if (kind === 3) return { w: rand(rng, 54, 74), h: rand(rng, 54, 74), clip: tornClip(rng) };
  return { w: rand(rng, 52, 78), h: rand(rng, 52, 78), clip: scrapClip(rng) };
};

/** True when a point (canvas %) falls in the bottom-right corner reserved for the basket. */
export const isInBasketCorner = (x: number, y: number) => x > 62 && y > 50;

export const makePapers = (count: number, rng: Rng = Math.random): Paper[] =>
  Array.from({ length: count }, (_, i) => {
    let x = 0;
    let y = 0;
    do {
      x = rand(rng, 8, 80);
      y = rand(rng, 12, 86);
    } while (isInBasketCorner(x, y));
    return {
      id: i,
      x,
      y,
      rot: Math.round(rng() * 360),
      ...randomPaperLook(rng),
      color: PAPER_COLORS[(i + Math.floor(rng() * PAPER_COLORS.length)) % PAPER_COLORS.length],
    };
  });

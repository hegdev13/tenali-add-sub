import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { RotateCcw, Shuffle } from 'lucide-react';
import { WinOverlay } from '../../../components/WinOverlay';
import '../level16.css';

interface Paper {
  id: number;
  x: number; // centre, % of canvas width
  y: number; // centre, % of canvas height
  rot: number;
  w: number;
  h: number;
  clip: string;
  color: string;
}

interface Float {
  id: number;
}

const PAPER_COLORS = [
  '#e63946',
  '#f4a300',
  '#2a9d4f',
  '#1d7fd6',
  '#8e44ad',
  '#ff7a1a',
  '#14b8a6',
  '#ec4899',
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (v: number) => Math.min(100, Math.max(0, v));
const toClip = (pts: [number, number][]) =>
  `polygon(${pts.map(([x, y]) => `${clamp(x).toFixed(1)}% ${clamp(y).toFixed(1)}%`).join(', ')})`;

// ragged blob: points around a centre with uneven radii, like a crumpled scrap
const scrapClip = () => {
  const n = 6 + Math.floor(Math.random() * 4);
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const ang = ((i + rand(-0.35, 0.35)) / n) * Math.PI * 2;
    const r = rand(0.55, 1) * 50;
    pts.push([50 + r * Math.cos(ang), 50 + r * Math.sin(ang)]);
  }
  return toClip(pts);
};

// roughly torn rectangle: jittered corners plus extra points along the edges
const tornClip = () => {
  const j = () => rand(-9, 9);
  return toClip([
    [4 + j(), 4 + j()],
    [rand(35, 65), 0 + rand(0, 8)],
    [96 + j(), 4 + j()],
    [100 - rand(0, 8), rand(35, 65)],
    [96 + j(), 96 + j()],
    [rand(35, 65), 100 - rand(0, 8)],
    [4 + j(), 96 + j()],
    [rand(0, 8), rand(35, 65)],
  ]);
};

// ripped-off corner: a triangle-ish piece with one extra ragged point
const triangleClip = () =>
  toClip([
    [rand(30, 70), rand(0, 10)],
    [rand(85, 100), rand(78, 100)],
    [rand(45, 60), rand(88, 100)],
    [rand(0, 15), rand(75, 100)],
  ]);

const randomPaperLook = () => {
  const kind = Math.floor(Math.random() * 5);
  if (kind === 0) return { w: rand(40, 52), h: rand(76, 92), clip: tornClip() }; // strip
  if (kind === 1) return { w: rand(78, 94), h: rand(38, 50), clip: tornClip() }; // strip, sideways
  if (kind === 2) return { w: rand(56, 76), h: rand(56, 76), clip: triangleClip() };
  if (kind === 3) return { w: rand(54, 74), h: rand(54, 74), clip: tornClip() };
  return { w: rand(52, 78), h: rand(52, 78), clip: scrapClip() };
};

const RHYME = [
  'Bits of paper, bits of paper,',
  'Lying on the floor,',
  'Make the classroom untidy,',
  'Pick them up, pick them up',
];




const makePapers = (count: number): Paper[] =>
  Array.from({ length: count }, (_, i) => {
    let x = 0;
    let y = 0;
    // keep papers clear of the bin in the bottom-right corner
    do {
      x = 8 + Math.random() * 72;
      y = 12 + Math.random() * 74;
    } while (x > 62 && y > 50);
    return {
      id: i,
      x,
      y,
      rot: Math.round(Math.random() * 360),
      ...randomPaperLook(),
      color: PAPER_COLORS[(i + Math.floor(Math.random() * PAPER_COLORS.length)) % PAPER_COLORS.length],
    };
  });

const DEFAULT_COUNT = 7;

const BasketIcon = () => (
  <svg width="120" height="104" viewBox="0 0 120 104" aria-hidden="true">
    <path d="M14 30 L106 30 L94 98 Q93 102 88 102 L32 102 Q27 102 26 98 Z" fill="#c8924f" />
    <path d="M18 52 L102 52 M22 74 L98 74" stroke="#8a5a26" strokeWidth="3" fill="none" />
    <path d="M44 32 L40 100 M60 32 L60 102 M76 32 L80 100" stroke="#8a5a26" strokeWidth="3" fill="none" />
    <rect x="8" y="20" width="104" height="14" rx="7" fill="#e0ab66" stroke="#8a5a26" strokeWidth="3" />
  </svg>
);

interface Task1PaperBinProps {
  onNext: () => void;
}

export const Task1PaperBin = ({ onNext }: Task1PaperBinProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const binRef = useRef<HTMLDivElement>(null);
  const floatSeq = useRef(0);

  const [papers, setPapers] = useState<Paper[]>(() => makePapers(DEFAULT_COUNT));
  const [binCount, setBinCount] = useState(0);
  const [floats, setFloats] = useState<Float[]>([]);
  const [dragId, setDragId] = useState<number | null>(null);
  const [overBin, setOverBin] = useState(false);
  const [total, setTotal] = useState(DEFAULT_COUNT);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(DEFAULT_COUNT);
  const [showWin, setShowWin] = useState(false);

  const isOverBin = (clientX: number, clientY: number) => {
    const r = binRef.current?.getBoundingClientRect();
    if (!r) return false;
    const pad = 16;
    return (
      clientX >= r.left - pad &&
      clientX <= r.right + pad &&
      clientY >= r.top - pad &&
      clientY <= r.bottom + pad
    );
  };

  const handleDown = (e: ReactPointerEvent<HTMLDivElement>, id: number) => {
    e.preventDefault(); // stops the browser from selecting text while dragging
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragId(id);
  };

  const handleMove = (e: ReactPointerEvent<HTMLDivElement>, id: number) => {
    if (dragId !== id) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(98, Math.max(2, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(98, Math.max(2, ((e.clientY - rect.top) / rect.height) * 100));
    setPapers((ps) => ps.map((p) => (p.id === id ? { ...p, x, y } : p)));
    setOverBin(isOverBin(e.clientX, e.clientY));
  };

  const handleUp = (e: ReactPointerEvent<HTMLDivElement>, id: number) => {
    if (dragId !== id) return;
    setDragId(null);
    setOverBin(false);
    if (isOverBin(e.clientX, e.clientY)) {
      setPapers((ps) => ps.filter((p) => p.id !== id));
      setBinCount((c) => c + 1);
      floatSeq.current += 1;
      setFloats((f) => [...f, { id: floatSeq.current }]);
    }
  };

  const spread = (n: number) => {
    setTotal(n);
    setPapers(makePapers(n));
    setBinCount(0);
    setFloats([]);
    setPickerOpen(false);
  };

  const done = papers.length === 0;

  // let the last "+1" finish before the celebration appears
  useEffect(() => {
    if (!done) {
      setShowWin(false);
      return;
    }
    const t = window.setTimeout(() => setShowWin(true), 1900);
    return () => window.clearTimeout(t);
  }, [done]);


  return (
    <section className="refresher-card" id="refresher-count-bin">
      <h2 className="task-heading" id="task-1-heading">
        Task 1
      </h2>
      <div className="refresher-head">
        <span className="refresher-tag">Refresher</span>
        <p className="refresher-caption" id="refresher-caption">
          {done ? 'All papers are in the bin!' : 'Put every paper in the bin'}
        </p>
      </div>

      <div className="refresher-controls">
        <button id="refresher-reset-btn" className="btn btn-secondary" onClick={() => spread(total)}>
          <RotateCcw size={15} /> Reset
        </button>
        <div className="spread-wrap">
          <button
            id="refresher-spread-btn"
            className="btn btn-primary"
            aria-expanded={pickerOpen}
            onClick={() => {
              setSliderValue(total);
              setPickerOpen((o) => !o);
            }}
          >
            <Shuffle size={15} /> Spread papers
          </button>
          {pickerOpen && (
            <div className="spread-picker" id="refresher-spread-picker">
              <div className="spread-value" id="refresher-spread-value">
                {sliderValue}
              </div>
              <input
                id="refresher-spread-slider"
                className="spread-slider"
                type="range"
                min={1}
                max={20}
                step={1}
                value={sliderValue}
                aria-label="Number of paper bits"
                onChange={(e) => setSliderValue(Number(e.target.value))}
              />
              <div className="spread-scale">
                <span>1</span>
                <span>20</span>
              </div>
              <button
                id="refresher-spread-go-btn"
                className="btn btn-primary"
                onClick={() => spread(sliderValue)}
              >
                Spread
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="paper-canvas" ref={canvasRef} id="refresher-canvas">
        {papers.map((p) => (
          <div
            key={p.id}
            id={`refresher-paper-${p.id}`}
            className={`paper-bit ${dragId === p.id ? 'dragging' : ''}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.w,
              height: p.h,
              transform: `translate(-50%, -50%) rotate(${p.rot}deg) scale(${dragId === p.id ? 1.12 : 1})`,
            }}
            onPointerDown={(e) => handleDown(e, p.id)}
            onPointerMove={(e) => handleMove(e, p.id)}
            onPointerUp={(e) => handleUp(e, p.id)}
            onPointerCancel={() => {
              setDragId(null);
              setOverBin(false);
            }}
          >
            <div
              className="paper-face"
              style={{ clipPath: p.clip, background: p.color }}
            />
          </div>
        ))}

        <div className="bin-zone">
          <div
            className={`bin-count ${binCount === 0 ? 'empty' : ''}`}
            id="refresher-bin-count"
            aria-live="polite"
          >
            {binCount > 0 ? binCount : '\u00A0'}
          </div>
          <div className={`bin-body ${overBin ? 'bin-hover' : ''}`} ref={binRef} id="refresher-bin">
            <BasketIcon />
            {floats.map((f) => (
              <span
                key={f.id}
                className="plus-one"
                onAnimationEnd={() => setFloats((fs) => fs.filter((x) => x.id !== f.id))}
              >
                +1
              </span>
            ))}
          </div>
        </div>

        {showWin && (
          <WinOverlay
            idPrefix="refresher"
            title="You made the place tidy!"
            onTryAgain={() => spread(total)}
            onNext={onNext}
          />
        )}
      </div>

      <div className="rhyme-card" id="rhyme-bits-of-paper">
        <h3 className="rhyme-title">Bits of Paper</h3>
        {RHYME.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

    </section>
  );
};

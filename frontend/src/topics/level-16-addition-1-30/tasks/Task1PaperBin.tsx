import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { RotateCcw, Shuffle } from 'lucide-react';
import { WinOverlay } from '../../../components/WinOverlay';
import { HintHand } from '../../../components/HintHand';
import { PlusOne } from '../../../components/PlusOne';
import { useIdleHint } from '../../../hooks/useIdleHint';
import { useFloats } from '../../../hooks/useFloats';
import { useDelayedFlag } from '../../../hooks/useDelayedFlag';
import {
  canvasPercent,
  isPointInside,
  pathBetween,
  startPointerDrag,
  type HintPath,
} from '../../../lib/canvas';
import { DEFAULT_PAPERS, MAX_PAPERS, MIN_PAPERS, makePapers, type Paper } from '../logic/papers';
import '../level16.css';

const BIN_HIT_PAD = 16;

const RHYME = [
  'Bits of paper, bits of paper,',
  'Lying on the floor,',
  'Make the classroom untidy,',
  'Pick them up, pick them up',
];

type Hint = HintPath & { paper: Paper };

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

  const [papers, setPapers] = useState<Paper[]>(() => makePapers(DEFAULT_PAPERS));
  const [binCount, setBinCount] = useState(0);
  const [dragId, setDragId] = useState<number | null>(null);
  const [overBin, setOverBin] = useState(false);
  const [total, setTotal] = useState(DEFAULT_PAPERS);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(DEFAULT_PAPERS);
  const plusOnes = useFloats();

  const done = papers.length === 0;
  // let the last "+1" finish before the celebration appears
  const showWin = useDelayedFlag(done, 1900);

  // after 3 seconds of silence, a hand shows a paper going into the basket
  const { hint, poke } = useIdleHint<Hint>(() => {
    const canvas = canvasRef.current;
    const bin = binRef.current;
    const paper = papers[0];
    const paperEl = paper && canvas?.querySelector<HTMLElement>(`#refresher-paper-${paper.id}`);
    if (!canvas || !bin || !paperEl) return null;
    return { paper, ...pathBetween(canvas, paperEl, bin) };
  });

  const handleDown = (e: ReactPointerEvent<HTMLDivElement>, id: number) => {
    startPointerDrag(e);
    setDragId(id);
  };

  const handleMove = (e: ReactPointerEvent<HTMLDivElement>, id: number) => {
    if (dragId !== id) return;
    const pos = canvasPercent(canvasRef.current, e.clientX, e.clientY);
    if (!pos) return;
    setPapers((ps) => ps.map((p) => (p.id === id ? { ...p, ...pos } : p)));
    setOverBin(isPointInside(binRef.current, e.clientX, e.clientY, BIN_HIT_PAD));
    poke();
  };

  const handleUp = (e: ReactPointerEvent<HTMLDivElement>, id: number) => {
    if (dragId !== id) return;
    setDragId(null);
    setOverBin(false);
    poke();
    if (isPointInside(binRef.current, e.clientX, e.clientY, BIN_HIT_PAD)) {
      setPapers((ps) => ps.filter((p) => p.id !== id));
      setBinCount((c) => c + 1);
      plusOnes.add();
    }
  };

  const spread = (n: number) => {
    setTotal(n);
    setPapers(makePapers(n));
    setBinCount(0);
    plusOnes.clear();
    setPickerOpen(false);
  };

  return (
    <section className="refresher-card" id="refresher-count-bin" onPointerDown={poke}>
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
                min={MIN_PAPERS}
                max={MAX_PAPERS}
                step={1}
                value={sliderValue}
                aria-label="Number of paper bits"
                onChange={(e) => setSliderValue(Number(e.target.value))}
              />
              <div className="spread-scale">
                <span>{MIN_PAPERS}</span>
                <span>{MAX_PAPERS}</span>
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
            <div className="paper-face" style={{ clipPath: p.clip, background: p.color }} />
          </div>
        ))}

        <div className="bin-zone">
          <div
            className={`bin-count ${binCount === 0 ? 'empty' : ''}`}
            id="refresher-bin-count"
            aria-live="polite"
          >
            {binCount > 0 ? binCount : ' '}
          </div>
          <div className={`bin-body ${overBin ? 'bin-hover' : ''}`} ref={binRef} id="refresher-bin">
            <BasketIcon />
            {plusOnes.floats.map((f) => (
              <PlusOne key={f.id} onDone={() => plusOnes.remove(f.id)} />
            ))}
          </div>
        </div>

        {hint && dragId === null && !done && (
          <HintHand
            key={`${hint.paper.id}-${hint.sx}-${hint.ex}`}
            sx={hint.sx}
            sy={hint.sy}
            ex={hint.ex}
            ey={hint.ey}
            size={hint.paper.w}
            height={hint.paper.h}
            color={hint.paper.color}
            clip={hint.paper.clip}
          />
        )}

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

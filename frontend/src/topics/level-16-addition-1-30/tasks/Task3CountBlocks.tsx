import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { RotateCcw, ThumbsUp } from 'lucide-react';
import { WinOverlay } from '../../../components/WinOverlay';
import { HintHand } from '../../../components/HintHand';
import '../level16.css';

const TOTAL = 10;
const BLOCK = 56;
const FRAME = 69; // same frame proportions as Task 2
const BLOCK_COLOR = '#1d7fd6';
// a correct step: let the canvas "+1" show, dim the canvas for the thumbs up, restore it, then move on
const CHEER_DELAY_MS = 600;
const CHEER_MS = 1300;
const RESTORE_MS = 400;
const IDLE_MS = 3000;

interface LooseBlock {
  id: number;
  x: number; // centre, % of canvas width
  y: number; // centre, % of canvas height
  rot: number;
}

interface DragState {
  id: number;
  startX: number; // where it was lying before the drag
  startY: number;
}

// blocks lie scattered along the bottom of the canvas, like the bits of paper in Task 1
const makeBlocks = (): LooseBlock[] => {
  const blocks: LooseBlock[] = [];
  for (let id = 0; id < TOTAL; id++) {
    let x = 0;
    let y = 0;
    for (let attempt = 0; attempt < 40; attempt++) {
      x = 6 + Math.random() * 88;
      y = 58 + Math.random() * 32;
      // keep them from sitting on top of each other (canvas is roughly 900 x 380)
      const clear = blocks.every((b) => Math.hypot((b.x - x) * 9, (b.y - y) * 3.8) > BLOCK + 8);
      if (clear) break;
    }
    blocks.push({ id, x, y, rot: Math.round(Math.random() * 50 - 25) });
  }
  return blocks;
};

interface Hint {
  sx: number;
  sy: number;
  ex: number;
  ey: number;
}

interface Float {
  id: number;
  slot?: number;
}

interface Task3CountBlocksProps {
  onNext: () => void;
}

export const Task3CountBlocks = ({ onNext }: Task3CountBlocksProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const idleRef = useRef<number | undefined>(undefined);
  const floatSeq = useRef(0);
  const stateRef = useRef<{ placed: number; step: number; blocks: LooseBlock[] }>({
    placed: 0,
    step: 1,
    blocks: [],
  });

  const [step, setStep] = useState(1); // how many blocks the reference shows
  const [placed, setPlaced] = useState(0); // blocks the child has put in the frame
  const [blocks, setBlocks] = useState<LooseBlock[]>(makeBlocks); // blocks still lying on the floor
  const [drag, setDrag] = useState<DragState | null>(null);
  const [hint, setHint] = useState<Hint | null>(null);
  const [rejectSlot, setRejectSlot] = useState<number | null>(null);
  const [canvasFloats, setCanvasFloats] = useState<Float[]>([]);
  const [refBlockFloats, setRefBlockFloats] = useState<Float[]>([]);
  const [refCountFloats, setRefCountFloats] = useState<Float[]>([]);
  const [showWin, setShowWin] = useState(false);
  const [cheer, setCheer] = useState(false);

  const waiting = placed >= step; // matched the reference, waiting for the next step
  const done = step === TOTAL && placed === TOTAL;

  useEffect(() => {
    stateRef.current = { placed, step, blocks };
  }, [placed, step, blocks]);

  // where the hand should go: first block left in the tray -> leftmost empty slot
  const computeHint = useCallback((): Hint | null => {
    const canvas = canvasRef.current;
    const { placed: p, step: s, blocks: bs } = stateRef.current;
    if (!canvas || p >= s) return null;
    const first = bs[0];
    const blockEl = first && canvas.querySelector<HTMLElement>(`[data-block-id="${first.id}"]`);
    const slotEl = slotRefs.current[p];
    if (!blockEl || !slotEl) return null;
    const c = canvas.getBoundingClientRect();
    const b = blockEl.getBoundingClientRect();
    const s2 = slotEl.getBoundingClientRect();
    return {
      sx: b.left + b.width / 2 - c.left,
      sy: b.top + b.height / 2 - c.top,
      ex: s2.left + s2.width / 2 - c.left,
      ey: s2.top + s2.height / 2 - c.top,
    };
  }, []);

  const poke = useCallback(() => {
    window.clearTimeout(idleRef.current);
    setHint((h) => (h ? null : h));
    idleRef.current = window.setTimeout(() => setHint(computeHint()), IDLE_MS);
  }, [computeHint]);

  useEffect(() => {
    poke();
    return () => window.clearTimeout(idleRef.current);
  }, [poke]);

  // matched the reference: thumbs up, then the next step (or the finish at 10)
  useEffect(() => {
    if (placed !== step) return;
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setCheer(true), CHEER_DELAY_MS));
    timers.push(window.setTimeout(() => setCheer(false), CHEER_DELAY_MS + CHEER_MS));
    const after = CHEER_DELAY_MS + CHEER_MS + RESTORE_MS;
    if (step < TOTAL) {
      timers.push(
        window.setTimeout(() => {
          floatSeq.current += 1;
          const id = floatSeq.current;
          // "+1" beside the latest block, and on the counter, as the new block appears
          setRefBlockFloats((f) => [...f, { id, slot: step - 1 }]);
          setRefCountFloats((f) => [...f, { id }]);
          setStep(step + 1);
          // fresh canvas for every step
          setPlaced(0);
          setBlocks(makeBlocks());
          setCanvasFloats([]);
          poke();
        }, after)
      );
    } else {
      window.clearTimeout(idleRef.current);
      timers.push(window.setTimeout(() => setShowWin(true), after));
    }
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      setCheer(false);
    };
  }, [placed, step, poke]);

  const reset = () => {
    setStep(1);
    setPlaced(0);
    setBlocks(makeBlocks());
    setDrag(null);
    setCanvasFloats([]);
    setRefBlockFloats([]);
    setRefCountFloats([]);
    setShowWin(false);
    poke();
  };

  const slotAt = (clientX: number, clientY: number) =>
    slotRefs.current.findIndex((el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      const pad = 6;
      return (
        clientX >= r.left - pad &&
        clientX <= r.right + pad &&
        clientY >= r.top - pad &&
        clientY <= r.bottom + pad
      );
    });

  const handleDown = (e: ReactPointerEvent<HTMLDivElement>, block: LooseBlock) => {
    if (waiting) return;
    e.preventDefault(); // stops the browser from selecting text while dragging
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ id: block.id, startX: block.x, startY: block.y });
  };

  const handleMove = (e: ReactPointerEvent<HTMLDivElement>, id: number) => {
    if (drag?.id !== id) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(97, Math.max(3, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(97, Math.max(3, ((e.clientY - rect.top) / rect.height) * 100));
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, x, y } : b)));
    poke();
  };

  const handleUp = (e: ReactPointerEvent<HTMLDivElement>, id: number) => {
    if (drag?.id !== id) return;
    const { startX, startY } = drag;
    setDrag(null);
    poke();

    const target = slotAt(e.clientX, e.clientY);
    if (target < 0) return; // left lying wherever it was dropped on the floor
    if (target === placed) {
      setBlocks((bs) => bs.filter((b) => b.id !== id));
      setPlaced((p) => p + 1);
      floatSeq.current += 1;
      const fid = floatSeq.current;
      setCanvasFloats((f) => [...f, { id: fid }]);
    } else {
      // only the leftmost empty box takes the next block: this one goes back
      setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, x: startX, y: startY } : b)));
      setRejectSlot(target);
      window.setTimeout(() => setRejectSlot(null), 500);
    }
  };

  const block = (extra = '') => (
    <div className={`num-block count-block ${extra}`} style={{ width: BLOCK, height: BLOCK, background: BLOCK_COLOR }} />
  );

  return (
    <section className="refresher-card" id="count-blocks-task">
      <h2 className="task-heading" id="task-3-heading">
        Task 3
      </h2>
      <div className="refresher-head">
        <p className="refresher-caption" id="count-caption">
          Put the blocks to match the top
        </p>
      </div>

      <div className="refresher-controls">
        <button id="count-reset-btn" className="btn btn-secondary" onClick={reset}>
          <RotateCcw size={15} /> Reset
        </button>
      </div>

      <div className="order-reference" id="count-reference">
        <div className="order-row" id="count-reference-row">
          {Array.from({ length: TOTAL }, (_, i) => (
            <div key={i} className="frame-cell">
              <div className="slot-outline" style={{ width: FRAME, height: FRAME }}>
                {i < step && block(i === step - 1 && step > 1 ? 'pop-in' : '')}
              </div>
              {refBlockFloats
                .filter((f) => f.slot === i)
                .map((f) => (
                  <span
                    key={f.id}
                    className="plus-one plus-one-side"
                    onAnimationEnd={() => setRefBlockFloats((fs) => fs.filter((x) => x.id !== f.id))}
                  >
                    +1
                  </span>
                ))}
            </div>
          ))}
          <div className="count-badge" id="count-reference-value">
            = {step}
            {refCountFloats.map((f) => (
              <span
                key={f.id}
                className="plus-one"
                onAnimationEnd={() => setRefCountFloats((fs) => fs.filter((x) => x.id !== f.id))}
              >
                +1
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="canvas-wrap">
      <div
        className={`order-canvas count-canvas ${cheer ? 'dimmed' : ''}`}
        ref={canvasRef}
        id="count-canvas"
        onPointerDown={poke}
      >
        <div className="order-row" id="count-slots">
          {Array.from({ length: TOTAL }, (_, i) => (
            <div
              key={i}
              id={`count-slot-${i + 1}`}
              className="frame-cell"
              ref={(el) => {
                slotRefs.current[i] = el;
              }}
            >
              <div
                className={`slot-outline ${rejectSlot === i ? 'reject' : ''}`}
                style={{ width: FRAME, height: FRAME }}
              >
                {i < placed && block()}
              </div>
            </div>
          ))}
          <div
            className={`count-badge ${placed === 0 ? 'empty' : ''}`}
            id="count-canvas-value"
            aria-live="polite"
          >
            {placed > 0 ? `= ${placed}` : '\u00A0'}
            {canvasFloats.map((f) => (
              <span
                key={f.id}
                className="plus-one"
                onAnimationEnd={() => setCanvasFloats((fs) => fs.filter((x) => x.id !== f.id))}
              >
                +1
              </span>
            ))}
          </div>
        </div>

        {blocks.map((b) => (
          <div
            key={b.id}
            id={`count-block-${b.id}`}
            data-block-id={b.id}
            className={`num-block count-block loose-block ${drag?.id === b.id ? 'dragging' : ''}`}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: BLOCK,
              height: BLOCK,
              background: BLOCK_COLOR,
              transform: `translate(-50%, -50%) rotate(${b.rot}deg) scale(${drag?.id === b.id ? 1.12 : 1})`,
            }}
            onPointerDown={(e) => handleDown(e, b)}
            onPointerMove={(e) => handleMove(e, b.id)}
            onPointerUp={(e) => handleUp(e, b.id)}
            onPointerCancel={() => setDrag(null)}
          />
        ))}

        {hint && !drag && !done && !waiting && (
          <HintHand
            key={`${placed}-${hint.sx}-${hint.ex}`}
            sx={hint.sx}
            sy={hint.sy}
            ex={hint.ex}
            ey={hint.ey}
            size={BLOCK}
            color={BLOCK_COLOR}
          />
        )}

        {showWin && (
          <WinOverlay
            idPrefix="count"
            title="You counted to 10!"
            onTryAgain={reset}
            onNext={onNext}
          />
        )}
      </div>
        {cheer && (
          <div className="thumbs-up" id="count-thumbs-up" aria-hidden="true">
            <ThumbsUp size={170} strokeWidth={1.6} />
          </div>
        )}
      </div>
    </section>
  );
};

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { RotateCcw } from 'lucide-react';
import { HintHand } from '../../../components/HintHand';
import { WinOverlay } from '../../../components/WinOverlay';
import '../level16.css';

const COUNT = 10;
const VALUES = Array.from({ length: COUNT }, (_, i) => i + 1);
const IDLE_MS = 3000;

const BLOCK_COLORS = [
  '#e63946',
  '#f4a300',
  '#2a9d4f',
  '#1d7fd6',
  '#8e44ad',
  '#ff7a1a',
  '#14b8a6',
  '#ec4899',
  '#6c8f1f',
  '#3b5bdb',
];

// the frame of 10 boxes stays on screen; each box is a little larger than the biggest block
const SLOT_SIZE = 69;

// each block is slightly bigger than the one before it
const sizeOf = (v: number) => 34 + (v - 1) * 3;

const shuffled = (): (number | null)[] => {
  let arr = [...VALUES];
  do {
    arr = [...VALUES];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } while (arr.every((v, i) => v === i + 1));
  return arr;
};

type Origin = { kind: 'tray' | 'slot'; index: number };

interface DragState {
  value: number;
  origin: Origin;
  x: number; // centre, px inside the canvas
  y: number;
}

interface Hint {
  value: number;
  sx: number;
  sy: number;
  ex: number;
  ey: number;
}

interface Task2OrderBlocksProps {
  onNext: () => void;
}

export const Task2OrderBlocks = ({ onNext }: Task2OrderBlocksProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const idleRef = useRef<number | undefined>(undefined);
  const slotsRef = useRef<(number | null)[]>([]);

  const [slots, setSlots] = useState<(number | null)[]>(() => Array(COUNT).fill(null));
  const [tray, setTray] = useState<(number | null)[]>(shuffled);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [hint, setHint] = useState<Hint | null>(null);
  const [showWin, setShowWin] = useState(false);

  const allFilled = slots.every((v) => v !== null);
  const done = slots.every((v, i) => v === i + 1);

  useEffect(() => {
    slotsRef.current = slots;
  }, [slots]);

  // work out the next helpful move: the smallest block not yet in its place
  const computeHint = useCallback((): Hint | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const cur = slotsRef.current;
    const value = VALUES.find((v) => cur[v - 1] !== v);
    if (!value) return null;
    const blockEl = canvas.querySelector<HTMLElement>(`[data-block="${value}"]`);
    const slotEl = slotRefs.current[value - 1];
    if (!blockEl || !slotEl) return null;
    const c = canvas.getBoundingClientRect();
    const b = blockEl.getBoundingClientRect();
    const s = slotEl.getBoundingClientRect();
    return {
      value,
      sx: b.left + b.width / 2 - c.left,
      sy: b.top + b.height / 2 - c.top,
      ex: s.left + s.width / 2 - c.left,
      ey: s.top + s.height / 2 - c.top,
    };
  }, []);

  // any user input hides the hint and restarts the 3 second silence timer
  const poke = useCallback(() => {
    window.clearTimeout(idleRef.current);
    setHint((h) => (h ? null : h));
    idleRef.current = window.setTimeout(() => setHint(computeHint()), IDLE_MS);
  }, [computeHint]);

  useEffect(() => {
    poke();
    return () => window.clearTimeout(idleRef.current);
  }, [poke]);

  useEffect(() => {
    if (!done) {
      setShowWin(false);
      return;
    }
    window.clearTimeout(idleRef.current);
    const t = window.setTimeout(() => setShowWin(true), 700);
    return () => window.clearTimeout(t);
  }, [done]);

  const reset = () => {
    setSlots(Array(COUNT).fill(null));
    setTray(shuffled());
    setDrag(null);
    setShowWin(false);
    poke();
  };

  const toCanvas = (clientX: number, clientY: number) => {
    const r = canvasRef.current?.getBoundingClientRect();
    return r ? { x: clientX - r.left, y: clientY - r.top } : { x: 0, y: 0 };
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

  const handleDown = (e: ReactPointerEvent<HTMLDivElement>, value: number, origin: Origin) => {
    if (done) return;
    e.preventDefault(); // stops the browser from selecting text while dragging
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = toCanvas(e.clientX, e.clientY);
    setDrag({ value, origin, x, y });
  };

  const handleMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    const { x, y } = toCanvas(e.clientX, e.clientY);
    setDrag({ ...drag, x, y });
    poke();
  };

  const handleUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    const { value, origin } = drag;
    setDrag(null);
    poke();

    const target = slotAt(e.clientX, e.clientY);
    if (origin.kind === 'slot' && target === origin.index) return;

    const nextSlots = [...slots];
    const nextTray = [...tray];
    if (origin.kind === 'slot') nextSlots[origin.index] = null;
    else nextTray[origin.index] = null;

    if (target >= 0) {
      const occupant = nextSlots[target];
      nextSlots[target] = value;
      if (occupant !== null) {
        // the block that was there swaps into the cell the dragged block came from
        if (origin.kind === 'slot') nextSlots[origin.index] = occupant;
        else nextTray[origin.index] = occupant;
      }
    } else if (origin.kind === 'slot') {
      // dropped outside any slot: send it back to the tray
      const free = nextTray.indexOf(null);
      nextTray[free >= 0 ? free : 0] = value;
    } else {
      nextTray[origin.index] = value;
    }
    setSlots(nextSlots);
    setTray(nextTray);
  };

  const renderBlock = (value: number, origin: Origin) => {
    const size = sizeOf(value);
    const wrong = allFilled && !done && origin.kind === 'slot' && value !== origin.index + 1;
    const lifted = drag?.value === value;
    return (
      <div
        key={`${origin.kind}-${origin.index}`}
        id={`order-block-${value}`}
        data-block={value}
        className={`num-block ${wrong ? 'wrong' : ''} ${lifted ? 'lifted' : ''}`}
        style={{ width: size, height: size, background: BLOCK_COLORS[value - 1], fontSize: size * 0.5 }}
        onPointerDown={(e) => handleDown(e, value, origin)}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={() => setDrag(null)}
      >
        {value}
      </div>
    );
  };

  return (
    <section className="refresher-card" id="order-blocks-task">
      <h2 className="task-heading" id="task-2-heading">
        Task 2
      </h2>
      <div className="refresher-head">
        <p className="refresher-caption" id="order-caption">
          Arrange the blocks in order, like the top row
        </p>
      </div>

      <div className="refresher-controls">
        <button id="order-reset-btn" className="btn btn-secondary" onClick={reset}>
          <RotateCcw size={15} /> Reset
        </button>
      </div>

      <div className="order-reference" id="order-reference">
        <p className="order-reference-label" id="order-reference-label">
          Arrange the blocks like this!
        </p>
      <div className="order-row order-ref-row" id="order-reference-row">
        {VALUES.map((v) => (
          <div
            key={v}
            className="num-block ref-block"
            style={{
              width: sizeOf(v),
              height: sizeOf(v),
              background: BLOCK_COLORS[v - 1],
              fontSize: sizeOf(v) * 0.5,
            }}
          >
            {v}
          </div>
        ))}
      </div>
      </div>

      <div className="order-canvas" ref={canvasRef} id="order-canvas" onPointerDown={poke}>
        <div className="order-row order-slot-row" id="order-slots">
          {slots.map((v, i) => (
            <div
              key={i}
              id={`order-slot-${i + 1}`}
              className="order-slot"
              ref={(el) => {
                slotRefs.current[i] = el;
              }}
            >
              <div className="slot-outline" style={{ width: SLOT_SIZE, height: SLOT_SIZE }}>
                {v === null ? (
                  <span className="slot-blank">__</span>
                ) : (
                  renderBlock(v, { kind: 'slot', index: i })
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="order-row order-tray-row" id="order-tray">
          {tray.map((v, i) => (
            <div key={i} className="order-slot tray-cell">
              {v !== null && renderBlock(v, { kind: 'tray', index: i })}
            </div>
          ))}
        </div>

        {drag && (
          <div
            className="num-block drag-copy"
            style={{
              left: drag.x,
              top: drag.y,
              width: sizeOf(drag.value),
              height: sizeOf(drag.value),
              background: BLOCK_COLORS[drag.value - 1],
              fontSize: sizeOf(drag.value) * 0.5,
            }}
          >
            {drag.value}
          </div>
        )}

        {hint && !drag && !done && (
          <HintHand
            key={`${hint.value}-${hint.sx}-${hint.ex}`}
            sx={hint.sx}
            sy={hint.sy}
            ex={hint.ex}
            ey={hint.ey}
            size={sizeOf(hint.value)}
            color={BLOCK_COLORS[hint.value - 1]}
            label={hint.value}
          />
        )}

        {showWin && (
          <WinOverlay
            idPrefix="order"
            title="You put them in order!"
            onTryAgain={reset}
            onNext={onNext}
          />
        )}
      </div>
    </section>
  );
};

import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { RotateCcw } from 'lucide-react';
import { HintHand } from '../../../components/HintHand';
import { WinOverlay } from '../../../components/WinOverlay';
import { useIdleHint } from '../../../hooks/useIdleHint';
import { useDelayedFlag } from '../../../hooks/useDelayedFlag';
import {
  canvasPoint,
  indexOfElementAt,
  pathBetween,
  startPointerDrag,
  type HintPath,
} from '../../../lib/canvas';
import {
  ORDER_VALUES,
  allFilled,
  applyDrop,
  blockSize,
  emptySlots,
  isSolved,
  nextMisplaced,
  shuffledValues,
  type Cell,
  type Origin,
} from '../logic/order';
import '../level16.css';

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
const SLOT_HIT_PAD = 6;

interface DragState {
  value: number;
  origin: Origin;
  x: number; // centre, px inside the canvas
  y: number;
}

type Hint = HintPath & { value: number };

interface Task2OrderBlocksProps {
  onNext: () => void;
}

export const Task2OrderBlocks = ({ onNext }: Task2OrderBlocksProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [slots, setSlots] = useState<Cell[]>(emptySlots);
  const [tray, setTray] = useState<Cell[]>(shuffledValues);
  const [drag, setDrag] = useState<DragState | null>(null);

  const done = isSolved(slots);
  const showWin = useDelayedFlag(done, 700);

  // the next helpful move: the smallest block not yet in its place
  const { hint, poke } = useIdleHint<Hint>(() => {
    const canvas = canvasRef.current;
    const value = nextMisplaced(slots);
    if (!canvas || !value) return null;
    const blockEl = canvas.querySelector<HTMLElement>(`[data-block="${value}"]`);
    const slotEl = slotRefs.current[value - 1];
    if (!blockEl || !slotEl) return null;
    return { value, ...pathBetween(canvas, blockEl, slotEl) };
  });

  const reset = () => {
    setSlots(emptySlots());
    setTray(shuffledValues());
    setDrag(null);
    poke();
  };

  const handleDown = (e: ReactPointerEvent<HTMLDivElement>, value: number, origin: Origin) => {
    if (done) return;
    startPointerDrag(e);
    setDrag({ value, origin, ...canvasPoint(canvasRef.current, e.clientX, e.clientY) });
  };

  const handleMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    setDrag({ ...drag, ...canvasPoint(canvasRef.current, e.clientX, e.clientY) });
    poke();
  };

  const handleUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    const { value, origin } = drag;
    setDrag(null);
    poke();
    const target = indexOfElementAt(slotRefs.current, e.clientX, e.clientY, SLOT_HIT_PAD);
    const next = applyDrop(slots, tray, value, origin, target);
    setSlots(next.slots);
    setTray(next.tray);
  };

  const renderBlock = (value: number, origin: Origin) => {
    const size = blockSize(value);
    const wrong = allFilled(slots) && !done && origin.kind === 'slot' && value !== origin.index + 1;
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
          {ORDER_VALUES.map((v) => (
            <div
              key={v}
              className="num-block ref-block"
              style={{
                width: blockSize(v),
                height: blockSize(v),
                background: BLOCK_COLORS[v - 1],
                fontSize: blockSize(v) * 0.5,
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
              width: blockSize(drag.value),
              height: blockSize(drag.value),
              background: BLOCK_COLORS[drag.value - 1],
              fontSize: blockSize(drag.value) * 0.5,
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
            size={blockSize(hint.value)}
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

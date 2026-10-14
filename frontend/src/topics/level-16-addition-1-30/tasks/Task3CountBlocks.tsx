import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { RotateCcw, ThumbsUp } from 'lucide-react';
import { WinOverlay } from '../../../components/WinOverlay';
import { HintHand } from '../../../components/HintHand';
import { PlusOne } from '../../../components/PlusOne';
import { useIdleHint } from '../../../hooks/useIdleHint';
import { useFloats } from '../../../hooks/useFloats';
import { useDelayedFlag } from '../../../hooks/useDelayedFlag';
import {
  canvasPercent,
  indexOfElementAt,
  pathBetween,
  startPointerDrag,
  type HintPath,
} from '../../../lib/canvas';
import {
  COUNT_TOTAL,
  canPlace,
  isFinished,
  makeLooseBlocks,
  stepMatched,
  type LooseBlock,
} from '../logic/count';
import '../level16.css';

const BLOCK = 56;
const FRAME = 69; // same frame proportions as Task 2
const BLOCK_COLOR = '#1d7fd6';
const SLOT_HIT_PAD = 6;
// a correct step: let the canvas "+1" show, dim the canvas for the thumbs up, restore it, then move on
const CHEER_DELAY_MS = 600;
const CHEER_MS = 1300;
const RESTORE_MS = 400;
const AFTER_STEP_MS = CHEER_DELAY_MS + CHEER_MS + RESTORE_MS;

interface DragState {
  id: number;
  startX: number; // where it was lying before the drag
  startY: number;
}

interface Task3CountBlocksProps {
  onNext: () => void;
}

const newBlocks = () => makeLooseBlocks(BLOCK);

export const Task3CountBlocks = ({ onNext }: Task3CountBlocksProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [step, setStep] = useState(1); // how many blocks the reference shows
  const [placed, setPlaced] = useState(0); // blocks the child has put in the frame
  const [blocks, setBlocks] = useState<LooseBlock[]>(newBlocks); // blocks still lying on the floor
  const [drag, setDrag] = useState<DragState | null>(null);
  const [rejectSlot, setRejectSlot] = useState<number | null>(null);
  const [cheer, setCheer] = useState(false);

  const canvasPlus = useFloats(); // "+1" on the canvas counter
  const refBlockPlus = useFloats<{ slot: number }>(); // "+1" beside the latest reference block
  const refCountPlus = useFloats(); // "+1" on the reference counter

  const waiting = stepMatched(placed, step); // matched the reference, waiting for the next step
  const finished = isFinished(placed, step);
  const showWin = useDelayedFlag(finished, AFTER_STEP_MS);

  // where the hand should go: a loose block -> the leftmost empty slot
  const { hint, poke } = useIdleHint<HintPath>(() => {
    const canvas = canvasRef.current;
    const first = blocks[0];
    const slotEl = slotRefs.current[placed];
    if (!canvas || !first || !slotEl || waiting) return null;
    const blockEl = canvas.querySelector<HTMLElement>(`[data-block-id="${first.id}"]`);
    return blockEl ? pathBetween(canvas, blockEl, slotEl) : null;
  });

  // matched the reference: thumbs up, then the next step (the finish at 10 is handled by showWin)
  useEffect(() => {
    if (!waiting) return;
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setCheer(true), CHEER_DELAY_MS));
    timers.push(window.setTimeout(() => setCheer(false), CHEER_DELAY_MS + CHEER_MS));
    if (step < COUNT_TOTAL) {
      timers.push(
        window.setTimeout(() => {
          // "+1" beside the latest block, and on the counter, as the new block appears
          refBlockPlus.add({ slot: step - 1 });
          refCountPlus.add();
          setStep(step + 1);
          // fresh canvas for every step
          setPlaced(0);
          setBlocks(newBlocks());
          canvasPlus.clear();
          poke();
        }, AFTER_STEP_MS)
      );
    }
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      setCheer(false);
    };
  }, [waiting, step]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => {
    setStep(1);
    setPlaced(0);
    setBlocks(newBlocks());
    setDrag(null);
    canvasPlus.clear();
    refBlockPlus.clear();
    refCountPlus.clear();
    poke();
  };

  const handleDown = (e: ReactPointerEvent<HTMLDivElement>, block: LooseBlock) => {
    if (waiting) return;
    startPointerDrag(e);
    setDrag({ id: block.id, startX: block.x, startY: block.y });
  };

  const handleMove = (e: ReactPointerEvent<HTMLDivElement>, id: number) => {
    if (drag?.id !== id) return;
    const pos = canvasPercent(canvasRef.current, e.clientX, e.clientY, 3);
    if (!pos) return;
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, ...pos } : b)));
    poke();
  };

  const handleUp = (e: ReactPointerEvent<HTMLDivElement>, id: number) => {
    if (drag?.id !== id) return;
    const { startX, startY } = drag;
    setDrag(null);
    poke();

    const target = indexOfElementAt(slotRefs.current, e.clientX, e.clientY, SLOT_HIT_PAD);
    if (target < 0) return; // left lying wherever it was dropped on the floor
    if (canPlace(placed, step, target)) {
      setBlocks((bs) => bs.filter((b) => b.id !== id));
      setPlaced((p) => p + 1);
      canvasPlus.add();
    } else {
      // only the leftmost empty box takes the next block: this one goes back
      setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, x: startX, y: startY } : b)));
      setRejectSlot(target);
      window.setTimeout(() => setRejectSlot(null), 500);
    }
  };

  const block = (extra = '') => (
    <div
      className={`num-block count-block ${extra}`}
      style={{ width: BLOCK, height: BLOCK, background: BLOCK_COLOR }}
    />
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
          {Array.from({ length: COUNT_TOTAL }, (_, i) => (
            <div key={i} className="frame-cell">
              <div className="slot-outline" style={{ width: FRAME, height: FRAME }}>
                {i < step && block(i === step - 1 && step > 1 ? 'pop-in' : '')}
              </div>
              {refBlockPlus.floats
                .filter((f) => f.slot === i)
                .map((f) => (
                  <PlusOne
                    key={f.id}
                    className="plus-one-side"
                    onDone={() => refBlockPlus.remove(f.id)}
                  />
                ))}
            </div>
          ))}
          <div className="count-badge" id="count-reference-value">
            = {step}
            {refCountPlus.floats.map((f) => (
              <PlusOne key={f.id} onDone={() => refCountPlus.remove(f.id)} />
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
            {Array.from({ length: COUNT_TOTAL }, (_, i) => (
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
              {placed > 0 ? `= ${placed}` : ' '}
              {canvasPlus.floats.map((f) => (
                <PlusOne key={f.id} onDone={() => canvasPlus.remove(f.id)} />
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

          {hint && !drag && !waiting && (
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

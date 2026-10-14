import { useState } from 'react';
import { RotateCcw, ArrowRight } from 'lucide-react';
import './WinOverlay.css';

const CONFETTI_COLORS = ['#ff6b81', '#ffd166', '#4cd964', '#4fc3f7', '#b388ff', '#ff9f43'];

const makeConfetti = () =>
  Array.from({ length: 70 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.2,
    duration: 2.2 + Math.random() * 1.8,
    size: 7 + Math.random() * 8,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    round: i % 3 === 0,
  }));

interface WinOverlayProps {
  /** Prefix for the element ids, e.g. "refresher" -> "refresher-win" */
  idPrefix: string;
  title: string;
  onTryAgain: () => void;
  onNext: () => void;
}

/** Confetti + message card shown on top of a (position: relative) canvas. */
export const WinOverlay = ({ idPrefix, title, onTryAgain, onNext }: WinOverlayProps) => {
  const [confetti] = useState(makeConfetti);

  return (
    <div className="win-overlay" id={`${idPrefix}-win`}>
      <div className="confetti-layer" aria-hidden="true">
        {confetti.map((c) => (
          <span
            key={c.id}
            className="confetti-bit"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.round ? c.size : c.size * 1.6,
              background: c.color,
              borderRadius: c.round ? '50%' : '2px',
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            }}
          />
        ))}
      </div>
      <div className="win-card">
        <h3 id={`${idPrefix}-win-title`}>{title}</h3>
        <div className="win-actions">
          <button id={`${idPrefix}-try-again-btn`} className="btn btn-secondary" onClick={onTryAgain}>
            <RotateCcw size={15} /> Try again
          </button>
          <button id={`${idPrefix}-next-task-btn`} className="btn btn-primary" onClick={onNext}>
            Next task <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

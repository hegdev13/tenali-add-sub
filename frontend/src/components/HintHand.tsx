import type { CSSProperties, ReactNode } from 'react';
import { Hand } from 'lucide-react';
import './HintHand.css';

interface HintHandProps {
  /** start and end points, px inside the (position: relative) canvas */
  sx: number;
  sy: number;
  ex: number;
  ey: number;
  /** size and colour of the translucent block the hand carries */
  size: number;
  color: string;
  label?: ReactNode;
}

/** Translucent hand that carries a block from (sx, sy) to (ex, ey), fades, and repeats. */
export const HintHand = ({ sx, sy, ex, ey, size, color, label }: HintHandProps) => (
  <div
    className="hint-hand"
    style={{ '--sx': sx, '--sy': sy, '--ex': ex, '--ey': ey } as CSSProperties}
  >
    <div
      className="num-block hint-ghost"
      style={{
        width: size,
        height: size,
        left: -size / 2,
        top: -size / 2,
        background: color,
        fontSize: size * 0.5,
      }}
    >
      {label}
    </div>
    <Hand className="hint-icon" size={46} strokeWidth={1.6} />
  </div>
);

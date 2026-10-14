import './PlusOne.css';

interface PlusOneProps {
  onDone: () => void;
  /** e.g. "plus-one-side" to float beside an item instead of above it */
  className?: string;
}

/** The floating "+1" that rises and fades. Position it inside a `position: relative` parent. */
export const PlusOne = ({ onDone, className = '' }: PlusOneProps) => (
  <span className={`plus-one ${className}`.trim()} onAnimationEnd={onDone}>
    +1
  </span>
);

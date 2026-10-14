import { useCallback, useEffect, useRef, useState } from 'react';

export const IDLE_HINT_MS = 3000;

/**
 * Shows a hint after `idleMs` of no user input.
 * - `computeHint` is read fresh each time, so it can use current state directly.
 * - Call `poke()` on any user input: it hides the hint and restarts the timer.
 * - Call `stop()` when there is nothing left to hint at.
 */
export const useIdleHint = <T>(computeHint: () => T | null, idleMs = IDLE_HINT_MS) => {
  const [hint, setHint] = useState<T | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const compute = useRef(computeHint);

  useEffect(() => {
    compute.current = computeHint;
  });

  const schedule = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setHint(compute.current()), idleMs);
  }, [idleMs]);

  const poke = useCallback(() => {
    setHint((h) => (h ? null : h));
    schedule();
  }, [schedule]);

  const stop = useCallback(() => window.clearTimeout(timer.current), []);

  useEffect(() => {
    schedule();
    return () => window.clearTimeout(timer.current);
  }, [schedule]);

  return { hint, poke, stop };
};

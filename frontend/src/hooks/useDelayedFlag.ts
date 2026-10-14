import { useEffect, useState } from 'react';

/** True once `active` has stayed true for `delayMs`; false again as soon as it turns false. */
export const useDelayedFlag = (active: boolean, delayMs: number) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(() => setReady(true), delayMs);
    return () => {
      window.clearTimeout(t);
      setReady(false);
    };
  }, [active, delayMs]);

  return active && ready;
};

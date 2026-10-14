import { useCallback, useRef, useState } from 'react';

export interface Float {
  id: number;
}

/** Lifecycle of the little "+1" animations: add one, remove it when its animation ends. */
export const useFloats = <T extends object = object>() => {
  const seq = useRef(0);
  const [floats, setFloats] = useState<(T & Float)[]>([]);

  const add = useCallback((extra?: T) => {
    seq.current += 1;
    const id = seq.current;
    setFloats((f) => [...f, { ...extra, id } as T & Float]);
  }, []);

  const remove = useCallback((id: number) => setFloats((f) => f.filter((x) => x.id !== id)), []);
  const clear = useCallback(() => setFloats([]), []);

  return { floats, add, remove, clear };
};

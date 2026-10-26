import { useCallback, useEffect, useRef } from 'react';

export const useDebouncedCallback = <T>(callback: (value: T) => void, delay: number) => {
  const timerRef = useRef<number>(undefined);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const cancel = useCallback(() => {
    clearTimeout(timerRef.current);
  }, []);

  const debounced = useCallback(
    (value: T) => {
      clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => callbackRef.current(value), delay);
    },
    [delay],
  );

  return { debounced, cancel };
};

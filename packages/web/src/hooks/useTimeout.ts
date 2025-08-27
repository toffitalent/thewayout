import { useCallback, useEffect, useRef } from 'react';

export type TimeoutId = ReturnType<typeof setTimeout>;

export const useTimeout = <T extends (...args: never[]) => unknown>(
  callback: T,
  timeout: number,
): ((...args: Parameters<T>) => void) => {
  const timeoutCallback = useRef<T>(callback);
  const timeoutId = useRef<TimeoutId | null>(null);

  useEffect(() => {
    timeoutCallback.current = callback;
  }, [callback]);

  useEffect(
    () => () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    },
    [],
  );

  return useCallback<(...args: Parameters<T>) => void>(
    (...args: Parameters<T>) => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => timeoutCallback.current(...args), timeout);
    },
    [timeout],
  );
};

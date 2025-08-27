import { useEffect, useCallback, useRef } from 'react';
/**
 * `useEventCallback` is a React hook for managing event callback functions that avoids an issue
 * with excessive useCallback invalidations by React
 * React issue: https://github.com/facebook/react/issues/14099
 */
export const useEventCallback = (fn) => {
    const ref = useRef(fn);
    useEffect(() => {
        ref.current = fn;
    }, [fn]);
    return useCallback((...args) => ref.current && ref.current(...args), [ref]);
};

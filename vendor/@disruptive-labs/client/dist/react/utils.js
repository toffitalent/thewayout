import { useCallback, useEffect, useRef } from 'react';
export const useEventCallback = (fn) => {
    const ref = useRef(fn);
    useEffect(() => {
        ref.current = fn;
    }, [fn]);
    return useCallback((...args) => ref.current && ref.current(...args), [ref]);
};
export const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

import { useEffect, useRef } from 'react';
/**
 * `usePrevious` stores the previous value of some variable using a ref and post-render update.
 */
export const usePrevious = (value) => {
    const ref = useRef(null);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

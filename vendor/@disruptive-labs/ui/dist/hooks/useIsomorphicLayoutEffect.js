import { useLayoutEffect, useEffect } from 'react';
export function canUseDOM() {
    return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}
export const isBrowser = canUseDOM();
export const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

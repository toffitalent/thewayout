import { useCallbackRef } from './useCallbackRef';
import { isBrowser, useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
/**
 * `usePortal` creates a div element and appends it to the document body, returning a ref to the
 * HTMLDivElement and removing it automatically when the component unmounts. This hook is
 * intended to be used with ReactDOM.createPortal() to create React-managed components outside
 * the main container.
 */
export function usePortal() {
    const [element, setElement] = useCallbackRef();
    useIsomorphicLayoutEffect(() => {
        var _a, _b;
        if (!isBrowser)
            return undefined;
        const el = document.createElement('div');
        (_b = (_a = document.body) === null || _a === void 0 ? void 0 : _a.appendChild) === null || _b === void 0 ? void 0 : _b.call(_a, el);
        setElement(el);
        return () => {
            el.remove();
        };
    }, []);
    return element;
}

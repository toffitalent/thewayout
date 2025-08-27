import { useEffect, useState } from 'react';
/**
 * `useImage` is React hook that monitors the loading state of an image. Simply pass it a
 * `src`/`srcSet` and the return value from the hook will be one of `false` (not loaded),
 * `"loaded"` (image loaded), or `"error"` (an error ocurred).
 */
export function useImage({ src, srcSet, onLoad, onError }) {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (!src && !srcSet)
            return undefined;
        setLoaded(false);
        let active = true;
        const image = new Image();
        if (src)
            image.src = src;
        if (srcSet)
            image.srcset = srcSet;
        image.onload = (event) => {
            if (active) {
                setLoaded('loaded');
                onLoad === null || onLoad === void 0 ? void 0 : onLoad(event);
            }
        };
        image.onerror = (error) => {
            if (active) {
                setLoaded('error');
                onError === null || onError === void 0 ? void 0 : onError(error);
            }
        };
        return () => {
            active = false;
        };
    }, [src, srcSet, onLoad, onError]);
    return loaded;
}

export interface UseImageProps {
    /**
     * The src attribute for the img.
     */
    src?: string;
    /**
     * The srcSet attribute for the img.
     */
    srcSet?: string;
    /**
     * Callback to invoke when img loaded.
     */
    onLoad?: (event: Event) => void;
    /**
     * Callback to invoke when img fails to load.
     */
    onError?: (error: string | Event) => void;
}
/**
 * `useImage` is React hook that monitors the loading state of an image. Simply pass it a
 * `src`/`srcSet` and the return value from the hook will be one of `false` (not loaded),
 * `"loaded"` (image loaded), or `"error"` (an error ocurred).
 */
export declare function useImage({ src, srcSet, onLoad, onError }: UseImageProps): false | "loaded" | "error";

/**
 * `usePortal` creates a div element and appends it to the document body, returning a ref to the
 * HTMLDivElement and removing it automatically when the component unmounts. This hook is
 * intended to be used with ReactDOM.createPortal() to create React-managed components outside
 * the main container.
 */
export declare function usePortal(): HTMLDivElement | null;

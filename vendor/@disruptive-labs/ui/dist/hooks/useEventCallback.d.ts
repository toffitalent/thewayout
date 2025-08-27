/**
 * `useEventCallback` is a React hook for managing event callback functions that avoids an issue
 * with excessive useCallback invalidations by React
 * React issue: https://github.com/facebook/react/issues/14099
 */
export declare const useEventCallback: <Callback extends (...args: any[]) => any>(fn?: Callback | null | undefined) => Callback;

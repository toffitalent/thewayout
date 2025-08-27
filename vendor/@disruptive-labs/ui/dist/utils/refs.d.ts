/// <reference types="react" />
export type ReactRef<T> = React.Ref<T> | React.RefObject<T> | React.MutableRefObject<T>;
export declare const assignRef: <T = any>(ref: ReactRef<T> | undefined, value: T) => void;
export declare const mergeRefs: <T>(...refs: (ReactRef<T> | undefined)[]) => (node: T | null) => void;

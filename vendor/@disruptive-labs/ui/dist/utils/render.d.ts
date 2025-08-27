/// <reference types="react" />
export type MaybeRenderProp<P> = React.ReactNode | ((props: P) => React.ReactNode);
export declare function isFunction(value: any): value is Function;
export declare function runIfFn<T, U>(valueOrFn: T | ((...fnArgs: U[]) => T), ...args: U[]): T;

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value) {
    return typeof value === 'function';
}
export function runIfFn(valueOrFn, ...args) {
    return isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn;
}

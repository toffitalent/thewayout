import { isFunction } from './render';
export const assignRef = (ref, value) => {
    if (ref == null)
        return;
    if (isFunction(ref)) {
        ref(value);
        return;
    }
    try {
        // eslint-disable-next-line no-param-reassign
        ref.current = value;
    }
    catch (error) {
        throw new Error(`Cannot assign value '${value}' to ref '${ref}'`);
    }
};
export const mergeRefs = (...refs) => (node) => {
    refs.forEach((ref) => assignRef(ref, node));
};

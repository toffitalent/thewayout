import { useEventCallback } from '../../hooks';
import { createValidate } from './Validator';
const noop = () => undefined;
export const useValidate = (validation, validationErrorMessage) => useEventCallback(
// eslint-disable-next-line no-nested-ternary
typeof validation === 'function'
    ? validation
    : validation
        ? createValidate(validation, validationErrorMessage)
        : noop);

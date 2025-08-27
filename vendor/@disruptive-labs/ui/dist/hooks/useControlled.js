import { useCallback, useRef, useState } from 'react';
/**
 * `useControlled` is a React hook for managing component state which may be controlled or
 * uncontrolled. When uncontrolled, the supplied default value is used as the initial value and the
 * returned setState function updates the value. When controlled, the controlled value is used as
 * the value and the returned setState function does nothing.
 */
export const useControlled = ({ controlled, default: defaultProp, }) => {
    // NOTE: isControlled should never change and is ignored in hook deps
    const { current: isControlled } = useRef(controlled !== undefined);
    const [valueState, setValue] = useState(defaultProp);
    const value = isControlled ? controlled : valueState;
    const setValueIfUncontrolled = useCallback((newValue) => {
        if (!isControlled) {
            setValue(newValue);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return [value, setValueIfUncontrolled];
};

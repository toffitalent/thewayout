import React, { useCallback } from 'react';
import ReactFocusLock from 'react-focus-lock';
import { getAllFocusable } from '../../utils';
export function FocusLock({ autoFocus, children, contentRef, finalFocusRef, initialFocusRef, isDisabled, lockFocusAcrossFrames, persistentFocus, restoreFocus, }) {
    const onActivation = useCallback(() => {
        var _a, _b;
        if (initialFocusRef === null || initialFocusRef === void 0 ? void 0 : initialFocusRef.current) {
            initialFocusRef.current.focus();
        }
        else if (contentRef === null || contentRef === void 0 ? void 0 : contentRef.current) {
            (_b = (_a = getAllFocusable(contentRef.current)[0]) === null || _a === void 0 ? void 0 : _a.focus) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
    }, [contentRef, initialFocusRef]);
    const onDeactivation = useCallback(() => {
        var _a;
        (_a = finalFocusRef === null || finalFocusRef === void 0 ? void 0 : finalFocusRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    }, [finalFocusRef]);
    return (React.createElement(ReactFocusLock, { crossFrame: lockFocusAcrossFrames, persistentFocus: persistentFocus, autoFocus: autoFocus, disabled: isDisabled, onActivation: onActivation, onDeactivation: onDeactivation, returnFocus: restoreFocus && !finalFocusRef }, children));
}

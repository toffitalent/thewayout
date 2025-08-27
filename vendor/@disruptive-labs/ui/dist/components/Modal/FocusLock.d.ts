import React from 'react';
interface FocusableElement {
    focus(options?: FocusOptions): void;
}
export interface FocusLockProps {
    /**
     * The component to which focus should be locked.
     */
    children: React.ReactNode;
    /**
     * If `true`, focus will be transferred to the first focusable element when the focus lock
     * renders.
     */
    autoFocus?: boolean;
    /**
     * A ref of the component wrapped by the focus lock.
     */
    contentRef?: React.RefObject<HTMLElement>;
    /**
     * A ref of the element to which focus should be returned when the focus lock unmounts.
     */
    finalFocusRef?: React.RefObject<FocusableElement>;
    /**
     * A ref of the element to which focus should be transferred initially. If not provided, the
     * first focusable element will be focused if autoFocus is `true`.
     */
    initialFocusRef?: React.RefObject<FocusableElement>;
    /**
     * If `true`, the focus lock will be disabled.
     */
    isDisabled?: boolean;
    /**
     * If `true`, focus will be returned to the element that triggered the focus lock when it
     * unmounts.
     */
    restoreFocus?: boolean;
    /**
     * If `true`, text selections inside and outside the focus lock will be disabled.
     *
     * @default false
     */
    persistentFocus?: boolean;
    /**
     * If `true`, focus is kept within the focus lock, even in an iframe. If `false`, focus is
     * allowed to move outside an iframe.
     */
    lockFocusAcrossFrames?: boolean;
}
export declare function FocusLock({ autoFocus, children, contentRef, finalFocusRef, initialFocusRef, isDisabled, lockFocusAcrossFrames, persistentFocus, restoreFocus, }: FocusLockProps): React.JSX.Element;
export {};

var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { usePortal } from '../../hooks';
import { classNames } from '../../utils';
import { Box } from '../Box';
import { IconButton } from '../Button';
import { createIcon } from '../Icon';
import { FocusLock } from './FocusLock';
import { ModalContext, useModalContext } from './ModalContext';
import { useModal } from './useModal';
import styles from './Modal.module.scss';
import { useScrollBlock } from './useScrollBlock';
/**
 * Modal is an accessible dialog window that is presented over the other content in the viewport.
 * For accessibility, other content behind the modal is inert and scrolling is blocked so that
 * users cannot interact with it and screen readers focus on the dialog alone while it is open.
 * Focus is also managed intelligently, initially focusing the first interactive element (or a
 * specific element if desired), and focus is trapped within the modal until it closes.
 *
 * The Modal component itself is just a wrapper that renders a React portal, attached to the
 * document body, and provides relevant context to other Modal-related components.
 */
export function Modal(_a) {
    var { children, autoFocus = true, blockScroll = true, finalFocusRef, initialFocusRef, isCentered = false, lockFocusAcrossFrames = true, returnFocusOnClose = true, size, trapFocus = true } = _a, props = __rest(_a, ["children", "autoFocus", "blockScroll", "finalFocusRef", "initialFocusRef", "isCentered", "lockFocusAcrossFrames", "returnFocusOnClose", "size", "trapFocus"]);
    const context = useModal(Object.assign(Object.assign({}, props), { autoFocus: !trapFocus && autoFocus }));
    const portal = usePortal();
    const value = useMemo(() => (Object.assign(Object.assign({}, context), { autoFocus,
        finalFocusRef,
        initialFocusRef,
        isCentered,
        lockFocusAcrossFrames,
        returnFocusOnClose,
        size,
        trapFocus })), [
        context,
        autoFocus,
        finalFocusRef,
        initialFocusRef,
        isCentered,
        lockFocusAcrossFrames,
        returnFocusOnClose,
        size,
        trapFocus,
    ]);
    useScrollBlock(styles.blockScroll, blockScroll && props.isOpen);
    return portal
        ? ReactDOM.createPortal(React.createElement(ModalContext.Provider, { value: value }, context.isOpen && children), portal)
        : null;
}
/**
 * ModalContent is the container inside which Modal components and the content should be rendered.
 * It is wrapped by a div, to which styles and handlers for managing "outside clicks" are applied.
 */
export const ModalContent = React.forwardRef((_a, ref) => {
    var { rootProps } = _a, props = __rest(_a, ["rootProps"]);
    const { getModalProps, getOverlayProps, autoFocus, finalFocusRef, initialFocusRef, isCentered, lockFocusAcrossFrames, modalRef, returnFocusOnClose, size, trapFocus, } = useModalContext();
    return (React.createElement(FocusLock, { autoFocus: autoFocus, contentRef: modalRef, finalFocusRef: finalFocusRef, initialFocusRef: initialFocusRef, isDisabled: !trapFocus, lockFocusAcrossFrames: lockFocusAcrossFrames, restoreFocus: returnFocusOnClose },
        React.createElement("div", Object.assign({}, getOverlayProps(rootProps), { className: classNames(styles.container, isCentered && styles.isCentered, rootProps === null || rootProps === void 0 ? void 0 : rootProps.className) }),
            React.createElement(Box, Object.assign({ p: 5 }, getModalProps(props, ref), { as: "div", className: classNames(styles.modal, size && styles[size], props.className) })))));
});
/**
 * ModalOverlay is a utility component for dimming the content behind the modal. It should be
 * rendered as a sibling of ModalContent.
 */
export const ModalOverlay = React.forwardRef((_a, ref) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (React.createElement("div", Object.assign({}, props, { className: classNames(styles.overlay, className), ref: ref })));
});
/**
 * ModalTitle renders the modal's title and automatically sets the aria-labelledby attribute on the
 * modal for proper accessibility.
 *
 * Note: When not using ModalTitle, be sure to add an aria-label prop to ModalContent for
 * accessibility.
 */
export const ModalTitle = React.forwardRef((props, ref) => {
    const { getTitleProps } = useModalContext();
    return (React.createElement(Box, Object.assign({ f: "h5", ph: 6, mb: 5, textAlign: "center" }, getTitleProps(props, ref), { as: "header" })));
});
/**
 * ModalBody is a simple wrapper around the content of the modal, which automatically sets the
 * aria-describedby attribute on the modal.
 */
export const ModalBody = React.forwardRef((props, ref) => {
    const { getBodyProps } = useModalContext();
    return React.createElement(Box, Object.assign({}, getBodyProps(props, ref), { as: "div" }));
});
/**
 * ModalFooter renders its children separated from ModalBody and is designed to make it quicker to
 * add actions to the end of the modal.
 */
export const ModalFooter = React.forwardRef((props, ref) => (React.createElement(Box, Object.assign({ pt: 5, textAlign: "center" }, props, { as: "footer", ref: ref }))));
const IconX = createIcon(React.createElement("path", { d: "M0 0h24v24H0z", stroke: "none" }), React.createElement("path", { d: "M18 6L6 18M6 6l12 12", strokeWidth: 1.5 }));
/**
 * ModalCloseButton composes an IconButton with an "X" icon that will call the `onClose` Modal prop
 * by default.
 */
export const ModalCloseButton = React.forwardRef((props, ref) => {
    const { onClose } = useModalContext();
    return (React.createElement(IconButton, Object.assign({ onClick: onClose, colorScheme: "grey", fontSize: "2xl", ph: 0, size: "sm", variant: "clear", "aria-label": "Close" }, props, { className: classNames(styles.close, props.className), ref: ref }),
        React.createElement(IconX, null)));
});

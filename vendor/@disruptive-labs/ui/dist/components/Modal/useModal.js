import { hideOthers } from 'aria-hidden';
import { useCallback, useEffect, useId, useRef } from 'react';
import { useCallbackRef, useEventCallback, useIsomorphicLayoutEffect } from '../../hooks';
import { getAllFocusable, mergeRefs } from '../../utils';
export const useAriaHidden = (ref, shouldHide) => {
    useEffect(() => {
        if (!ref.current)
            return undefined;
        let undo = null;
        if (shouldHide && ref.current) {
            undo = hideOthers(ref.current);
        }
        return () => {
            if (shouldHide) {
                undo === null || undo === void 0 ? void 0 : undo();
            }
        };
    }, [shouldHide, ref]);
};
export const useModal = ({ autoFocus = true, closeOnEsc = true, closeOnOverlayClick = true, isOpen, onClose, onEsc, onOverlayClick, useInert = true, }) => {
    const modalRef = useRef(null);
    const overlayRef = useRef(null);
    const [body, bodyRef] = useCallbackRef();
    const [title, titleRef] = useCallbackRef();
    const mouseDownTarget = useRef(null);
    const id = useId();
    useAriaHidden(modalRef, isOpen && useInert);
    const maybeFocusFirst = useEventCallback(() => { var _a, _b; return autoFocus && ((_b = (_a = getAllFocusable(modalRef.current)[1]) === null || _a === void 0 ? void 0 : _a.focus) === null || _b === void 0 ? void 0 : _b.call(_a)); });
    useIsomorphicLayoutEffect(() => {
        if (isOpen) {
            maybeFocusFirst();
        }
    }, [isOpen, maybeFocusFirst]);
    const getModalProps = useCallback((props = {}, ref = null) => (Object.assign(Object.assign({ role: 'dialog' }, props), { ref: mergeRefs(ref, modalRef), id: `modal-${id}`, tabIndex: -1, 'aria-modal': true, 'aria-labelledby': title ? `modal-${id}-title` : undefined, 'aria-describedby': body ? `modal-${id}-body` : undefined, onClick: (event) => {
            var _a;
            (_a = props.onClick) === null || _a === void 0 ? void 0 : _a.call(props, event);
            event.stopPropagation();
        } })), [id, body, title]);
    const getOverlayProps = useCallback((props = {}, ref = null) => (Object.assign(Object.assign({}, props), { ref: mergeRefs(ref, overlayRef), onClick: (event) => {
            var _a;
            (_a = props.onClick) === null || _a === void 0 ? void 0 : _a.call(props, event);
            event.stopPropagation();
            // Avoid closing modal if click did not originate on overlay
            if (mouseDownTarget.current !== event.target)
                return;
            if (closeOnOverlayClick) {
                onClose === null || onClose === void 0 ? void 0 : onClose();
            }
            onOverlayClick === null || onOverlayClick === void 0 ? void 0 : onOverlayClick();
        }, onKeyDown: (event) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                if (closeOnEsc) {
                    onClose === null || onClose === void 0 ? void 0 : onClose();
                }
                onEsc === null || onEsc === void 0 ? void 0 : onEsc();
            }
        }, onMouseDown: (event) => {
            mouseDownTarget.current = event.target;
        } })), [closeOnEsc, closeOnOverlayClick, onClose, onEsc, onOverlayClick]);
    const getBodyProps = useCallback((props = {}, ref = null) => (Object.assign(Object.assign({}, props), { id: `modal-${id}-body`, ref: mergeRefs(ref, bodyRef) })), [id, bodyRef]);
    const getTitleProps = useCallback((props = {}, ref = null) => (Object.assign(Object.assign({}, props), { id: `modal-${id}-title`, ref: mergeRefs(ref, titleRef) })), [id, titleRef]);
    return {
        getBodyProps,
        getModalProps,
        getOverlayProps,
        getTitleProps,
        modalRef,
        isOpen,
        onClose,
        overlayRef,
    };
};

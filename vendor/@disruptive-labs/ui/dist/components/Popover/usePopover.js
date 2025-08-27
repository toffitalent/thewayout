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
import contains from 'dom-helpers/contains';
import { useCallback, useId, useRef } from 'react';
import { useControlled, useEventCallback, useIsomorphicLayoutEffect, usePrevious, } from '../../hooks';
import { getAllFocusable, mergeRefs } from '../../utils';
import { usePopper } from '../Popper';
const getOwnerDocument = (node) => { var _a; return node instanceof Element ? (_a = node.ownerDocument) !== null && _a !== void 0 ? _a : document : document; };
const getActiveElement = (node) => { var _a; return (_a = getOwnerDocument(node)) === null || _a === void 0 ? void 0 : _a.activeElement; };
const getRelatedTarget = (event) => {
    var _a, _b, _c;
    const target = ((_a = event.target) !== null && _a !== void 0 ? _a : event.currentTarget);
    const activeElement = getActiveElement(target);
    const originalTarget = event.nativeEvent.explicitOriginalTarget;
    return ((_c = (_b = event.relatedTarget) !== null && _b !== void 0 ? _b : originalTarget) !== null && _c !== void 0 ? _c : activeElement);
};
export const usePopover = (_a = {}) => {
    var { autoFocus = true, closeOnBlur = true, closeOnEsc = true, defaultIsOpen = false, isOpen: controlled, onClose: onCloseProp, onOpen: onOpenProp } = _a, popperProps = __rest(_a, ["autoFocus", "closeOnBlur", "closeOnEsc", "defaultIsOpen", "isOpen", "onClose", "onOpen"]);
    const [isOpen, setIsOpen] = useControlled({ controlled, default: defaultIsOpen });
    const wasOpen = usePrevious(isOpen);
    const popoverRef = useRef(null);
    const triggerRef = useRef(null);
    const id = useId();
    const focusInPopover = useRef(false);
    const onClose = useCallback(() => {
        onCloseProp === null || onCloseProp === void 0 ? void 0 : onCloseProp();
        setIsOpen(false);
    }, [onCloseProp, setIsOpen]);
    const onOpen = useCallback(() => {
        onOpenProp === null || onOpenProp === void 0 ? void 0 : onOpenProp();
        setIsOpen(true);
    }, [onOpenProp, setIsOpen]);
    const { forceUpdate, getArrowProps, getPopperProps, referenceRef } = usePopper(popperProps);
    if (popoverRef.current && wasOpen && !isOpen) {
        focusInPopover.current = popoverRef.current.contains(document.activeElement);
    }
    const focusTrigger = useEventCallback(() => { var _a, _b; return (_b = (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.focus) === null || _b === void 0 ? void 0 : _b.call(_a); });
    const maybeFocusFirst = useEventCallback(() => { var _a, _b; return autoFocus && ((_b = (_a = getAllFocusable(popoverRef.current)[0]) === null || _a === void 0 ? void 0 : _a.focus) === null || _b === void 0 ? void 0 : _b.call(_a)); });
    useIsomorphicLayoutEffect(() => {
        if (isOpen) {
            maybeFocusFirst();
        }
        else if (focusInPopover.current) {
            focusInPopover.current = false;
            focusTrigger();
        }
    }, [focusInPopover, focusTrigger, isOpen, maybeFocusFirst]);
    const getPopoverProps = useCallback((props = {}, ref = null) => getPopperProps(Object.assign(Object.assign({}, props), { style: Object.assign({ visibility: isOpen ? 'visible' : 'hidden' }, props.style) }), ref), [getPopperProps, isOpen]);
    const getPopoverContentProps = useCallback((props = {}, ref = null) => (Object.assign(Object.assign({}, props), { style: Object.assign({}, props.style), ref: mergeRefs(popoverRef, ref), id: `popover-${id}`, role: 'dialog', tabIndex: -1, onKeyDown: (event) => {
            var _a;
            (_a = props.onKeyDown) === null || _a === void 0 ? void 0 : _a.call(props, event);
            if (closeOnEsc && event.key === 'Escape') {
                onClose();
            }
        }, onBlur: (event) => {
            var _a;
            (_a = props.onBlur) === null || _a === void 0 ? void 0 : _a.call(props, event);
            const relatedTarget = getRelatedTarget(event);
            const targetIsPopover = popoverRef.current && contains(popoverRef.current, relatedTarget);
            const targetIsTrigger = triggerRef.current && contains(triggerRef.current, relatedTarget);
            const isValidBlur = !targetIsPopover && !targetIsTrigger;
            if (isOpen && closeOnBlur && isValidBlur) {
                onClose();
            }
        } })), [closeOnBlur, closeOnEsc, id, isOpen, onClose]);
    const getTriggerProps = useCallback((props = {}, ref = null) => (Object.assign(Object.assign({}, props), { ref: mergeRefs(triggerRef, ref, referenceRef), id: `popover-${id}-trigger`, onClick: (event) => {
            var _a;
            (_a = props.onClick) === null || _a === void 0 ? void 0 : _a.call(props, event);
            isOpen ? onClose() : onOpen();
        }, 'aria-haspopup': 'dialog', 'aria-expanded': isOpen, 'aria-controls': `popover-${id}` })), [id, isOpen, onClose, onOpen, referenceRef]);
    return {
        forceUpdate,
        getArrowProps,
        getPopoverProps,
        getPopoverContentProps,
        getTriggerProps,
        isOpen,
        onClose,
        onOpen,
    };
};

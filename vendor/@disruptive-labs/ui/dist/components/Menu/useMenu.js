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
import { useCallback, useId, useRef } from 'react';
import { useEventCallback, useIsomorphicLayoutEffect } from '../../hooks';
import { getAllFocusable, mergeRefs } from '../../utils';
import { usePopover } from '../Popover';
export const useMenu = (_a) => {
    var { autoFocus = true, closeOnSelect = true } = _a, popoverProps = __rest(_a, ["autoFocus", "closeOnSelect"]);
    const id = useId();
    const { forceUpdate, getArrowProps, getPopoverProps: getMenuProps, getPopoverContentProps, getTriggerProps: getPopoverTriggerProps, isOpen, onClose, onOpen, } = usePopover(Object.assign({ 
        // Disable popover handlers so we can handle events here
        autoFocus: false, placement: 'bottom-start' }, popoverProps));
    const menuRef = useRef(null);
    const triggerRef = useRef(null);
    const focusFirstItem = useEventCallback(() => { var _a, _b; return (_b = (_a = getAllFocusable(menuRef.current)[1]) === null || _a === void 0 ? void 0 : _a.focus) === null || _b === void 0 ? void 0 : _b.call(_a); });
    const focusLastItem = useEventCallback(() => {
        var _a, _b;
        const focusable = getAllFocusable(menuRef.current);
        (_b = (_a = focusable[focusable.length - 1]) === null || _a === void 0 ? void 0 : _a.focus) === null || _b === void 0 ? void 0 : _b.call(_a);
    });
    const getNextFocusableChild = (current, offset) => {
        if (!menuRef.current)
            return null;
        const items = getAllFocusable(menuRef.current).filter((element) => element !== menuRef.current);
        const currentIndex = items.indexOf(current);
        const nextIndex = currentIndex + offset;
        if (nextIndex >= items.length)
            return items[0];
        if (nextIndex < 0)
            return items[items.length - 1];
        return items[nextIndex];
    };
    useIsomorphicLayoutEffect(() => {
        if (isOpen && autoFocus) {
            focusFirstItem();
        }
    }, [autoFocus, focusFirstItem, isOpen]);
    const getMenuItemProps = useCallback((_a = {}, ref) => {
        var _b;
        var { closeOnSelect: itemCloseOnSelect } = _a, props = __rest(_a, ["closeOnSelect"]);
        if (ref === void 0) { ref = null; }
        return (Object.assign(Object.assign({}, props), { ref, role: 'menuitem', tabIndex: (_b = props.tabIndex) !== null && _b !== void 0 ? _b : -1, onClick: (event) => {
                var _a;
                (_a = props.onClick) === null || _a === void 0 ? void 0 : _a.call(props, event);
                if (itemCloseOnSelect !== null && itemCloseOnSelect !== void 0 ? itemCloseOnSelect : closeOnSelect)
                    onClose();
            } }));
    }, [closeOnSelect, onClose]);
    const getMenuListProps = useCallback((props = {}, ref = null) => {
        const contentProps = getPopoverContentProps(props, ref);
        return Object.assign(Object.assign({}, contentProps), { ref: mergeRefs(contentProps.ref, menuRef), id: `menu-${id}`, role: 'menu', 'aria-orientation': 'vertical', onKeyDown: (event) => {
                const target = event.target;
                const keyMap = {
                    Escape: onClose,
                    ArrowUp: () => { var _a, _b; return (_b = (_a = getNextFocusableChild(target, -1)) === null || _a === void 0 ? void 0 : _a.focus) === null || _b === void 0 ? void 0 : _b.call(_a); },
                    ArrowDown: () => { var _a, _b; return (_b = (_a = getNextFocusableChild(target, 1)) === null || _a === void 0 ? void 0 : _a.focus) === null || _b === void 0 ? void 0 : _b.call(_a); },
                    Home: focusFirstItem,
                    End: focusLastItem,
                };
                const action = keyMap[event.key];
                if (action) {
                    event.preventDefault();
                    action();
                }
            } });
    }, [focusFirstItem, focusLastItem, getPopoverContentProps, id, onClose]);
    const getTriggerProps = useCallback((props = {}, ref = null) => {
        const triggerProps = getPopoverTriggerProps(props, ref);
        return Object.assign(Object.assign({ role: 'button' }, triggerProps), { ref: mergeRefs(triggerProps.ref, triggerRef), id: `menu-${id}-trigger`, 'aria-haspopup': 'menu', 'aria-expanded': isOpen, 'aria-controls': `menu-${id}`, onKeyDown: (event) => {
                var _a;
                (_a = triggerProps.onKeyDown) === null || _a === void 0 ? void 0 : _a.call(triggerProps, event);
                if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                    event.preventDefault();
                    event.stopPropagation();
                    onOpen();
                }
            } });
    }, [getPopoverTriggerProps, id, isOpen, onOpen]);
    return {
        closeOnSelect,
        forceUpdate,
        getArrowProps,
        getMenuProps,
        getMenuItemProps,
        getMenuListProps,
        getTriggerProps,
        isOpen,
        onClose,
        onOpen,
    };
};

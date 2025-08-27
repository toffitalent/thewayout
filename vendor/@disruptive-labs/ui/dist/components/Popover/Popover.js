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
import React from 'react';
import { classNames, runIfFn } from '../../utils';
import { Box } from '../Box';
import { PopoverContext, usePopoverContext } from './PopoverContext';
import { usePopover } from './usePopover';
import styles from './Popover.module.scss';
/**
 * Popover is a dialog that renders and repositions relative to a trigger element. It can contain
 * any number of useful contextual pieces of information for the user to read or interact with.
 * The Popover component itself is just the wrapper and context provider for the other Popover-
 * related components (e.g. PopoverTrigger, PopoverContent).
 */
export function Popover(_a) {
    var { children, gutter = 8 } = _a, props = __rest(_a, ["children", "gutter"]);
    const context = usePopover(Object.assign({ gutter }, props));
    return (React.createElement(PopoverContext.Provider, { value: context }, runIfFn(children, {
        forceUpdate: context.forceUpdate,
        isOpen: context.isOpen,
        onClose: context.onClose,
    })));
}
/**
 * PopoverTrigger wraps a clickable trigger element (for example a button) and attaches event
 * handlers and attributes to wire up the Popover functionality and handle accessibility.
 */
export function PopoverTrigger({ children }) {
    const child = React.Children.only(children);
    const { getTriggerProps } = usePopoverContext();
    return React.cloneElement(child, getTriggerProps(child.props, child.ref));
}
/**
 * PopoverContent is the container inside which the actual Popover content should be rendered. It
 * is wrapped by a div, to which Popper.js applies positioning styles. The content container itself
 * currently has minimal styling applied and can be easily configured.
 */
export const PopoverContent = React.forwardRef((_a, ref) => {
    var { as, className, rootProps } = _a, props = __rest(_a, ["as", "className", "rootProps"]);
    const { getPopoverProps, getPopoverContentProps } = usePopoverContext();
    return (React.createElement("div", Object.assign({}, getPopoverProps(rootProps), { className: classNames(styles.popover, rootProps === null || rootProps === void 0 ? void 0 : rootProps.className) }),
        React.createElement(Box, Object.assign({}, getPopoverContentProps(props, ref), { as: as || 'div', className: classNames(styles.content, className) }))));
});
/**
 * PopoverArrow adds an arrow between the popover content and it's trigger/reference element. It is
 * optional and can be simply omitted to not render an arrow. Popper.js will apply styles to
 * position the arrow appropriately based on the popover position.
 */
export function PopoverArrow(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    const { getArrowProps } = usePopoverContext();
    return React.createElement("div", Object.assign({}, getArrowProps(props), { className: classNames(styles.arrow, className) }));
}

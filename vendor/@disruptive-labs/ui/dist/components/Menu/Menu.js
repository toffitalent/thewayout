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
import { Button } from '../Button';
import { MenuContext, useMenuContext } from './MenuContext';
import { useMenu } from './useMenu';
import styles from './Menu.module.scss';
import { Box } from '../Box';
/**
 * Menu is an accessible dropdown menu implementation built on the Popover component. Menu attempts
 * to manage focus intelligently, applying focus to a menu item when the menu opens and moving it
 * up and down through the list of items using keyboard navigation.
 *
 * Similar to the Popover component, the Menu component itself is just a wrapper and context
 * provider for the other Menu-related components (e.g. MenuButton, MenuList, MenuItem).
 */
export function Menu(_a) {
    var { children } = _a, props = __rest(_a, ["children"]);
    const context = useMenu(props);
    return (React.createElement(MenuContext.Provider, { value: context }, runIfFn(children, {
        forceUpdate: context.forceUpdate,
        isOpen: context.isOpen,
        onClose: context.onClose,
    })));
}
/**
 * MenuTrigger wraps a clickable trigger element (for example a button) and attaches event
 * handlers and attributes to wire up the Menu functionality and handle accessibility.
 */
export function MenuTrigger({ children }) {
    const child = React.Children.only(children);
    const { getTriggerProps } = useMenuContext();
    return React.cloneElement(child, getTriggerProps(child.props, child.ref));
}
/**
 * MenuButton is a Button component wrapped by a MenuTrigger. As such, it's already wired up and
 * ready. Supplied props are passed to the button for customization. MenuTrigger should be used for
 * more complex situations or situations where the trigger component should not be a Button.
 */
export function MenuButton(props) {
    return (React.createElement(MenuTrigger, null,
        React.createElement(Button, Object.assign({}, props))));
}
/**
 * MenuList wraps the actual list of items to display in the menu and has role="menu" applied
 * automatically. It contains a wrapper div, to which Popper.js applies positioning styles, and a
 * container div for the menu items, which can be customized though supplied props.
 */
export const MenuList = React.forwardRef((_a, ref) => {
    var { className, rootProps } = _a, props = __rest(_a, ["className", "rootProps"]);
    const { getMenuProps, getMenuListProps } = useMenuContext();
    return (React.createElement("div", Object.assign({}, getMenuProps(rootProps), { className: classNames(styles.menu, rootProps === null || rootProps === void 0 ? void 0 : rootProps.className) }),
        React.createElement(Box, Object.assign({}, getMenuListProps(props, ref), { as: "div", className: classNames(styles.list, className) }))));
});
/**
 * MenuItem represents an individual interact-able menu item. It wraps a minimally-styled Button
 * component, so it accepts Button props for customization (e.g. left/right accessories).
 */
export const MenuItem = React.forwardRef((_a, ref) => {
    var { className, size } = _a, props = __rest(_a, ["className", "size"]);
    const { getMenuItemProps } = useMenuContext();
    return (React.createElement(Button, Object.assign({ type: "button" }, getMenuItemProps(props, ref), { className: classNames(styles.item, className), size: size, variant: "text" })));
});
/**
 * MenuGroup can optionally be used to separate certain MenuItems from others and wrap them in a
 * role="group" component. It also accepts an optional title that will be rendered within the
 * group.
 */
export const MenuGroup = React.forwardRef((_a, ref) => {
    var { children, className, title } = _a, props = __rest(_a, ["children", "className", "title"]);
    return (React.createElement(Box, Object.assign({ role: "group" }, props, { as: "div", ref: ref, className: classNames(styles.group, className) }),
        title && React.createElement("p", { className: styles.groupTitle }, title),
        children));
});

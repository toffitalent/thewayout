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
import React, { useState } from 'react';
import { classNames, runIfFn } from '../../utils';
import { Box } from '../Box';
import { IconButton } from '../Button';
import { FormControl, FormLabel } from '../Form';
import { InputBase } from '../Input';
import { getProps } from '../../styles';
import { ComboboxContext, useComboboxContext } from './ComboboxContext';
import { useCombobox } from './useCombobox';
import styles from './Combobox.module.scss';
/**
 * Combobox is an accessible autocomplete/combobox implementation that uses Popper and Downshift to
 * display options to users and handle option selection using the keyboard or mouse.
 *
 * The Combobox component renders the container and required context for the other Combobox-related
 * components. ComboboxInput and ComboboxMenu must be among the children.
 */
export const Combobox = (_a) => {
    var { children, items: itemsProp, options } = _a, props = __rest(_a, ["children", "items", "options"]);
    const [items, setItems] = useState(itemsProp || options);
    const _b = getProps(props), { sx } = _b, rest = __rest(_b, ["sx"]);
    const context = useCombobox(Object.assign({ items: itemsProp !== null && itemsProp !== void 0 ? itemsProp : items, options, onInputValueChange: ({ inputValue }) => setItems(options.filter((item) => {
            var _a, _b;
            return inputValue
                ? ((_b = (_a = props.itemToString) === null || _a === void 0 ? void 0 : _a.call(props, item)) !== null && _b !== void 0 ? _b : String(item))
                    .toLocaleLowerCase()
                    .startsWith(inputValue.toLocaleLowerCase())
                : options;
        })) }, rest));
    return (React.createElement(ComboboxContext.Provider, { value: context },
        React.createElement(FormControl, { sx: sx }, runIfFn(children, { isOpen: context.isOpen, items: context.items }))));
};
/**
 * ComboboxLabel adds an HTML label and related ARIA attributes to the Combobox input. If omitted,
 * an `aria-label` attribute should be added to ComboboxInput for proper accessibility.
 */
export const ComboboxLabel = React.forwardRef((props, ref) => {
    const { getLabelProps } = useComboboxContext();
    return React.createElement(FormLabel, Object.assign({}, getLabelProps(Object.assign(Object.assign({}, props), { ref }))));
});
/**
 * ComboboxInput renders the text input component of the Combobox and also provides the reference
 * element for Popper to position the options menu.
 */
export const ComboboxInput = React.forwardRef((_a, ref) => {
    var { children, className } = _a, props = __rest(_a, ["children", "className"]);
    const { getComboboxProps, getInputProps, hasLabel } = useComboboxContext();
    return (React.createElement("div", Object.assign({}, getComboboxProps(), { className: classNames(styles.input, className) }),
        React.createElement(InputBase, Object.assign({}, getInputProps(Object.assign(Object.assign({}, props), { ref })), (!hasLabel && { 'aria-labelledby': undefined }), { multiline: false })),
        children));
});
/**
 * ComboboxButton composes IconButton, allowing overriding of the icon displayed. It should be
 * rendered as an accessory of ComboboxInput and is automatically wired up to toggle the menu.
 */
export const ComboboxButton = React.forwardRef((_a, ref) => {
    var { children, size = 'sm' } = _a, props = __rest(_a, ["children", "size"]);
    const { getToggleButtonProps } = useComboboxContext();
    return (React.createElement(IconButton, Object.assign({ fontSize: "xl", variant: "clear", "aria-label": "Toggle menu" }, getToggleButtonProps(Object.assign(Object.assign({}, props), { ref })), { className: classNames(styles.button, props.className), size: size }), children || (React.createElement("svg", { viewBox: "0 0 24 24", className: styles.buttonIcon, focusable: false, role: "presentation", "aria-hidden": "true" },
        React.createElement("path", { fill: "currentColor", d: "M12,16c-0.3,0-0.5-0.1-0.7-0.3l-6-6c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l5.3,5.3l5.3-5.3c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-6,6C12.5,15.9,12.3,16,12,16z" })))));
});
/**
 * ComboboxItem renders a list item element and applies the props/refs required for Downshift to
 * manage items and selection.
 */
export const ComboboxItem = React.forwardRef((_a, ref) => {
    var { children, className, isHighlighted } = _a, props = __rest(_a, ["children", "className", "isHighlighted"]);
    const { getItemProps, highlightedIndex } = useComboboxContext();
    return (React.createElement(Box, Object.assign({}, getItemProps(Object.assign(Object.assign({}, props), { ref })), { as: "li", className: classNames(styles.item, (isHighlighted || highlightedIndex === props.index) && styles.itemFocused, className) }), children));
});
/**
 * ComboboxGroup wraps a selection of ComboboxItem components in a group with an optional title.
 * This can be useful for separating items in the menu into logical groups.
 */
export const ComboboxGroup = React.forwardRef((_a, ref) => {
    var { children, className, title } = _a, props = __rest(_a, ["children", "className", "title"]);
    return (React.createElement(Box, Object.assign({}, props, { as: "li", className: classNames(styles.group, className), ref: ref }),
        title && React.createElement("p", { className: styles.groupTitle }, title),
        React.createElement("ul", null, children)));
});
const defaultMenuRender = ({ items, itemToString }) => items.map((item, index) => (
// eslint-disable-next-line react/no-array-index-key
React.createElement(ComboboxItem, { key: `${itemToString(item)}${index}`, index: index, item: item }, itemToString(item))));
/**
 * ComboboxMenu renders the options list of the combobox and is positioned relative to the
 * ComboboxInput element using Popper. By default, it will render the array of items as an array of
 * ComboboxItem components. Pass children (or a render function) to customize the appearance or
 * rendering of the combobox menu.
 */
export const ComboboxMenu = React.forwardRef((_a, ref) => {
    var { children = defaultMenuRender, className } = _a, props = __rest(_a, ["children", "className"]);
    const { getMenuProps, getPopperProps, isOpen, items, itemToString } = useComboboxContext();
    return (React.createElement("div", Object.assign({}, getPopperProps(), { className: classNames(styles.menu, isOpen && items.length && styles.isOpen), role: "presentation" }),
        React.createElement(Box, Object.assign({}, getMenuProps(Object.assign(Object.assign({}, props), { ref })), { as: "ul", className: classNames(styles.list, className) }), isOpen &&
            runIfFn(children, {
                isOpen,
                items,
                itemToString,
            }))));
});

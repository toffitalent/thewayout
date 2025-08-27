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
import classNames from 'classnames';
import React from 'react';
import { Box } from '../Box';
import styles from './Tag.module.scss';
/**
 * Tags (or Chips) can be used to display an item's status or tags. Compared to the Badge
 * component, Tag renders slightly differently and supports internal buttons and icons.
 */
export const Tag = React.forwardRef((_a, ref) => {
    var { as, colorScheme = 'primary', size = 'md', variant = 'outline' } = _a, props = __rest(_a, ["as", "colorScheme", "size", "variant"]);
    const scheme = colorScheme !== 'black' && colorScheme !== 'white' ? colorScheme : undefined;
    return (React.createElement(Box, Object.assign({ bgcolor: scheme, borderColor: scheme, color: scheme }, props, { as: as || 'span', className: classNames(styles.tag, styles[colorScheme], styles[size], styles[variant], props.className), ref: ref })));
});
/**
 * TagLabel wraps the text content of the Tag, particularly when using TagButton or TagIcon
 * components. For basic usage, `<Tag>Label</Tag>` works just fine. But TagLabel will automatically
 * add spacing to when using other Tag-related children.
 */
export const TagLabel = React.forwardRef((props, ref) => (React.createElement(Box, Object.assign({}, props, { as: "span", className: classNames(styles.label, props.className), ref: ref }))));
/**
 * TagIcon wraps an <Icon /> component and applies styles to ensure it renders appropriately within
 * the Tag.
 */
export const TagIcon = React.forwardRef(({ children }, ref) => React.cloneElement(children, {
    className: classNames(styles.icon, children.className),
    ref,
}));
/**
 * TagButton renders an HTML button and expects an <Icon /> child. Apply an aria-label attribute
 * for proper accessibility.
 */
export const TagButton = React.forwardRef((_a, ref) => {
    var { showBorder = false } = _a, props = __rest(_a, ["showBorder"]);
    return (React.createElement(Box, Object.assign({}, props, { as: "button", className: classNames(styles.button, showBorder && styles.showBorder, props.className), type: "button", ref: ref })));
});

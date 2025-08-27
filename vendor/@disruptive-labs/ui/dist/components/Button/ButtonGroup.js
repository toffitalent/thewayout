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
import styles from './ButtonGroup.module.scss';
/**
 * ButtonGroup renders a group of related buttons (e.g. up/down arrows).
 */
export const ButtonGroup = React.forwardRef((_a, ref) => {
    var { children, colorScheme = 'primary', size = 'md', variant = 'solid' } = _a, props = __rest(_a, ["children", "colorScheme", "size", "variant"]);
    return (React.createElement(Box, Object.assign({}, props, { className: classNames(styles.group, styles[colorScheme], styles[variant], props.className), ref: ref }), React.Children.map(children, (child) => React.cloneElement(child, {
        className: styles.item,
        colorScheme,
        size,
        variant,
    }))));
});

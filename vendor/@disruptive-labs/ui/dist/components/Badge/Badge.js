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
import styles from './Badge.module.scss';
/**
 * Badges can be used to display an item's status or tags.
 */
export const Badge = React.forwardRef((_a, ref) => {
    var { children, className, colorScheme = 'grey', variant = 'subtle' } = _a, props = __rest(_a, ["children", "className", "colorScheme", "variant"]);
    const isSubtle = variant === 'subtle';
    let bgcolor = isSubtle ? `${colorScheme}.200` : colorScheme;
    let color = isSubtle ? `${colorScheme}.800` : 'light';
    if (variant === 'outline') {
        color = bgcolor;
        bgcolor = undefined;
    }
    return (React.createElement(Box, Object.assign({ as: "div", bgcolor: bgcolor, borderColor: bgcolor, color: color }, props, { className: classNames(styles.badge, className), ref: ref }), children));
});

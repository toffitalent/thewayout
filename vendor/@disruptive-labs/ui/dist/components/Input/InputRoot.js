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
import styles from './InputRoot.module.scss';
export function InputRoot(_a) {
    var { children, className, colorScheme = 'primary', disabled = false, fluid = false, invalid = false, size = 'md' } = _a, props = __rest(_a, ["children", "className", "colorScheme", "disabled", "fluid", "invalid", "size"]);
    return (React.createElement(Box, Object.assign({}, props, { className: classNames(styles.root, styles[colorScheme], styles[size], {
            [styles.disabled]: disabled,
            [styles.fluid]: fluid,
            [styles.invalid]: invalid,
        }, className) }), children));
}

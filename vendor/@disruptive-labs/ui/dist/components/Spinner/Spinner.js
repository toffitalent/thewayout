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
import styles from './Spinner.module.scss';
/**
 * Spinner is a basic loading spinner with an animation to indicate there is something happening.
 */
export const Spinner = React.forwardRef((_a, ref) => {
    var { className, size = 'md' } = _a, props = __rest(_a, ["className", "size"]);
    return (React.createElement(Box, Object.assign({}, props, { as: "div", className: classNames(styles.spinner, styles[size], className), ref: ref })));
});

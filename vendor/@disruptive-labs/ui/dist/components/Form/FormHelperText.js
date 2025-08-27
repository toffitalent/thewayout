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
import styles from './FormHelperText.module.scss';
export const FormHelperText = React.forwardRef((_a, ref) => {
    var { children, className, invalid } = _a, props = __rest(_a, ["children", "className", "invalid"]);
    return (React.createElement(Box, Object.assign({ as: "div" }, props, { className: classNames(styles.helperText, { [styles.invalid]: invalid }, className), ref: ref }), children));
});

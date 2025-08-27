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
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from './Icons';
import styles from './Alert.module.scss';
const ICONS = {
    danger: ErrorIcon,
    info: InfoIcon,
    success: SuccessIcon,
    warning: WarningIcon,
};
/**
 * An alert displays an important message in a way that attracts attention without disrupting the
 * task at hand. Alerts are intended to be placed statically within the page, not fixed to the
 * viewport.
 */
export const Alert = React.forwardRef((_a, ref) => {
    var { children, className, status } = _a, props = __rest(_a, ["children", "className", "status"]);
    return (React.createElement(Box, Object.assign({ as: "div", role: "alert" }, props, { className: classNames(styles.alert, styles[status], className), ref: ref }),
        React.createElement("div", { className: styles.icon }, ICONS[status]),
        React.createElement("div", null, children)));
});
/**
 * AlertTitle can be used to add additional important context to an Alert.
 */
export const AlertTitle = React.forwardRef((_a, ref) => {
    var { children, className } = _a, props = __rest(_a, ["children", "className"]);
    return (React.createElement(Box, Object.assign({ as: "div" }, props, { className: classNames(styles.title, className), ref: ref }), children));
});

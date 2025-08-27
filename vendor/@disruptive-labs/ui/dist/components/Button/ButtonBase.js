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
import { Spinner } from '../Spinner';
import styles from './ButtonBase.module.scss';
export const ButtonBase = React.forwardRef((_a, ref) => {
    var { accessoryLeft, accessoryRight, as, className, children, colorScheme = 'primary', disabled, fluid = false, loading = false, loadingText = '', size = 'md', variant = 'solid' } = _a, props = __rest(_a, ["accessoryLeft", "accessoryRight", "as", "className", "children", "colorScheme", "disabled", "fluid", "loading", "loadingText", "size", "variant"]);
    const buttonClassName = classNames(styles.button, styles[size], styles[variant], styles[`c-${colorScheme}`], {
        [styles.disabled]: !!disabled,
        [styles.fluid]: fluid,
        [styles.loading]: loading,
    }, className);
    return (React.createElement(Box, Object.assign({ as: as || 'button' }, props, { className: buttonClassName, disabled: disabled, ref: ref }),
        accessoryLeft && !loading && (React.createElement("span", { className: styles.accessoryLeft, "aria-hidden": "true" }, accessoryLeft)),
        loading && (React.createElement(Spinner, { className: classNames(styles.spinner, !loadingText && styles.spinnerLoading) })),
        loading
            ? loadingText || React.createElement("span", { className: styles.loadingText }, children)
            : children,
        accessoryRight && !loading && (React.createElement("span", { className: styles.accessoryRight, "aria-hidden": "true" }, accessoryRight))));
});

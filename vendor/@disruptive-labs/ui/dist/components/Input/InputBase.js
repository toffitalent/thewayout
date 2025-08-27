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
import { getProps } from '../../styles';
import { InputRoot } from './InputRoot';
import styles from './InputBase.module.scss';
/**
 * InputBase is the raw HTML input/textarea element upon which the Input component is built. Use
 * this base element when building complex components that require an input without all the extra
 * functionality of Input, but with the base theme styles and functionality here.
 */
export const InputBase = React.forwardRef((_a, ref) => {
    var { accessoryLeft, accessoryRight, className, colorScheme = 'primary', disabled = false, fluid = false, invalid = false, multiline = false, required, size = 'md' } = _a, props = __rest(_a, ["accessoryLeft", "accessoryRight", "className", "colorScheme", "disabled", "fluid", "invalid", "multiline", "required", "size"]);
    const _b = getProps(Object.assign({ rows: multiline ? 4 : undefined, type: !multiline ? 'text' : undefined }, props)), { sx } = _b, rest = __rest(_b, ["sx"]);
    return (React.createElement(InputRoot, { className: classNames(styles[size], multiline && styles.multiline, className), colorScheme: colorScheme, disabled: disabled, fluid: fluid, invalid: invalid, size: size, sx: sx },
        accessoryLeft && React.createElement("div", { className: styles.accessory }, accessoryLeft),
        React.createElement(Box, Object.assign({}, rest, { as: multiline ? 'textarea' : 'input', className: styles.input, disabled: disabled, "aria-invalid": invalid || undefined, "aria-required": required, ref: ref })),
        accessoryRight && React.createElement("div", { className: styles.accessory }, accessoryRight)));
});

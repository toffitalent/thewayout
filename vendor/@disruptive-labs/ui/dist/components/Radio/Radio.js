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
import { useSx } from '../../styles';
import styles from './Radio.module.scss';
/**
 * Typical radio component, generally used when a user needs to select a single value from a
 * list of options.
 */
export const Radio = React.forwardRef((_a, ref) => {
    var { checked, children, colorScheme = 'primary', defaultChecked, disabled = false, invalid, name, onChange, size = 'md', value } = _a, props = __rest(_a, ["checked", "children", "colorScheme", "defaultChecked", "disabled", "invalid", "name", "onChange", "size", "value"]);
    const _b = useSx(props), { className } = _b, rest = __rest(_b, ["className"]);
    return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    React.createElement(Box, { as: "label", className: classNames(styles.radio, styles[colorScheme], styles[size], {
            [styles.disabled]: disabled,
            [styles.invalid]: invalid,
        }, className) },
        React.createElement("input", Object.assign({}, rest, { type: "radio", className: styles.input, checked: checked, defaultChecked: defaultChecked, disabled: disabled, name: name, onChange: onChange, ref: ref, value: value })),
        React.createElement(Box, { borderColor: colorScheme, color: colorScheme, className: styles.control, "aria-hidden": "true" }),
        children && React.createElement("div", { className: styles.label }, children)));
});

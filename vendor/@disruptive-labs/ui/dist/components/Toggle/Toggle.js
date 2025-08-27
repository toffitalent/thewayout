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
import React, { useId } from 'react';
import { Box } from '../Box';
import { FormControl, FormHelperText } from '../Form';
import { getProps } from '../../styles';
import styles from './Toggle.module.scss';
/**
 * Toggle is a switch component that is basically a checkbox with a fancier visual design.
 */
export const Toggle = React.forwardRef((_a, ref) => {
    var { checked, children, className, colorScheme = 'primary', defaultChecked, disabled = false, helperText, invalid, onChange, size = 'md' } = _a, props = __rest(_a, ["checked", "children", "className", "colorScheme", "defaultChecked", "disabled", "helperText", "invalid", "onChange", "size"]);
    const id = useId();
    const _b = getProps(props), { sx } = _b, rest = __rest(_b, ["sx"]);
    return (React.createElement(FormControl, { sx: sx },
        React.createElement("label", { className: classNames(styles.toggle, styles[colorScheme], styles[size], {
                [styles.disabled]: disabled,
                [styles.invalid]: invalid,
            }, className) },
            React.createElement("input", Object.assign({ type: "checkbox" }, rest, { className: styles.input, checked: checked, defaultChecked: defaultChecked, disabled: disabled, id: id, onChange: onChange, ref: ref, "aria-describedby": helperText ? `${id}-helptext` : undefined, "aria-invalid": invalid || undefined })),
            React.createElement(Box, { bgcolor: colorScheme, className: styles.control, "aria-hidden": "true" },
                React.createElement("div", { className: styles.thumb })),
            children && React.createElement("div", { className: styles.label }, children)),
        helperText && (React.createElement(FormHelperText, { id: `${id}-helptext`, invalid: invalid, "aria-live": "polite" }, helperText))));
});

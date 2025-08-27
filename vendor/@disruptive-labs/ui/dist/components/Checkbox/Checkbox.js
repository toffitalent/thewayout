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
import { FormControl, FormHelperText } from '../Form';
import { CheckboxIcon } from './CheckboxIcon';
import styles from './Checkbox.module.scss';
import { Box } from '../Box';
/**
 * Typical checkbox component, generally used when a user needs to select multiple values from a
 * list of options.
 */
export const Checkbox = React.forwardRef((_a, ref) => {
    var { checked, children, className, colorScheme = 'primary', defaultChecked, disabled = false, helperText, indeterminate, invalid, name, onChange, size = 'md', value } = _a, props = __rest(_a, ["checked", "children", "className", "colorScheme", "defaultChecked", "disabled", "helperText", "indeterminate", "invalid", "name", "onChange", "size", "value"]);
    const id = useId();
    return (React.createElement(FormControl, Object.assign({}, props),
        React.createElement("label", { className: classNames(styles.checkbox, styles[colorScheme], styles[size], {
                [styles.disabled]: disabled,
                [styles.invalid]: invalid,
            }, className) },
            React.createElement("input", { type: "checkbox", className: styles.input, checked: checked, defaultChecked: defaultChecked, disabled: disabled, id: id, name: name, onChange: onChange, value: value, "aria-describedby": helperText ? `${id}-helptext` : undefined, "aria-invalid": invalid || undefined, ref: ref }),
            React.createElement(Box, { bgcolor: colorScheme, borderColor: colorScheme, className: styles.control, "aria-hidden": "true" },
                React.createElement(CheckboxIcon, { className: styles.icon, indeterminate: indeterminate })),
            children && React.createElement("div", { className: styles.label }, children)),
        helperText && (React.createElement(FormHelperText, { id: `${id}-helptext`, invalid: invalid, "aria-live": "polite" }, helperText))));
});

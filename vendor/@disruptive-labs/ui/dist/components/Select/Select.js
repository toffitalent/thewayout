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
import { getProps } from '../../styles';
import { FormControl, FormHelperText, FormLabel } from '../Form';
import { InputRoot } from '../Input/InputRoot';
import { SelectIcon } from './SelectIcon';
import styles from './Select.module.scss';
/**
 * Select renders a select dropdown field where users can select a value from a list of options.
 * To maximize accessibility, this component uses the built-in select functionality from the
 * browser, simply styling the element rather than creating a custom implementation.
 */
export const Select = React.forwardRef((_a, ref) => {
    var { children, className, colorScheme = 'primary', disabled = false, fluid = false, helperText, invalid, label, placeholder, required, size = 'md', value } = _a, props = __rest(_a, ["children", "className", "colorScheme", "disabled", "fluid", "helperText", "invalid", "label", "placeholder", "required", "size", "value"]);
    const id = useId();
    const _b = getProps(props), { sx } = _b, rest = __rest(_b, ["sx"]);
    return (React.createElement(FormControl, { sx: sx },
        label && React.createElement(FormLabel, { htmlFor: id }, label),
        React.createElement(InputRoot, { className: classNames(styles[size], className), colorScheme: colorScheme, disabled: disabled, fluid: fluid, invalid: invalid, size: size },
            React.createElement("select", Object.assign({}, rest, { className: styles.input, disabled: disabled, id: id, value: value, ref: ref, "aria-describedby": helperText ? `${id}-helptext` : undefined, "aria-invalid": invalid || undefined, "aria-required": required }),
                placeholder && (React.createElement("option", { disabled: true, hidden: true, value: "" }, placeholder)),
                children),
            React.createElement("div", { className: styles.icon },
                React.createElement(SelectIcon, null))),
        helperText && (React.createElement(FormHelperText, { id: `${id}-helptext`, invalid: invalid, "aria-live": "polite" }, helperText))));
});

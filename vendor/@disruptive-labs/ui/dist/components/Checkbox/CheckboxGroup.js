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
import React, { useCallback } from 'react';
import { addItem, removeItem } from '../../utils';
import { FormControl, FormHelperText, FormLabel } from '../Form';
import styles from './CheckboxGroup.module.scss';
/**
 * CheckboxGroup renders a set of Checkbox components and handles the selection of multiple values.
 */
export const CheckboxGroup = React.forwardRef((_a, ref) => {
    var { children, className, colorScheme = 'primary', helperText, inline = false, label, onChange: onChangeProp, size = 'md', value } = _a, props = __rest(_a, ["children", "className", "colorScheme", "helperText", "inline", "label", "onChange", "size", "value"]);
    const onChange = useCallback((event) => {
        if (!value)
            return;
        const { checked, value: selectedValue } = event.target;
        onChangeProp === null || onChangeProp === void 0 ? void 0 : onChangeProp(checked ? addItem(value, selectedValue) : removeItem(value, selectedValue));
    }, [onChangeProp, value]);
    return (React.createElement(FormControl, Object.assign({}, props),
        React.createElement("fieldset", { className: classNames(styles.group, { [styles.inline]: inline }, className), ref: ref },
            label && React.createElement(FormLabel, { as: "legend" }, label),
            React.Children.map(children, (child, index) => {
                var _a;
                return (React.createElement("div", { className: styles.item }, React.cloneElement(child, {
                    // eslint-disable-next-line react/no-array-index-key
                    key: index,
                    colorScheme,
                    size,
                    checked: value ? value.includes((_a = child === null || child === void 0 ? void 0 : child.props) === null || _a === void 0 ? void 0 : _a.value) : undefined,
                    onChange,
                })));
            })),
        helperText && React.createElement(FormHelperText, { "aria-live": "polite" }, helperText)));
});

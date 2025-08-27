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
import React, { useCallback, useId } from 'react';
import { FormControl, FormHelperText, FormLabel } from '../Form';
import styles from './RadioGroup.module.scss';
/**
 * RadioGroup renders a set of Radio components and handles the selection of a value.
 */
export const RadioGroup = React.forwardRef((_a, ref) => {
    var { children, className, colorScheme = 'primary', helperText, inline = false, invalid = false, label, name: nameProp, onChange: onChangeProp, size = 'md', value } = _a, props = __rest(_a, ["children", "className", "colorScheme", "helperText", "inline", "invalid", "label", "name", "onChange", "size", "value"]);
    const id = useId();
    const isControlled = typeof value !== 'undefined';
    const name = nameProp || id;
    const onChange = useCallback((event) => {
        if (!isControlled)
            return;
        const { value: selectedValue } = event.target;
        onChangeProp === null || onChangeProp === void 0 ? void 0 : onChangeProp(selectedValue);
    }, [isControlled, onChangeProp]);
    return (React.createElement(FormControl, Object.assign({}, props),
        React.createElement("fieldset", { className: classNames(styles.group, { [styles.inline]: inline }, className), ref: ref },
            label && React.createElement(FormLabel, { as: "legend" }, label),
            React.createElement("div", { role: "radiogroup" }, React.Children.map(children, (child, index) => {
                var _a;
                return (React.createElement("div", { className: styles.item }, React.cloneElement(child, {
                    // eslint-disable-next-line react/no-array-index-key
                    key: index,
                    colorScheme,
                    invalid,
                    name,
                    size,
                    checked: isControlled ? value === ((_a = child === null || child === void 0 ? void 0 : child.props) === null || _a === void 0 ? void 0 : _a.value) : undefined,
                    onChange,
                })));
            }))),
        helperText && (React.createElement(FormHelperText, { id: `${id}-helptext`, invalid: invalid, "aria-live": "polite" }, helperText))));
});

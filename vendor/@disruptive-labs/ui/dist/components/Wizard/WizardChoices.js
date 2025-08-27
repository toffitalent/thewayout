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
import React, { useCallback, useId } from 'react';
import { useValidate } from '../Field';
import { Controller, FormControl, FormHelperText, FormLabel, } from '../Form';
import { addItem, classNames, removeItem } from '../../utils';
import styles from './Wizard.module.scss';
import { WizardText } from './utils';
/**
 * WizardChoicesItem renders an accessible element to mimics a checkbox or radio and is useable via
 * both keyboard and mouse.
 */
export function WizardChoicesItem({ checked, disabled, label, onChange: onChangeProp, role, value, }) {
    const onChange = useCallback(() => {
        onChangeProp === null || onChangeProp === void 0 ? void 0 : onChangeProp(value, !checked);
    }, [checked, onChangeProp, value]);
    const onKeyDown = useCallback((event) => {
        if (event.key === ' ')
            onChange();
    }, [onChange]);
    return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    React.createElement("div", { onClick: onChange, onKeyDown: onKeyDown, role: role, 
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex: 0, "aria-checked": checked, "aria-disabled": disabled, className: styles.choicesItem },
        React.createElement("span", { className: styles.choicesItemText }, label),
        React.createElement("span", { className: styles.choicesItemIcon },
            React.createElement("svg", { focusable: false, role: "presentation", viewBox: "0 0 24 24" },
                React.createElement("polygon", { fill: "currentColor", points: "9.3,19 3,12.8 5.3,10.4 9.3,14.3 18.7,5 21,7.3 " })))));
}
function isChoiceGroup(item) {
    return Array.isArray(item.options);
}
function WizardChoicesControl(_a) {
    var { className, fluid, helperText, inline, invalid = false, label, maxChoices, multiple = false, onChange: onChangeProp, options, value } = _a, props = __rest(_a, ["className", "fluid", "helperText", "inline", "invalid", "label", "maxChoices", "multiple", "onChange", "options", "value"]);
    const id = useId();
    const onChange = useCallback((selectedValue, checked) => {
        let updatedValue;
        if (multiple) {
            const currentValue = Array.isArray(value) ? value : [];
            updatedValue = checked
                ? addItem(currentValue, selectedValue)
                : removeItem(currentValue, selectedValue);
        }
        else {
            updatedValue = selectedValue;
        }
        onChangeProp(updatedValue);
    }, [multiple, onChangeProp, value]);
    return (React.createElement(FormControl, Object.assign({}, props, { className: classNames(styles.control, { [styles.fluid]: fluid !== null && fluid !== void 0 ? fluid : inline }) }),
        React.createElement("fieldset", { className: classNames(styles.choices, { [styles.inline]: inline }, className) },
            label && React.createElement(FormLabel, { as: "legend" }, label),
            React.createElement("div", { role: multiple ? undefined : 'radiogroup' }, options.map((item, index) => {
                var _a, _b;
                return isChoiceGroup(item) ? (
                // eslint-disable-next-line react/no-array-index-key
                React.createElement("div", { key: `${(_a = item.title) !== null && _a !== void 0 ? _a : 'item'}${index}`, className: styles.choicesGroup },
                    item.title && (React.createElement(WizardText, { className: styles.choicesGroupTitle }, item.title)),
                    item.options.map((option) => {
                        var _a;
                        return (React.createElement(WizardChoicesItem, Object.assign({ key: `${option.label}${option.value}` }, option, { checked: (_a = (multiple ? value === null || value === void 0 ? void 0 : value.includes(option.value) : value === option.value)) !== null && _a !== void 0 ? _a : false, role: multiple ? 'checkbox' : 'radio', onChange: onChange, disabled: multiple && maxChoices
                                ? !(value === null || value === void 0 ? void 0 : value.includes(option.value)) && value.length >= maxChoices
                                : false })));
                    }))) : (React.createElement(WizardChoicesItem, Object.assign({ key: `${item.label}${item.value}` }, item, { checked: (_b = (multiple ? value === null || value === void 0 ? void 0 : value.includes(item.value) : value === item.value)) !== null && _b !== void 0 ? _b : false, role: multiple ? 'checkbox' : 'radio', onChange: onChange, disabled: multiple && maxChoices
                        ? !(value === null || value === void 0 ? void 0 : value.includes(item.value)) && value.length >= maxChoices
                        : false })));
            }))),
        helperText && (React.createElement(FormHelperText, { id: `${id}-helptext`, invalid: invalid, "aria-live": "polite" }, helperText))));
}
/**
 * WizardChoices is a drop-in replacement for rendering a CheckboxGroup or RadioGroup in the
 * context of a form with a more aesthetically-pleasing design (similar to Typeform for example).
 */
export function WizardChoices(_a) {
    var { control, name, validate: validateProp, validationError, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type } = _a, props = __rest(_a, ["control", "name", "validate", "validationError", "type"]);
    const validate = useValidate(validateProp, validationError);
    return (React.createElement(Controller, { control: control, name: name, rules: { validate }, render: ({ field: { onChange, value }, fieldState: { error, invalid } }) => (React.createElement(WizardChoicesControl, Object.assign({}, props, { invalid: invalid, helperText: (error === null || error === void 0 ? void 0 : error.message) || props.helperText, onChange: onChange, value: value }))) }));
}

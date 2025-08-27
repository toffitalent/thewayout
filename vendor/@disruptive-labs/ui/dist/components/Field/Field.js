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
import React from 'react';
import { Controller } from '../Form';
import { Checkbox } from '../Checkbox';
import { Input } from '../Input';
import { Radio, RadioGroup } from '../Radio';
import { Select } from '../Select';
import { Toggle } from '../Toggle';
import { useValidate } from './useValidate';
import { mergeRefs } from '../../utils';
/**
 * Field renders various input types using the other components of this library (e.g. Checkbox,
 * Input, Select, etc.) based on the `type` prop. It requires a `control` object from the `useForm`
 * hook (which wraps react-hook-form). Use the underlying components themselves for custom scenarios.
 *
 * Field has built-in support for basic form validation rules as well. Simply supply a `validate`
 * prop to a Field component with a validation rules object (or a custom validate function instead,
 * if desired). For now, the supported validation rules are: `required`, `email`, `url`,
 * `maxLength`, `minLength`, `max` (number), `min` (number), and `pattern` (regex). A `validate`
 * property can also be supplied in the object with a custom validation function.
 *
 * The `useValidate` hook, `createValidate` utility, and the validators themselves are all exported
 * for custom usage. Form-level validation (vs field-level) validation is also supported using the
 * `useValidationResolver` hook, which returns a function that can be passed directly to the
 * `resolver` prop of `useForm`.
 */
export const Field = (_a) => {
    var { control, defaultValue, fieldRef, label, name, type, validate: validateProp, validationError } = _a, props = __rest(_a, ["control", "defaultValue", "fieldRef", "label", "name", "type", "validate", "validationError"]);
    const validate = useValidate(validateProp, validationError);
    switch (type) {
        case 'checkbox':
            return (React.createElement(Controller, { control: control, defaultValue: defaultValue, name: name, rules: { validate }, render: ({ field: { name, onChange, ref, value }, fieldState: { error, invalid } }) => (React.createElement(Checkbox, Object.assign({}, props, { invalid: invalid, helperText: (error === null || error === void 0 ? void 0 : error.message) || props.helperText, name: name, checked: !!value, onChange: onChange, ref: mergeRefs(ref, fieldRef) }), label)) }));
        case 'radio': {
            const _b = props, { options } = _b, rest = __rest(_b, ["options"]);
            return (React.createElement(Controller, { control: control, defaultValue: defaultValue, name: name, rules: { validate }, render: ({ field: { name, onChange, value }, fieldState: { error, invalid } }) => (React.createElement(RadioGroup, Object.assign({}, rest, { ref: fieldRef, invalid: invalid, helperText: (error === null || error === void 0 ? void 0 : error.message) || rest.helperText, label: label, name: name, onChange: onChange, value: value }), options.map((option) => (React.createElement(Radio, { key: option.value, value: option.value }, option.label))))) }));
        }
        case 'select': {
            const _c = props, { options } = _c, rest = __rest(_c, ["options"]);
            return (React.createElement(Controller, { control: control, defaultValue: defaultValue, name: name, rules: { validate }, render: ({ field: { name, onBlur, onChange, ref, value }, fieldState: { error, invalid }, }) => (React.createElement(Select, Object.assign({ fluid: true }, rest, { invalid: invalid, helperText: (error === null || error === void 0 ? void 0 : error.message) || rest.helperText, label: label, name: name, onBlur: onBlur, onChange: onChange, value: value, ref: mergeRefs(ref, fieldRef) }), options.map((option) => (React.createElement("option", { key: option.value, value: option.value }, option.label))))) }));
        }
        case 'toggle':
            return (React.createElement(Controller, { control: control, defaultValue: defaultValue, name: name, rules: { validate }, render: ({ field: { name, onChange, ref, value }, fieldState: { error, invalid } }) => (React.createElement(Toggle, Object.assign({}, props, { invalid: invalid, helperText: (error === null || error === void 0 ? void 0 : error.message) || props.helperText, name: name, checked: value, onChange: onChange, ref: mergeRefs(ref, fieldRef) }), label)) }));
        default:
            return (React.createElement(Controller, { control: control, defaultValue: defaultValue, name: name, rules: { validate }, render: ({ field: { name, onBlur, onChange, ref, value }, fieldState: { error, invalid }, }) => (React.createElement(Input, Object.assign({}, props, { invalid: invalid, helperText: (error === null || error === void 0 ? void 0 : error.message) || props.helperText, label: label, name: name, onBlur: onBlur, onChange: onChange, ref: mergeRefs(ref, fieldRef), type: type, value: value }))) }));
    }
};

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
const isNullOrUndefined = (value) => value == null;
const isRegex = (value) => value instanceof RegExp;
const isString = (value) => typeof value === 'string';
const isObject = (value) => !isNullOrUndefined(value) &&
    !Array.isArray(value) &&
    typeof value === 'object' &&
    !(value instanceof Date);
const getValueAndMessage = (validationRule) => isObject(validationRule) && !isRegex(validationRule)
    ? validationRule
    : { value: validationRule, message: '' };
export const Validators = {
    required: (value, rule) => (!!rule && !value ? 'This field is required.' : undefined),
    maxLength: (value, rule) => isString(value) && value.length > rule ? `Maximum length is ${rule} characters.` : undefined,
    minLength: (value, rule) => isString(value) && value.length < rule ? `Minimum length is ${rule} characters.` : undefined,
    max: (value, rule) => !isNullOrUndefined(value) && parseFloat(value) > rule ? `Maximum value is ${rule}.` : undefined,
    min: (value, rule) => !isNullOrUndefined(value) && parseFloat(value) < rule ? `Minimum value is ${rule}.` : undefined,
    email: (value, rule) => !!rule &&
        isString(value) &&
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(value)
        ? 'Invalid email address.'
        : undefined,
    url: (value, rule) => !!rule && isString(value) && !/^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/i.test(value)
        ? 'Invalid URL.'
        : undefined,
    pattern: (value, rule) => isString(value) && isRegex(rule) && !value.match(rule) ? 'This field is invalid.' : undefined,
};
export const createValidate = (validation, validationErrorMessage) => (value) => {
    const { validate } = validation, validationRules = __rest(validation, ["validate"]);
    const error = Object.entries(validationRules).reduce((validationError, [rule, validationRule]) => {
        if (validationError || !validationRule)
            return validationError;
        const output = getValueAndMessage(validationRule);
        const validator = Validators[rule];
        const result = validator === null || validator === void 0 ? void 0 : validator(value, output.value);
        return result ? output.message || validationErrorMessage || result : undefined;
    }, undefined);
    return error || (validate === null || validate === void 0 ? void 0 : validate(value)) || undefined;
};

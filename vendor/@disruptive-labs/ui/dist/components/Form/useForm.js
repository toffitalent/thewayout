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
import { useCallback } from 'react';
import { useForm as useReactHookForm, } from 'react-hook-form';
import { useEventCallback } from '../../hooks';
export function useForm(_a = {}) {
    var { onSubmit: onSubmitProp } = _a, props = __rest(_a, ["onSubmit"]);
    const onSubmit = useEventCallback(onSubmitProp);
    const methods = useReactHookForm(props);
    const submitForm = useCallback((e) => methods.handleSubmit(onSubmit)(e), [methods, onSubmit]);
    methods.submitForm = submitForm;
    methods.control.submitForm = submitForm;
    return methods;
}
export { Controller, FormProvider, useController, useFieldArray, useFormContext, useFormState, useWatch, } from 'react-hook-form';

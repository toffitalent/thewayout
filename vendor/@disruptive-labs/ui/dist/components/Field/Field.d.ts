import React from 'react';
import { Control } from '../Form';
import { CheckboxProps } from '../Checkbox';
import { InputProps } from '../Input';
import { RadioGroupProps } from '../Radio';
import { SelectProps } from '../Select';
import type { TextProps } from '../Text';
import { ToggleProps } from '../Toggle';
import type { Validation, Validator } from './Validator';
type InputFieldType = 'text' | 'email' | 'number' | 'password' | 'tel' | 'url' | 'date';
export type FieldType = 'checkbox' | 'radio' | 'select' | 'toggle' | InputFieldType;
export interface FieldOptions {
    /**
     * The option label.
     */
    label: string | React.ReactElement<TextProps>;
    /**
     * The option value.
     */
    value: string;
}
export interface FieldTypeProps {
    checkbox: Omit<CheckboxProps, 'onChange'>;
    radio: Omit<RadioGroupProps, 'children' | 'onChange'> & {
        options: FieldOptions[];
    };
    select: Omit<SelectProps, 'onBlur' | 'onChange'> & {
        options: FieldOptions[];
    };
    toggle: Omit<ToggleProps, 'onChange'>;
    text: Omit<InputProps, 'onBlur' | 'onChange'>;
    email: Omit<InputProps, 'onBlur' | 'onChange'>;
    number: Omit<InputProps, 'onBlur' | 'onChange'>;
    password: Omit<InputProps, 'onBlur' | 'onChange'>;
    tel: Omit<InputProps, 'onBlur' | 'onChange'>;
    url: Omit<InputProps, 'onBlur' | 'onChange'>;
    date: Omit<InputProps, 'onBlur' | 'onChange'>;
}
interface FieldTypeRefs {
    checkbox: HTMLInputElement;
    radio: HTMLFieldSetElement;
    select: HTMLSelectElement;
    toggle: HTMLInputElement;
    text: HTMLInputElement | HTMLTextAreaElement;
    email: HTMLInputElement;
    number: HTMLInputElement;
    password: HTMLInputElement;
    tel: HTMLInputElement;
    url: HTMLInputElement;
    date: HTMLInputElement;
}
export interface FieldProps<T extends FieldType> {
    /**
     * Control object from useForm.
     */
    control: Control<any, any>;
    /**
     * A default value for the field (if not using default values on useForm).
     */
    defaultValue?: any;
    /**
     * React ref to forward to underlying field component.
     */
    fieldRef?: React.Ref<FieldTypeRefs[T]>;
    /**
     * Content to render as the input label.
     */
    label?: React.ReactNode;
    /**
     * The input name used in form submission.
     */
    name: string;
    /**
     * The input type.
     */
    type: T;
    /**
     * A validation object or function
     */
    validate?: Validation | Validator;
    /**
     * A default validation error to override default validator messages
     *
     * NOTE: Supply custom, error-specific messages using the value/message syntax:
     * validate={{ maxLength: { value: 10, message: 'TOO LONG!' } }}
     */
    validationError?: string;
}
export type FieldComponentProps<T extends FieldType> = FieldProps<T> & FieldTypeProps[T];
type FieldElement<T extends FieldType> = React.ReactElement<FieldComponentProps<T>>;
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
export declare const Field: <T extends FieldType>({ control, defaultValue, fieldRef, label, name, type, validate: validateProp, validationError, ...props }: FieldComponentProps<T>) => FieldElement<T>;
export {};

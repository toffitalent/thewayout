type ValidationValue = boolean | number | string | RegExp;
type ValidationValueMessage<T extends ValidationValue = ValidationValue> = {
    value: T;
    message: string;
};
type ValidationRule<T extends ValidationValue = ValidationValue> = T | ValidationValueMessage<T>;
type ValidationMap<T extends Record<string, ValidationValue>> = {
    [Property in keyof T]?: T[Property] | ValidationRule<T[Property]>;
};
export type Validator = (value: any) => string | boolean | undefined | Promise<string | boolean | undefined>;
type ValidationProps = {
    required: boolean;
    maxLength: number;
    minLength: number;
    max: number;
    min: number;
    email: boolean;
    url: boolean;
    pattern: RegExp;
};
export type ValidationRules = ValidationMap<ValidationProps>;
export type Validation = ValidationRules & {
    validate?: (value: any) => string | undefined;
};
export declare const Validators: {
    [K in keyof ValidationProps]: (value: any, rule: ValidationProps[K]) => string | undefined;
};
export declare const createValidate: (validation: Validation, validationErrorMessage?: string) => Validator;
export {};

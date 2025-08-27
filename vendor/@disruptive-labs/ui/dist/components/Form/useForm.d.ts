import { Control as ReactHookFormControl, FieldValues, UseFormProps as UseReactHookFormProps, UseFormReturn as UseReactHookFormReturn, SubmitHandler } from 'react-hook-form';
export interface Control<TFieldValues extends FieldValues = FieldValues, TContext = any> extends ReactHookFormControl<TFieldValues, TContext> {
    submitForm: () => Promise<void>;
}
export interface UseFormProps<TFieldValues extends FieldValues = FieldValues, TContext = any> extends UseReactHookFormProps<TFieldValues, TContext> {
    onSubmit?: SubmitHandler<TFieldValues>;
}
export interface UseFormReturn<TFieldValues extends FieldValues = FieldValues, TContext = any> extends UseReactHookFormReturn<TFieldValues, TContext> {
    control: Control<TFieldValues, TContext>;
    submitForm: () => Promise<void>;
}
export declare function useForm<TFieldValues extends FieldValues = FieldValues, TContext = any>({ onSubmit: onSubmitProp, ...props }?: UseFormProps<TFieldValues, TContext>): UseFormReturn<TFieldValues, TContext>;
export { Controller, FormProvider, useController, useFieldArray, useFormContext, useFormState, useWatch, } from 'react-hook-form';

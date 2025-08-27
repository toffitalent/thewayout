import { FieldValues, Resolver } from 'react-hook-form';
import { Validation } from './Validator';
type ValidationConfig = Record<string, Validation & {
    message?: string;
}>;
export declare function useValidationResolver<TFieldValues extends FieldValues = FieldValues>(validationConfig: ValidationConfig): Resolver<TFieldValues, any>;
export {};

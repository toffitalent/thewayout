import React from 'react';
import { BoxProps } from '../Box';
import { InputRootProps } from '../Input/InputRoot';
export interface SelectProps extends InputRootProps, Omit<BoxProps<'select'>, 'size'> {
    /**
     * Class name(s) to override or extend the styles applied to the component.
     */
    className?: string;
    /**
     * Content to render as helper text.
     */
    helperText?: string;
    /**
     * Content to render as the input label.
     */
    label?: React.ReactNode;
    /**
     * Content to render as an initial placeholder value.
     */
    placeholder?: string;
    /**
     * If true, the `aria-required` attribute will be set on the input.
     *
     * @default false
     */
    required?: boolean;
    /**
     * The selected value.
     */
    value?: string;
}
/**
 * Select renders a select dropdown field where users can select a value from a list of options.
 * To maximize accessibility, this component uses the built-in select functionality from the
 * browser, simply styling the element rather than creating a custom implementation.
 */
export declare const Select: React.ForwardRefExoticComponent<Omit<SelectProps, "ref"> & React.RefAttributes<HTMLSelectElement>>;

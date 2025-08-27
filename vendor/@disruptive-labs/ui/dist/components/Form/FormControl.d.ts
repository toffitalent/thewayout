import React from 'react';
import { BoxProps } from '../Box';
export interface FormControlProps extends BoxProps<'div'> {
    /**
     * The content of the component.
     */
    children: React.ReactNode;
}
/**
 * FormControl wraps all other form input components to add the configured amount of space between
 * controls in the form.
 */
export declare const FormControl: React.ForwardRefExoticComponent<Omit<FormControlProps, "ref"> & React.RefAttributes<HTMLDivElement>>;

import React from 'react';
import { BoxProps } from '../Box';
export interface FormHelperTextProps extends BoxProps<'div'> {
    /**
     * The content of the component.
     */
    children: React.ReactNode;
    /**
     * If `true`, the helper text will use invalid styling.
     *
     * @default false
     */
    invalid?: boolean;
}
export declare const FormHelperText: React.ForwardRefExoticComponent<Omit<FormHelperTextProps, "ref"> & React.RefAttributes<HTMLDivElement>>;

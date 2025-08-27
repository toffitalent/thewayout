import React from 'react';
import { InputBaseProps } from './InputBase';
export interface InputProps extends InputBaseProps {
    /**
     * Content to render as helper text.
     */
    helperText?: string;
    /**
     * Content to render as the input label.
     */
    label?: React.ReactNode;
}
/**
 * Input renders a text field where users can enter and edit text.
 */
export declare const Input: React.ForwardRefExoticComponent<Omit<InputProps, "ref"> & React.RefAttributes<HTMLInputElement | HTMLTextAreaElement>>;

import React from 'react';
import { SystemProps } from '../../styles';
import { InputRootProps } from './InputRoot';
type InputComponentProps = Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> | React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, 'color' | 'size'>;
export interface InputBaseProps extends InputComponentProps, InputRootProps, SystemProps {
    /**
     * Element to show before the input but within the border.
     */
    accessoryLeft?: React.ReactNode;
    /**
     * Element to show after the input but within the border.
     */
    accessoryRight?: React.ReactNode;
    /**
     * If true, a textarea element will be rendered instead of an input.
     *
     * @default false
     */
    multiline?: boolean;
    /**
     * If true, the `aria-required` attribute will be set on the input.
     *
     * @default false
     */
    required?: boolean;
    /**
     * The number of rows to display when multiline is `true`.
     *
     * @default 4
     */
    rows?: string | number;
    /**
     * Input type (e.g. text, email, etc.)
     *
     * @default "text"
     */
    type?: string;
}
/**
 * InputBase is the raw HTML input/textarea element upon which the Input component is built. Use
 * this base element when building complex components that require an input without all the extra
 * functionality of Input, but with the base theme styles and functionality here.
 */
export declare const InputBase: React.ForwardRefExoticComponent<Omit<InputBaseProps, "ref"> & React.RefAttributes<HTMLInputElement | HTMLTextAreaElement>>;
export {};

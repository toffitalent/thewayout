import React from 'react';
import { FormControlProps } from '../Form';
import type { ThemeColorScheme } from '../../styles';
export interface CheckboxProps extends Omit<FormControlProps, 'children' | 'ref'> {
    /**
     * If `true`, the checkbox is checked.
     */
    checked?: boolean;
    /**
     * Content to render as a label.
     */
    children?: React.ReactNode;
    /**
     * The checkbox color scheme.
     *
     * @default "primary"
     */
    colorScheme?: ThemeColorScheme;
    /**
     * If `true`, the checkbox will be initially checked.
     */
    defaultChecked?: boolean;
    /**
     * If `true`, the checkbox will be disabled.
     */
    disabled?: boolean;
    /**
     * Content to render as helper text.
     */
    helperText?: string;
    /**
     * If `true`, the checkbox will be indeterminate. This only affects the icon shown inside
     * checkbox and does not modify the isChecked property.
     */
    indeterminate?: boolean;
    /**
     * If `true`, the checkbox is marked as invalid. Changes style of unchecked state.
     */
    invalid?: boolean;
    /**
     * The name to use in form submission.
     */
    name?: string;
    /**
     * Callback to invoke when the checked state changes.
     */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /**
     * The checkbox size.
     *
     * @default "md"
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * The value to be used in the checkbox input. This is the value that will be returned on form
     * submission.
     */
    value?: string;
}
/**
 * Typical checkbox component, generally used when a user needs to select multiple values from a
 * list of options.
 */
export declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;

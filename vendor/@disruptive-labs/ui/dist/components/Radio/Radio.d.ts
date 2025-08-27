import React from 'react';
import { BoxProps } from '../Box';
import { ThemeColorScheme } from '../../styles';
export interface RadioProps extends Omit<BoxProps<'input'>, 'size'> {
    /**
     * If `true`, the radio is checked.
     */
    checked?: boolean;
    /**
     * Content to render as a label.
     */
    children?: React.ReactNode;
    /**
     * Class name(s) to override or extend the styles applied to the component.
     */
    className?: string;
    /**
     * The radio color scheme.
     *
     * @default "primary"
     */
    colorScheme?: ThemeColorScheme;
    /**
     * If `true`, the radio will be initially checked.
     */
    defaultChecked?: boolean;
    /**
     * If `true`, the radio will be disabled.
     */
    disabled?: boolean;
    /**
     * If `true`, the radio is marked as invalid. Changes style of unchecked state.
     */
    invalid?: boolean;
    /**
     * The name of the input element.
     */
    name?: string;
    /**
     * Callback to invoke when the checked state changes.
     */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /**
     * The radio size.
     *
     * @default "md"
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * The value to be used in the radio input. This is the value that will be returned on form
     * submission.
     */
    value?: string;
}
/**
 * Typical radio component, generally used when a user needs to select a single value from a
 * list of options.
 */
export declare const Radio: React.ForwardRefExoticComponent<Omit<RadioProps, "ref"> & React.RefAttributes<HTMLInputElement>>;

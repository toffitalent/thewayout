import React from 'react';
import { BoxProps } from '../Box';
import { ThemeColorScheme } from '../../styles';
export interface ToggleProps extends Omit<BoxProps<'input'>, 'size'> {
    /**
     * If `true`, the toggle is checked.
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
     * The toggle color scheme.
     *
     * @default "primary"
     */
    colorScheme?: ThemeColorScheme;
    /**
     * If `true`, the toggle will be initially checked.
     */
    defaultChecked?: boolean;
    /**
     * If `true`, the toggle will be disabled.
     */
    disabled?: boolean;
    /**
     * Content to render as helper text.
     */
    helperText?: string;
    /**
     * If `true`, the toggle is marked as invalid. Changes style of unchecked state.
     */
    invalid?: boolean;
    /**
     * Callback to invoke when the checked state changes.
     */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /**
     * The toggle size.
     *
     * @default "md"
     */
    size?: 'sm' | 'md' | 'lg';
}
/**
 * Toggle is a switch component that is basically a checkbox with a fancier visual design.
 */
export declare const Toggle: React.ForwardRefExoticComponent<Omit<ToggleProps, "ref"> & React.RefAttributes<HTMLInputElement>>;

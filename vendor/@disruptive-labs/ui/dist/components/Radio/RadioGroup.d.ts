import React from 'react';
import type { ThemeColorScheme } from '../../styles';
import { FormControlProps } from '../Form';
import type { RadioProps } from './Radio';
export interface RadioGroupProps extends Omit<FormControlProps, 'children' | 'onChange' | 'ref'> {
    /**
     * `Radio` components to render in the group.
     */
    children: React.ReactElement<RadioProps> | React.ReactElement<RadioProps>[];
    /**
     * The radio color scheme.
     *
     * @default "primary"
     */
    colorScheme?: ThemeColorScheme;
    /**
     * Content to render as helper text.
     */
    helperText?: string;
    /**
     * If `true`, the `Readio` components will be rendered horizontally.
     *
     * @default false
     */
    inline?: boolean;
    /**
     * If `true`, the radios are marked as invalid. Changes style of unchecked state.
     */
    invalid?: boolean;
    /**
     * Content to render as a label.
     */
    label?: React.ReactNode;
    /**
     * The name to use in form submission.
     */
    name?: string;
    /**
     * Callback to invoke when the group selection changes.
     */
    onChange?: (value: string) => void;
    /**
     * The radio size.
     *
     * @default "md"
     */
    size?: RadioProps['size'];
    /**
     * The selected value.
     */
    value?: string;
}
/**
 * RadioGroup renders a set of Radio components and handles the selection of a value.
 */
export declare const RadioGroup: React.ForwardRefExoticComponent<RadioGroupProps & React.RefAttributes<HTMLFieldSetElement>>;

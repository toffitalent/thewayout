import React from 'react';
import { FormControlProps } from '../Form';
import type { ThemeColorScheme } from '../../styles';
import type { CheckboxProps } from './Checkbox';
export interface CheckboxGroupProps extends Omit<FormControlProps, 'children' | 'onChange' | 'ref'> {
    /**
     * `Checkbox` components to render in the group.
     */
    children: React.ReactElement<CheckboxProps> | React.ReactElement<CheckboxProps>[];
    /**
     * The checkboxes color scheme.
     *
     * @default "primary"
     */
    colorScheme?: ThemeColorScheme;
    /**
     * Content to render as helper text.
     */
    helperText?: string;
    /**
     * If `true`, the `Checkbox` components will be rendered horizontally.
     *
     * @default false
     */
    inline?: boolean;
    /**
     * Content to render as a label.
     */
    label?: React.ReactNode;
    /**
     * Callback to invoke when the group selection changes.
     */
    onChange?: (value: string[]) => void;
    /**
     * The checkbox size.
     *
     * @default "md"
     */
    size?: CheckboxProps['size'];
    /**
     * The selected values.
     */
    value?: string[];
}
/**
 * CheckboxGroup renders a set of Checkbox components and handles the selection of multiple values.
 */
export declare const CheckboxGroup: React.ForwardRefExoticComponent<CheckboxGroupProps & React.RefAttributes<HTMLFieldSetElement>>;

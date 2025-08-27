import React from 'react';
import { BoxProps } from '../Box';
import type { ButtonProps } from './Button';
export interface ButtonGroupProps extends BoxProps<'div'> {
    /**
     * `Button` components to render in the group.
     */
    children: React.ReactElement<ButtonProps> | React.ReactElement<ButtonProps>[];
    /**
     * The color scheme of the buttons.
     *
     * @default "primary"
     */
    colorScheme?: ButtonProps['colorScheme'];
    /**
     * The size of the buttons.
     *
     * @default "md"
     */
    size?: ButtonProps['size'];
    /**
     * The display type of the buttons.
     *
     * @default "solid"
     */
    variant?: Exclude<ButtonProps['variant'], 'text'>;
}
/**
 * ButtonGroup renders a group of related buttons (e.g. up/down arrows).
 */
export declare const ButtonGroup: React.ForwardRefExoticComponent<Omit<ButtonGroupProps, "ref"> & React.RefAttributes<HTMLDivElement>>;

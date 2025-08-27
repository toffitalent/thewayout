import React from 'react';
import { SystemProps, ThemeColorScheme } from '../../styles';
import type { PolymorphicComponentProps, PolymorphicForwardRefExoticComponent } from '../types';
export interface ButtonComponentProps extends SystemProps {
    /**
     * Element to show before the button's label.
     */
    accessoryLeft?: React.ReactElement;
    /**
     * Element to show after the button's label.
     */
    accessoryRight?: React.ReactElement;
    /**
     * The content of the component.
     */
    children?: React.ReactNode;
    /**
     * Class name(s) to override or extend the styles applied to the component.
     */
    className?: string;
    /**
     * The color scheme of the button.
     *
     * @default "primary"
     */
    colorScheme?: ThemeColorScheme | 'dark' | 'light' | 'black' | 'white';
    /**
     * If `true`, the button will be disabled.
     *
     * @default false
     */
    disabled?: boolean;
    /**
     * If `true`, the button will take up the full width of its container.
     *
     * @default false
     */
    fluid?: boolean;
    /**
     * If `true`, the button will display a spinner.
     *
     * @default false
     */
    loading?: boolean;
    /**
     * Label/text to show next to spinner when `loading` is true.
     */
    loadingText?: string;
    /**
     * Button size
     *
     * @default "md"
     */
    size?: 'xs' | 'sm' | 'md' | 'lg';
    /**
     * The display type of the button.
     *
     * @default "solid"
     */
    variant?: 'clear' | 'outline' | 'solid' | 'text';
}
export type ButtonBaseProps<C extends React.ElementType = 'button'> = PolymorphicComponentProps<C, ButtonComponentProps>;
export declare const ButtonBase: PolymorphicForwardRefExoticComponent<'button', ButtonComponentProps>;

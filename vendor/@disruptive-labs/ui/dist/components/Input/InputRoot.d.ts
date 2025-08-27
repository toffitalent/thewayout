import React from 'react';
import type { ThemeColorScheme } from '../../styles';
import { BoxProps } from '../Box';
export interface InputRootProps {
    /**
     * Class name(s) to override or extend the styles applied to the component.
     */
    className?: string;
    /**
     * The input color scheme.
     *
     * @default "primary"
     */
    colorScheme?: ThemeColorScheme;
    /**
     * If `true`, the input will be disabled.
     *
     * @default false
     */
    disabled?: boolean;
    /**
     * If `true`, the input will take up the full width of its container.
     *
     * @default false
     */
    fluid?: boolean;
    /**
     * If `true`, the input will have invalid styling.
     *
     * @default false
     */
    invalid?: boolean;
    /**
     * The input size.
     *
     * @default "md"
     */
    size?: 'xs' | 'sm' | 'md' | 'lg';
}
export declare function InputRoot({ children, className, colorScheme, disabled, fluid, invalid, size, ...props }: InputRootProps & BoxProps<'div'>): React.JSX.Element;

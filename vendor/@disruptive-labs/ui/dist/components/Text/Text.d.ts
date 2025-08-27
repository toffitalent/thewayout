import React from 'react';
import type { PolymorphicComponentProps, PolymorphicForwardRefExoticComponent } from '../types';
import type { SystemProps } from '../../styles';
export interface TextComponentProps extends SystemProps {
    /**
     * Defines the text-align style property.
     */
    align?: SystemProps['textAlign'];
    /**
     * Defines the text-transform style property.
     */
    casing?: SystemProps['textTransform'];
    /**
     * Defines the text-decoration style property.
     */
    decoration?: SystemProps['textDecoration'];
    /**
     * If `true`, text will not wrap lines and will show overflow ellipsis.
     */
    noWrap?: boolean;
    /**
     * Truncate text to a specific number of lines.
     */
    numberOfLines?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    /**
     * Defines the font-size style property based on the theme (e.g. h1, s1, p1).
     */
    size?: SystemProps['fontSize'];
    /**
     * Defines the font-weight style property.
     */
    weight?: SystemProps['fontWeight'];
}
export type TextProps<C extends React.ElementType = 'p'> = PolymorphicComponentProps<C, TextComponentProps>;
/**
 * Text is a utility component that composes Box to render text quickly and easily. It renders a
 * `p` tag by default and offers a few additional text-specific styling options compared to Box
 * (e.g. truncating text to a specific number of lines).
 */
export declare const Text: PolymorphicForwardRefExoticComponent<'p', TextComponentProps>;
/**
 * Heading is identical to Text, but it renders an `h2` tag by default.
 */
export declare const Heading: PolymorphicForwardRefExoticComponent<'h2', TextComponentProps>;

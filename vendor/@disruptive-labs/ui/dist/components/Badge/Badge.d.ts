import React from 'react';
import type { ThemeColorScheme } from '../../styles';
import { BoxProps } from '../Box';
export interface BadgeProps extends BoxProps<'div'> {
    /**
     * The content of the component.
     */
    children: React.ReactNode;
    /**
     * The color scheme of the badge.
     *
     * @default "grey"
     */
    colorScheme?: ThemeColorScheme;
    /**
     * The display type of the badge.
     *
     * @default "subtle"
     */
    variant?: 'solid' | 'outline' | 'subtle';
}
/**
 * Badges can be used to display an item's status or tags.
 */
export declare const Badge: React.ForwardRefExoticComponent<Omit<BadgeProps, "ref"> & React.RefAttributes<HTMLDivElement>>;

import React from 'react';
import { BoxProps } from '../Box';
import type { AvatarProps } from './Avatar';
export interface AvatarGroupProps extends BoxProps<'div'> {
    /**
     * `Avatar` components to render in the group.
     */
    children: React.ReactElement<AvatarProps> | React.ReactElement<AvatarProps>[];
    /**
     * Class name(s) to override or extend the styles applied to the excess indicator item.
     */
    excessClassName?: string;
    /**
     * Class name(s) to override or extend the styles applied to the individual Avatar components.
     */
    itemClassName?: string;
    /**
     * The maximum number of Avatars to render in the group.
     */
    max?: number;
    /**
     * Avatar size.
     */
    size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}
/**
 * AvatarGroup provides an easy way to render a group of Avatar components, optionally capped to a
 * maximum number of Avatars with a "+X" rendered at the end.
 */
export declare const AvatarGroup: React.ForwardRefExoticComponent<Omit<AvatarGroupProps, "ref"> & React.RefAttributes<HTMLDivElement>>;

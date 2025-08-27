import React from 'react';
import { BoxProps } from '../Box';
export interface AvatarProps extends BoxProps<'div'> {
    /**
     * Function to get the initials to display.
     */
    getInitials?: (name: string) => string;
    /**
     * The name of the person in the avatar.
     *
     * If `src` is loaded, the name will be used as the `alt` attribute of the `img`.
     * If `src` is not loaded, the name will be used to create the initials.
     */
    name?: string;
    /**
     * Function called when image failed to load.
     */
    onError?: () => void;
    /**
     * Avatar size.
     */
    size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    /**
     * Image url to display.
     */
    src?: string;
}
/**
 * Avatar is a simple user avatar / profile picture component. It can be used to display an image
 * or initials (either intentionally or as a fallback).
 */
export declare const Avatar: React.ForwardRefExoticComponent<Omit<AvatarProps, "ref"> & React.RefAttributes<HTMLDivElement>>;

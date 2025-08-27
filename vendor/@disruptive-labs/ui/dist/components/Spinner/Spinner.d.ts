import React from 'react';
import { BoxProps } from '../Box';
export interface SpinnerProps extends BoxProps<'div'> {
    /**
     * The spinner size.
     *
     * @default "md"
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
/**
 * Spinner is a basic loading spinner with an animation to indicate there is something happening.
 */
export declare const Spinner: React.ForwardRefExoticComponent<Omit<SpinnerProps, "ref"> & React.RefAttributes<HTMLDivElement>>;

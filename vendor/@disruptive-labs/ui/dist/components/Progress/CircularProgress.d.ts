import React from 'react';
import type { ThemeColorScheme } from '../../styles';
import { BoxProps } from '../Box';
export interface CircularProgressProps extends BoxProps<'div'> {
    /**
     * The content of the component.
     */
    children?: React.ReactNode;
    /**
     * The progress circle color scheme.
     *
     * @default "primary"
     */
    colorScheme?: ThemeColorScheme;
    /**
     * The minimum value used to define progress.
     *
     * @default 0
     */
    min?: number;
    /**
     * The maximum value used to define progress.
     *
     * @default 100
     */
    max?: number;
    /**
     * If `true`, line caps will be rounded in the SVG.
     *
     * @default true
     */
    roundedLineCap?: boolean;
    /**
     * The progress circle size.
     *
     * @default "md"
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    /**
     * The thickness of the circle.
     *
     * @default 8
     */
    thickness?: number;
    /**
     * If `true`, a circular track will be rendered behind the progress indicator.
     *
     * @default true
     */
    track?: boolean;
    /**
     * The current progress value (between min and max).
     */
    value: number;
}
/**
 * CircularProgress renders a round progress indicator defined by a partial circle that reflects
 * the percentage progress and an optional full circle track behind.
 */
export declare const CircularProgress: React.ForwardRefExoticComponent<Omit<CircularProgressProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
export interface CircularProgressLabelProps extends BoxProps<'div'> {
    children: React.ReactNode;
}
/**
 * CircularProgressLabel can be used as a child of CircularProgress to render a label within the
 * circle.
 */
export declare const CircularProgressLabel: React.ForwardRefExoticComponent<Omit<CircularProgressLabelProps, "ref"> & React.RefAttributes<HTMLDivElement>>;

import React from 'react';
import type { ThemeColorScheme } from '../../styles';
import { BoxProps } from '../Box';
export interface ProgressProps extends BoxProps<'div'> {
    /**
     * The progress bar color scheme.
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
     * If `true`, line caps will be rounded.
     *
     * @default true
     */
    roundedLineCap?: boolean;
    /**
     * The progress bar size.
     *
     * @default "md"
     */
    size?: 'xs' | 'sm' | 'md' | 'lg';
    /**
     * If `true`, a background track will be rendered behind the progress bar.
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
 * Progress renders a traditional progress bar with optional background track.
 */
export declare const Progress: React.ForwardRefExoticComponent<Omit<ProgressProps, "ref"> & React.RefAttributes<HTMLDivElement>>;

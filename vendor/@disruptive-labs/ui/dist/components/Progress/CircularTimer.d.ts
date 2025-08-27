import React from 'react';
import { CircularProgressProps } from './CircularProgress';
export interface CircularTimerProps extends Omit<CircularProgressProps, 'value'> {
    /**
     * The amount of time it should take for the circle to empty.
     */
    duration: number;
    /**
     * Callback to invoke when the timer duration expires.
     */
    onComplete?: () => void;
}
/**
 * CircularTimer uses CircularProgress to render a circle that starts filled and empties in the
 * specified duration.
 */
export declare const CircularTimer: React.ForwardRefExoticComponent<Omit<CircularTimerProps, "ref"> & React.RefAttributes<HTMLDivElement>>;

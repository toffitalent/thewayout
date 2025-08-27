import React from 'react';
import { BoxProps } from '../Box';
type AlertStatus = 'danger' | 'info' | 'success' | 'warning';
export interface AlertProps extends BoxProps<'div'> {
    /**
     * The content of the component.
     */
    children: React.ReactNode;
    /**
     * Alert status (e.g. danger).
     */
    status: AlertStatus;
}
/**
 * An alert displays an important message in a way that attracts attention without disrupting the
 * task at hand. Alerts are intended to be placed statically within the page, not fixed to the
 * viewport.
 */
export declare const Alert: React.ForwardRefExoticComponent<Omit<AlertProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
export interface AlertTitleProps extends BoxProps<'div'> {
    children: React.ReactNode;
}
/**
 * AlertTitle can be used to add additional important context to an Alert.
 */
export declare const AlertTitle: React.ForwardRefExoticComponent<Omit<AlertTitleProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
export {};

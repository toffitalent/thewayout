import React from 'react';
import type { ToastType } from './types';
export interface ToastItemProps {
    /**
     * Class name(s) to override or extend the styles applied to the component.
     */
    className?: string;
    /**
     * The duration in ms the toast should be visible.
     *
     * @default 5000 (set on `ToastProvider`)
     */
    duration: number;
    /**
     * If `true`, the toast will begin animating out.
     */
    isDismissed?: boolean;
    /**
     * Callback to invoke when dismiss button is clicked.
     */
    onClick?: () => void;
    /**
     * The content of the component.
     */
    text: ToastType['text'];
    /**
     * The toast status (e.g. danger).
     */
    status?: ToastType['status'];
}
export declare function ToastItem({ className, duration, isDismissed, onClick, text, status, }: ToastItemProps): React.JSX.Element;

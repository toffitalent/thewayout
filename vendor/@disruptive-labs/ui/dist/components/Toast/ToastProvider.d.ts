import React from 'react';
import type { ToastType } from './types';
export declare function show(toast: Omit<ToastType, 'id'>): number;
export declare function dismiss(id: number): void;
export declare function dismissAll(): void;
export interface ToastProviderProps {
    /**
     * The default duration in ms to use for toasts that do not specify one.
     *
     * @default 3500
     */
    duration?: number;
}
/**
 * ToastProvider renders the React portal that toasts will be injected into. It should be placed at
 * the root of the application.
 */
export declare function ToastProvider({ duration }: ToastProviderProps): React.ReactPortal | null;

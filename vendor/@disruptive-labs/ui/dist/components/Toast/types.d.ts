import type { ReactNode } from 'react';
export type ToastStatus = 'success' | 'info' | 'warning' | 'danger';
export interface ToastType {
    id: number;
    text: ReactNode | string;
    duration?: number;
    status?: ToastStatus;
}

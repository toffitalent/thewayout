import React from 'react';
import { dismiss, dismissAll, show } from './ToastProvider';
import type { ToastType } from './types';
interface ToastComponent {
    (props: Omit<ToastType, 'id'>): React.ReactElement<any, any> | null;
    dismiss: typeof dismiss;
    dismissAll: typeof dismissAll;
    show: typeof show;
    danger: (text: string, duration?: number) => ReturnType<typeof show>;
    info: (text: string, duration?: number) => ReturnType<typeof show>;
    success: (text: string, duration?: number) => ReturnType<typeof show>;
    warning: (text: string, duration?: number) => ReturnType<typeof show>;
}
/**
 * Toast is used to show alerts to the user on top of other content. They are attached to the
 * viewport and will animate in and out. The toast will close itself when the dismiss button is
 * clicked or after a timeout (the default timeout is 5 seconds).
 *
 * Toasts can be triggered by rendering the `Toast` component in another React component or by
 * using the static `Toast.show()` method.
 *
 * Toasts only show one at a time, so triggering many toasts in rapid succession will cause them to
 * continue to appear one after another for a while.
 */
export declare const Toast: ToastComponent;
export {};

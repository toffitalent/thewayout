import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { usePortal } from '../../hooks';
import { ToastItem } from './ToastItem';
import styles from './ToastProvider.module.scss';
let addToastsHandler;
let removeToastHandler;
let removeAllToastsHandler;
let toastId = 0;
export function show(toast) {
    // eslint-disable-next-line no-plusplus
    const id = toastId++;
    addToastsHandler(Object.assign(Object.assign({}, toast), { id }));
    return id;
}
export function dismiss(id) {
    removeToastHandler(id);
}
export function dismissAll() {
    removeAllToastsHandler();
}
/**
 * ToastProvider renders the React portal that toasts will be injected into. It should be placed at
 * the root of the application.
 */
export function ToastProvider({ duration = 3500 }) {
    const [dismissed, setDismissed] = useState(false);
    const [toasts, setToasts] = useState([]);
    const active = useRef();
    const portal = usePortal();
    const timer = useRef();
    const dismissToast = (id) => {
        var _a;
        if (((_a = active.current) === null || _a === void 0 ? void 0 : _a.id) === id) {
            clearTimeout(timer.current);
            setDismissed(true);
            timer.current = setTimeout(() => {
                setDismissed(false);
                setToasts((toastsState) => toastsState.filter((t) => t.id !== id));
            }, 300);
        }
        else {
            setToasts((toastsState) => toastsState.filter((t) => t.id !== id));
        }
    };
    useEffect(() => {
        const [toast] = toasts;
        if (toast && active.current !== toast) {
            clearTimeout(timer.current);
            active.current = toast;
            timer.current = setTimeout(() => dismissToast(toast.id), toasts[0].duration || duration);
        }
    }, [duration, toasts]);
    // NOTE: This is a bit of a hack. We're exposing the "public" API for showing toasts here by
    // simply exporting functions that interact with the component's state. This could be
    // refactored into a separate module that emits events if more complex functionality is needed
    addToastsHandler = (toast) => {
        setToasts((toastsState) => [...toastsState, toast]);
    };
    removeToastHandler = (id) => {
        dismissToast(id);
    };
    removeAllToastsHandler = () => {
        clearTimeout(timer.current);
        setDismissed(true);
        timer.current = setTimeout(() => {
            setDismissed(false);
            setToasts([]);
        }, 300);
    };
    const [toast] = toasts;
    return portal
        ? ReactDOM.createPortal(React.createElement("div", { className: styles.container, "aria-live": "polite" }, toast && (React.createElement(ToastItem, { key: toast.id, duration: toast.duration || duration, isDismissed: dismissed, status: toast.status, text: toast.text, onClick: () => removeToastHandler(toast.id) }))), portal)
        : null;
}

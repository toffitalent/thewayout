import React from 'react';
import { ReactRef } from '../../utils';
export declare const useAriaHidden: (ref: React.RefObject<HTMLElement>, shouldHide: boolean) => void;
export interface UseModalProps {
    /**
     * If `true`, the modal will be open (models are controlled).
     */
    isOpen: boolean;
    /**
     * If `true`, focus will be transferred to the first focusable element when the modal opens.
     *
     * @default true
     */
    autoFocus?: boolean;
    /**
     * If `true`, the modal will close when focused and the `Esc` key is pressed.
     *
     * @default true
     */
    closeOnEsc?: boolean;
    /**
     * If `true`, the modal will close when the overlay is clicked.
     *
     * @default true
     */
    closeOnOverlayClick?: boolean;
    /**
     * Callback fired when the modal closes.
     */
    onClose(): void;
    /**
     * Callback fired when the modal is focused and the `Esc` key is pressed.
     */
    onEsc?(): void;
    /**
     * Callback fired when the overlay is clicked.
     */
    onOverlayClick?(): void;
    /**
     * If `true`, the siblings of the modal will have `aria-hidden` attributes set to true such that
     * screen readers will only see the modal element.
     *
     * @default true
     */
    useInert?: boolean;
}
export declare const useModal: ({ autoFocus, closeOnEsc, closeOnOverlayClick, isOpen, onClose, onEsc, onOverlayClick, useInert, }: UseModalProps) => {
    getBodyProps: <T extends HTMLElement>(props?: React.HTMLProps<T>, ref?: ReactRef<T>) => React.HTMLProps<T>;
    getModalProps: <T_1 extends HTMLElement>(props?: React.HTMLProps<T_1>, ref?: ReactRef<T_1>) => React.HTMLProps<T_1>;
    getOverlayProps: <T_2 extends HTMLElement>(props?: React.HTMLProps<T_2>, ref?: ReactRef<T_2>) => React.HTMLProps<T_2>;
    getTitleProps: <T_3 extends HTMLElement>(props?: React.HTMLProps<T_3>, ref?: ReactRef<T_3>) => React.HTMLProps<T_3>;
    modalRef: React.RefObject<HTMLElement>;
    isOpen: boolean;
    onClose: () => void;
    overlayRef: React.RefObject<HTMLElement>;
};

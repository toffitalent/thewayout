import React from 'react';
import type { ModalComponentProps } from './Modal';
export declare const ModalContext: React.Context<{
    getBodyProps: <T extends HTMLElement>(props?: React.HTMLProps<T>, ref?: import("../..").ReactRef<T>) => React.HTMLProps<T>;
    getModalProps: <T_1 extends HTMLElement>(props?: React.HTMLProps<T_1>, ref?: import("../..").ReactRef<T_1>) => React.HTMLProps<T_1>;
    getOverlayProps: <T_2 extends HTMLElement>(props?: React.HTMLProps<T_2>, ref?: import("../..").ReactRef<T_2>) => React.HTMLProps<T_2>;
    getTitleProps: <T_3 extends HTMLElement>(props?: React.HTMLProps<T_3>, ref?: import("../..").ReactRef<T_3>) => React.HTMLProps<T_3>;
    modalRef: React.RefObject<HTMLElement>;
    isOpen: boolean;
    onClose: () => void;
    overlayRef: React.RefObject<HTMLElement>;
} & ModalComponentProps>;
export declare const useModalContext: () => {
    getBodyProps: <T extends HTMLElement>(props?: React.HTMLProps<T>, ref?: import("../..").ReactRef<T>) => React.HTMLProps<T>;
    getModalProps: <T_1 extends HTMLElement>(props?: React.HTMLProps<T_1>, ref?: import("../..").ReactRef<T_1>) => React.HTMLProps<T_1>;
    getOverlayProps: <T_2 extends HTMLElement>(props?: React.HTMLProps<T_2>, ref?: import("../..").ReactRef<T_2>) => React.HTMLProps<T_2>;
    getTitleProps: <T_3 extends HTMLElement>(props?: React.HTMLProps<T_3>, ref?: import("../..").ReactRef<T_3>) => React.HTMLProps<T_3>;
    modalRef: React.RefObject<HTMLElement>;
    isOpen: boolean;
    onClose: () => void;
    overlayRef: React.RefObject<HTMLElement>;
} & ModalComponentProps;

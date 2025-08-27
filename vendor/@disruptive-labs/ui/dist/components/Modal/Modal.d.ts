import React from 'react';
import { BoxProps } from '../Box';
import { IconButtonProps } from '../Button';
import { FocusLockProps } from './FocusLock';
import { UseModalProps } from './useModal';
export interface ModalComponentProps {
    /**
     * If `true`, focus will be transferred to the first focusable element when the modal opens.
     *
     * @default true
     */
    autoFocus?: boolean;
    /**
     * If `true`, scrolling of the document body will be disabled using overflow: hidden.
     * Additionally, padding will be applied to the body element to compensate for the scrollbar.
     *
     * @default true
     */
    blockScroll?: boolean;
    /**
     * A ref of the element to which focus should be returned when the modal closes.
     */
    finalFocusRef?: FocusLockProps['finalFocusRef'];
    /**
     * A ref of the element to which focus should be transferred initially. If not provided, the
     * first focusable element within the modal will be focused if autoFocus is `true`.
     */
    initialFocusRef?: FocusLockProps['initialFocusRef'];
    /**
     * If `true`, the modal will be vertically centered. DO NOT use if the modal content will
     * overflow the height of the viewport or content will be cut off.
     *
     * @default false
     */
    isCentered?: boolean;
    /**
     * If `true`, focus is kept within the modal, even in an iframe. If `false`, focus is allowed to
     * move outside an iframe.
     *
     * @default true
     */
    lockFocusAcrossFrames?: FocusLockProps['lockFocusAcrossFrames'];
    /**
     * If `true`, focus will be returned to the element that triggered the the modal when it closes.
     *
     * @default true
     */
    returnFocusOnClose?: boolean;
    /**
     * Size of the modal (applies max-width)
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    /**
     * If `true`, focus will be "trapped" within the modal, preventing users from tabbing away or
     * otherwise moving focus outside the modal container.
     *
     * Note: Disabling may result in accessibility issues.
     *
     * @default true
     */
    trapFocus?: boolean;
}
export interface ModalProps extends ModalComponentProps, UseModalProps {
    children: React.ReactNode;
}
/**
 * Modal is an accessible dialog window that is presented over the other content in the viewport.
 * For accessibility, other content behind the modal is inert and scrolling is blocked so that
 * users cannot interact with it and screen readers focus on the dialog alone while it is open.
 * Focus is also managed intelligently, initially focusing the first interactive element (or a
 * specific element if desired), and focus is trapped within the modal until it closes.
 *
 * The Modal component itself is just a wrapper that renders a React portal, attached to the
 * document body, and provides relevant context to other Modal-related components.
 */
export declare function Modal({ children, autoFocus, blockScroll, finalFocusRef, initialFocusRef, isCentered, lockFocusAcrossFrames, returnFocusOnClose, size, trapFocus, ...props }: ModalProps): React.ReactPortal | null;
export interface ModalContentProps extends BoxProps<'div'> {
    rootProps?: React.HTMLAttributes<HTMLDivElement>;
}
/**
 * ModalContent is the container inside which Modal components and the content should be rendered.
 * It is wrapped by a div, to which styles and handlers for managing "outside clicks" are applied.
 */
export declare const ModalContent: React.ForwardRefExoticComponent<Omit<ModalContentProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
/**
 * ModalOverlay is a utility component for dimming the content behind the modal. It should be
 * rendered as a sibling of ModalContent.
 */
export declare const ModalOverlay: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
/**
 * ModalTitle renders the modal's title and automatically sets the aria-labelledby attribute on the
 * modal for proper accessibility.
 *
 * Note: When not using ModalTitle, be sure to add an aria-label prop to ModalContent for
 * accessibility.
 */
export declare const ModalTitle: React.ForwardRefExoticComponent<Omit<BoxProps<"header">, "ref"> & React.RefAttributes<HTMLDivElement>>;
/**
 * ModalBody is a simple wrapper around the content of the modal, which automatically sets the
 * aria-describedby attribute on the modal.
 */
export declare const ModalBody: React.ForwardRefExoticComponent<Omit<BoxProps<"div">, "ref"> & React.RefAttributes<HTMLDivElement>>;
/**
 * ModalFooter renders its children separated from ModalBody and is designed to make it quicker to
 * add actions to the end of the modal.
 */
export declare const ModalFooter: React.ForwardRefExoticComponent<Omit<BoxProps<"footer">, "ref"> & React.RefAttributes<HTMLDivElement>>;
/**
 * ModalCloseButton composes an IconButton with an "X" icon that will call the `onClose` Modal prop
 * by default.
 */
export declare const ModalCloseButton: React.ForwardRefExoticComponent<Omit<IconButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;

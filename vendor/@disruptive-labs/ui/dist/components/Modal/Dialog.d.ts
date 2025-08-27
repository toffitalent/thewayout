import React from 'react';
import { ModalContentProps, ModalProps } from './Modal';
export interface DialogProps extends Omit<ModalProps, 'initialFocusRef'> {
    /**
     * A ref of the element to which focus should be transferred initially. If not provided, the
     * first focusable element within the modal will be focused if autoFocus is `true`. Functionally,
     * this is the same as `initialFocusRef` on Modal, but in the case of a dialog, the least
     * destructive action should be focused initially to prevent accidental destructive actions.
     */
    leastDestructiveRef?: ModalProps['initialFocusRef'];
}
/**
 * Dialog is a customized modal intended for alerts that require a users attention and interaction.
 * Compared with a default Modal, the role is overridden to be an "alertdialog" as opposed to a
 * "dialog", and Dialog optionally (but recommended) expects a `leastDestructiveRef` prop to ensure
 * the initially focused element does not perform a destructive action.
 */
export declare function Dialog({ leastDestructiveRef, ...props }: DialogProps): React.JSX.Element;
export declare const DialogContent: React.ForwardRefExoticComponent<Omit<ModalContentProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
export { ModalBody as DialogBody, ModalCloseButton as DialogCloseButton, ModalFooter as DialogFooter, ModalOverlay as DialogOverlay, ModalTitle as DialogTitle, } from './Modal';

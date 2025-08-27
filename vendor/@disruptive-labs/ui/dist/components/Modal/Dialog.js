var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from 'react';
import { Modal, ModalContent } from './Modal';
/**
 * Dialog is a customized modal intended for alerts that require a users attention and interaction.
 * Compared with a default Modal, the role is overridden to be an "alertdialog" as opposed to a
 * "dialog", and Dialog optionally (but recommended) expects a `leastDestructiveRef` prop to ensure
 * the initially focused element does not perform a destructive action.
 */
export function Dialog(_a) {
    var { leastDestructiveRef } = _a, props = __rest(_a, ["leastDestructiveRef"]);
    return React.createElement(Modal, Object.assign({}, props, { initialFocusRef: leastDestructiveRef }));
}
export const DialogContent = React.forwardRef((props, ref) => (React.createElement(ModalContent, Object.assign({ ref: ref, role: "alertdialog" }, props))));
export { ModalBody as DialogBody, ModalCloseButton as DialogCloseButton, ModalFooter as DialogFooter, ModalOverlay as DialogOverlay, ModalTitle as DialogTitle, } from './Modal';

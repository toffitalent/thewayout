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
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { Box } from '../../components/Box';
import { IconButton } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { FocusLock, useModal } from '../../components/Modal';
import { usePortal } from '../../hooks';
import { classNames } from '../../utils';
import styles from './Sidebar.module.scss';
/**
 * Sidebar is an accessible navigation component (intended to be used with SidebarLayout) that
 * that renders a left-bar style navigation menu, which collapses into a navbar and overlay on
 * mobile.
 */
export const Sidebar = React.forwardRef(({ autoClose = true, children, className, colorScheme = 'grey', logo, mobileCloseButton = React.createElement(SidebarCloseButton, null), mobileOpenButton = React.createElement(SidebarOpenButton, null), }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const onClose = useCallback(() => setIsOpen(false), []);
    const onOpen = useCallback(() => setIsOpen(true), []);
    const mobileRef = useRef(null);
    const openButtonRef = useRef(null);
    const pageUrl = useRef(typeof window !== 'undefined' ? window.location.href : '');
    useImperativeHandle(ref, () => ({
        close: onClose,
        open: onOpen,
    }), [onClose, onOpen]);
    const portal = usePortal();
    const modal = useModal({
        isOpen,
        onClose,
    });
    useEffect(() => {
        isOpen
            ? document.body.classList.add(styles.lockScroll)
            : document.body.classList.remove(styles.lockScroll);
    }, [isOpen]);
    const handleClick = useCallback(() => {
        if (autoClose) {
            const interval = setInterval(() => {
                const currentUrl = window.location.href;
                if (currentUrl !== pageUrl.current) {
                    clearInterval(interval);
                    pageUrl.current = currentUrl;
                    onClose();
                }
            }, 10);
            setTimeout(() => {
                clearInterval(interval);
            }, 500);
        }
    }, [autoClose, onClose]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: classNames(styles.sidebar, styles[colorScheme], className) },
            React.createElement("div", { className: styles.navbar },
                React.cloneElement(mobileOpenButton, {
                    'aria-haspopup': 'dialog',
                    onClick: onOpen,
                    ref: openButtonRef,
                }),
                logo && React.createElement("div", { className: styles.logo }, logo)),
            React.createElement("nav", { className: styles.sidebarNav },
                logo && React.createElement("div", { className: styles.logo }, logo),
                children)),
        portal
            ? ReactDOM.createPortal(isOpen ? (React.createElement(FocusLock, { autoFocus: true, contentRef: modal.modalRef, finalFocusRef: openButtonRef, lockFocusAcrossFrames: true, restoreFocus: true },
                React.createElement(CSSTransition, { nodeRef: mobileRef, in: isOpen, appear: true, timeout: 300, classNames: styles },
                    React.createElement("div", Object.assign({}, modal.getOverlayProps(undefined, mobileRef), { className: classNames(styles.mobile, isOpen && styles.open) }),
                        React.createElement("div", Object.assign({}, modal.getModalProps({ onClick: handleClick }), { className: classNames(styles.mobileContainer, styles[colorScheme], className) }),
                            React.createElement("nav", null,
                                logo && React.createElement("div", { className: styles.logo }, logo),
                                children),
                            React.createElement("div", { className: styles.mobileClose }, React.cloneElement(mobileCloseButton, {
                                onClick: onClose,
                            }))),
                        React.createElement("div", { className: styles.overlay }))))) : null, portal)
            : null));
});
/**
 * SidebarSection wraps and groups a set of SidebarItem components and should be a direct child of
 * the Sidebar component. The `separated` prop can also be used to add a bottom-affixed section.
 */
export const SidebarSection = React.forwardRef((_a, ref) => {
    var { children, className, separated = false } = _a, props = __rest(_a, ["children", "className", "separated"]);
    return (React.createElement(Box, Object.assign({}, props, { as: "div", className: classNames(styles.section, separated && styles.sectionSeparated, className), ref: ref }),
        React.createElement("ul", { className: styles.sectionList }, children)));
});
/**
 * SidebarItem represents an individual item on the sidebar. By default, it renders a list item
 * containing a span, but the span can be easily overridden using the `wrapper` prop in order to
 * render an anchor, custom Link, or other component. The accessory props can be used to add icons,
 * badges, menus, or other elements to the sidebar items.
 */
export function SidebarItem(_a) {
    var { accessoryLeft, accessoryRight, active = false, children, className, wrapper, wrapperProps } = _a, props = __rest(_a, ["accessoryLeft", "accessoryRight", "active", "children", "className", "wrapper", "wrapperProps"]);
    const Wrapper = wrapper || 'span';
    return (React.createElement(Box, Object.assign({}, props, { as: "li", className: classNames(styles.item, active && styles.itemActive, className) }),
        React.createElement(Wrapper, Object.assign({}, wrapperProps, { className: classNames(styles.itemWrapper, wrapperProps === null || wrapperProps === void 0 ? void 0 : wrapperProps.className) }),
            accessoryLeft && React.createElement("span", { className: styles.itemAccessory }, accessoryLeft),
            children,
            accessoryRight && (React.createElement("span", { className: classNames(styles.itemAccessory, styles.itemAccessoryRight) }, accessoryRight)))));
}
/**
 * SidebarBadge is a simple pre-styled badge for use as an accessory with SidebarItem when a badge
 * is necessary (e.g. an unread messages count).
 */
export const SidebarBadge = React.forwardRef((_a, ref) => {
    var { children, className } = _a, props = __rest(_a, ["children", "className"]);
    return (React.createElement(Box, Object.assign({}, props, { as: "div", className: classNames(styles.badge, className), ref: ref }), children));
});
/**
 * SidebarCloseButton wraps an IconButton and is used as the default close button for the mobile
 * sidebar.
 */
export const SidebarCloseButton = React.forwardRef((props, ref) => (React.createElement(IconButton, Object.assign({ "aria-label": "Close sidebar navigation", colorScheme: "white", fontSize: "2xl", size: "sm", variant: "clear" }, props, { ref: ref }),
    React.createElement(Icon, null,
        React.createElement("path", { d: "M6 18L18 6M6 6l12 12" })))));
/**
 * SidebarOpenButton wraps an IconButton and is used as the default open/menu button for the mobile
 */
export const SidebarOpenButton = React.forwardRef((props, ref) => (React.createElement(IconButton, Object.assign({ "aria-label": "Open sidebar navigation", colorScheme: "grey", fontSize: "2xl", size: "sm", variant: "clear" }, props, { ref: ref }),
    React.createElement(Icon, null,
        React.createElement("path", { d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" })))));

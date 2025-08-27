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
import classNames from 'classnames';
import React from 'react';
import { Box } from '../Box';
import styles from './SkipNav.module.scss';
/**
 * SkipNavContent and SkipNavLink work together to provide a skip navigation link for screen reader
 * and keyboard users. Generally, the main content of the page is not the first thing in the
 * document, so it's valuable to provide a shortcut for keyboard and screen reader users to skip to
 * the content, rather than requiring them to tab through the (many) links in the navbar.
 *
 * If the user does not navigate with the keyboard, they won't see the link.
 */
export const SkipNavLink = React.forwardRef((_a, ref) => {
    var { as, children, className, contentId = 'skip-nav' } = _a, props = __rest(_a, ["as", "children", "className", "contentId"]);
    return (React.createElement(Box, Object.assign({ href: `#${contentId}` }, props, { as: as || 'a', className: classNames(styles.skipNav, className), ref: ref }), children));
});
export const SkipNavContent = React.forwardRef((_a, ref) => {
    var { as, id = 'skip-nav' } = _a, props = __rest(_a, ["as", "id"]);
    const Component = as || 'div';
    return React.createElement(Component, Object.assign({ id: id }, props, { ref: ref }));
});

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
import styles from './Content.module.scss';
/**
 * Container renders a width-limited responsive content container.
 */
export const Container = React.forwardRef((_a, ref) => {
    var { as, children, className } = _a, props = __rest(_a, ["as", "children", "className"]);
    return (React.createElement(Box, Object.assign({ as: as || 'div' }, props, { className: classNames(styles.container, className), ref: ref }), children));
});
/**
 * Content composes the Box component and adds the option to wrap children in a Container (e.g.
 * `<Content as="section" container>{content}</Content>`).
 */
export const Content = React.forwardRef((_a, ref) => {
    var { children, container = false } = _a, props = __rest(_a, ["children", "container"]);
    return (React.createElement(Box, Object.assign({}, props, { ref: ref }), container ? React.createElement(Container, null, children) : children));
});

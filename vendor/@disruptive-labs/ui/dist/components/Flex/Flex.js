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
import styles from './Flex.module.scss';
/**
 * Flex is a responsive grid layout component that adapts to screen size and orientation. It
 * follows a standard 12-column layout structure, allowing the number of columns at each
 * responsive breakpoint to be specified.
 */
export const Flex = React.forwardRef((_a, ref) => {
    var { as, className, container = false, direction, grow, item = false, justify, shrink, spacing, wrap, xs = false, sm = false, md = false, lg = false, xl = false, '2xl': xxl = false } = _a, props = __rest(_a, ["as", "className", "container", "direction", "grow", "item", "justify", "shrink", "spacing", "wrap", "xs", "sm", "md", "lg", "xl", '2xl']);
    return (React.createElement(Box, Object.assign({ as: as || 'div', flexDirection: direction, flexGrow: grow, flexShrink: shrink, flexWrap: wrap, justifyContent: justify }, props, { className: classNames(className, {
            [styles.container]: container,
            [styles.item]: item,
            [styles[`spacing-${String(spacing).replace(/\./g, '-')}`]]: !!spacing,
            [styles[`bp-xs-${xs}`]]: !!xs,
            [styles[`bp-sm-${sm}`]]: !!sm,
            [styles[`bp-md-${md}`]]: !!md,
            [styles[`bp-lg-${lg}`]]: !!lg,
            [styles[`bp-xl-${xl}`]]: !!xl,
            [styles[`bp-2xl-${xxl}`]]: !!xxl,
        }), ref: ref })));
});

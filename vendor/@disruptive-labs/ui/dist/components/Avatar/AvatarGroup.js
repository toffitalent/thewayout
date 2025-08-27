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
import styles from './AvatarGroup.module.scss';
/**
 * AvatarGroup provides an easy way to render a group of Avatar components, optionally capped to a
 * maximum number of Avatars with a "+X" rendered at the end.
 */
export const AvatarGroup = React.forwardRef((_a, ref) => {
    var { children, className, excessClassName, itemClassName, max, size } = _a, props = __rest(_a, ["children", "className", "excessClassName", "itemClassName", "max", "size"]);
    const validChildren = React.Children.toArray(children).filter((child) => React.isValidElement(child));
    const avatars = max ? validChildren.slice(0, max) : validChildren;
    const excess = (!!max && validChildren.length - max) || 0;
    return (React.createElement(Box, Object.assign({ as: "div", role: "group" }, props, { className: classNames(styles.group, size && styles[`s-${size}`], className), ref: ref }),
        excess > 0 && (React.createElement("span", { className: classNames(styles.excess, excessClassName) }, `+${excess}`)),
        avatars.reverse().map((avatar) => React.cloneElement(avatar, {
            className: classNames(styles.item, itemClassName),
            size,
        }))));
});

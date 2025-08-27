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
import { useImage } from '../../hooks';
import { Box } from '../Box';
import styles from './Avatar.module.scss';
const defaultGetInitials = (name) => {
    const [firstName, lastName] = name.split(' ');
    return firstName && lastName
        ? `${firstName.charAt(0)}${lastName.charAt(0)}`
        : firstName.charAt(0);
};
/**
 * Avatar is a simple user avatar / profile picture component. It can be used to display an image
 * or initials (either intentionally or as a fallback).
 */
export const Avatar = React.forwardRef((_a, ref) => {
    var { className, getInitials = defaultGetInitials, name, size, src } = _a, props = __rest(_a, ["className", "getInitials", "name", "size", "src"]);
    const image = useImage({ src });
    const showFallback = !src || (src && image !== 'loaded');
    return (React.createElement(Box, Object.assign({ as: "div" }, props, { className: classNames(styles.avatar, size && styles[`s-${size}`], className), ref: ref }), showFallback ? (React.createElement("div", { "aria-label": name, className: styles.initials }, name ? getInitials(name) : null)) : (React.createElement("img", { src: src, alt: name, className: styles.image }))));
});

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
import styles from './Text.module.scss';
/**
 * Text is a utility component that composes Box to render text quickly and easily. It renders a
 * `p` tag by default and offers a few additional text-specific styling options compared to Box
 * (e.g. truncating text to a specific number of lines).
 */
export const Text = React.forwardRef((_a, ref) => {
    var { as, align, casing, className, decoration, noWrap = false, numberOfLines, size, weight } = _a, props = __rest(_a, ["as", "align", "casing", "className", "decoration", "noWrap", "numberOfLines", "size", "weight"]);
    return (React.createElement(Box, Object.assign({ fontSize: size, fontWeight: weight, textAlign: align, textDecoration: decoration, textTransform: casing }, props, { as: as || 'p', className: classNames(styles.text, {
            [styles.noWrap]: !!noWrap,
            [styles[`numLines-${numberOfLines}`]]: !!numberOfLines,
        }, className), ref: ref })));
});
/**
 * Heading is identical to Text, but it renders an `h2` tag by default.
 */
export const Heading = React.forwardRef((_a, ref) => {
    var { as } = _a, props = __rest(_a, ["as"]);
    return (React.createElement(Text, Object.assign({ as: as || 'h2' }, props, { ref: ref })));
});

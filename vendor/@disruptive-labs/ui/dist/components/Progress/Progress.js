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
import styles from './Progress.module.scss';
/**
 * Progress renders a traditional progress bar with optional background track.
 */
export const Progress = React.forwardRef((_a, ref) => {
    var { className, colorScheme = 'primary', min = 0, max = 100, roundedLineCap = true, size = 'md', track = true, value } = _a, props = __rest(_a, ["className", "colorScheme", "min", "max", "roundedLineCap", "size", "track", "value"]);
    const progress = Math.min(1, Math.max(0, value / (max - min))) * 100;
    return (React.createElement(Box, Object.assign({}, props, { as: "div", className: classNames(styles.progress, styles[size], {
            [styles.rounded]: roundedLineCap,
            [styles.trackColor]: track,
        }, className), role: "progressbar", "aria-valuemax": max, "aria-valuemin": min, "aria-valuenow": value, ref: ref }),
        React.createElement(Box, { bgcolor: colorScheme, className: styles.track, style: { transform: `translateX(${(100 - progress) * -1}%)` } })));
});

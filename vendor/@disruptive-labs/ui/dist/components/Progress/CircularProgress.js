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
import styles from './CircularProgress.module.scss';
/**
 * CircularProgress renders a round progress indicator defined by a partial circle that reflects
 * the percentage progress and an optional full circle track behind.
 */
export const CircularProgress = React.forwardRef((_a, ref) => {
    var { className, children, colorScheme = 'primary', min = 0, max = 100, roundedLineCap = true, size = 'md', thickness = 8, track = true, value } = _a, props = __rest(_a, ["className", "children", "colorScheme", "min", "max", "roundedLineCap", "size", "thickness", "track", "value"]);
    const progress = Math.min(1, Math.max(0, value / (max - min))) * 100;
    return (React.createElement(Box, Object.assign({ role: "progressbar" }, props, { as: "div", className: classNames(styles.progress, styles[colorScheme], styles[size], className), "aria-valuemax": max, "aria-valuemin": min, "aria-valuenow": value, ref: ref }),
        React.createElement("svg", { viewBox: "0 0 100 100" },
            React.createElement("circle", { cx: 50, cy: 50, r: 42, fill: "transparent", strokeWidth: thickness, className: classNames(styles.track, { [styles.trackColor]: track }) }),
            React.createElement("circle", { cx: 50, cy: 50, r: 42, fill: "transparent", strokeWidth: thickness, strokeLinecap: roundedLineCap ? 'round' : undefined, strokeDashoffset: 66, strokeDasharray: `${progress * 2.64} ${264 - progress * 2.64}`, className: styles.indicator })),
        children));
});
/**
 * CircularProgressLabel can be used as a child of CircularProgress to render a label within the
 * circle.
 */
export const CircularProgressLabel = React.forwardRef((_a, ref) => {
    var { children } = _a, props = __rest(_a, ["children"]);
    return (React.createElement(Box, Object.assign({}, props, { as: "div", className: classNames(styles.label, props.className), ref: ref }), children));
});

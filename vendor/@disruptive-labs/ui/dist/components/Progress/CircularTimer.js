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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CircularProgress } from './CircularProgress';
import styles from './CircularTimer.module.scss';
/**
 * CircularTimer uses CircularProgress to render a circle that starts filled and empties in the
 * specified duration.
 */
export const CircularTimer = React.forwardRef((_a, ref) => {
    var { className, duration, onComplete } = _a, props = __rest(_a, ["className", "duration", "onComplete"]);
    const [elapsed, setElapsed] = useState(0);
    const request = useRef();
    const startedAt = useRef(Date.now());
    const animate = useCallback(() => {
        const elapsedTime = Date.now() - startedAt.current;
        setElapsed(elapsedTime);
        if (elapsedTime >= duration) {
            onComplete === null || onComplete === void 0 ? void 0 : onComplete();
        }
        else {
            request.current = requestAnimationFrame(animate);
        }
    }, [duration, onComplete]);
    useEffect(() => {
        request.current = requestAnimationFrame(animate);
        return () => {
            request.current && cancelAnimationFrame(request.current);
        };
    }, [animate]);
    return (React.createElement(CircularProgress, Object.assign({}, props, { className: classNames(styles.timer, className), min: 0, max: 1, ref: ref, value: Math.max(0, (duration - elapsed) / duration) })));
});

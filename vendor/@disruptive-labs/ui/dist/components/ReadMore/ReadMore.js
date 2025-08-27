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
import React, { useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '../../hooks';
import { isFunction } from '../../utils';
import { Box } from '../Box';
import { Button } from '../Button';
import { Text } from '../Text';
import styles from './ReadMore.module.scss';
export const ReadMore = React.forwardRef((_a, ref) => {
    var { buttonClassName, buttonRef, buttonText = 'Read More', children, className, inline, numberOfLines = 3 } = _a, props = __rest(_a, ["buttonClassName", "buttonRef", "buttonText", "children", "className", "inline", "numberOfLines"]);
    const [hasOverflow, setHasOverflow] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const contentRef = useRef(null);
    useIsomorphicLayoutEffect(() => {
        var _a, _b, _c, _d;
        setHasOverflow(((_b = (_a = contentRef.current) === null || _a === void 0 ? void 0 : _a.offsetHeight) !== null && _b !== void 0 ? _b : 0) < ((_d = (_c = contentRef.current) === null || _c === void 0 ? void 0 : _c.scrollHeight) !== null && _d !== void 0 ? _d : 0));
    }, []);
    return (React.createElement(Box, Object.assign({}, props, { as: "div", className: classNames(styles.readMore, inline && styles.inline, className), ref: ref }),
        isFunction(children) ? (children({ contentRef, isExpanded })) : (React.createElement(Text, { numberOfLines: isExpanded ? undefined : numberOfLines, ref: contentRef, whiteSpace: "pre-line" }, children)),
        hasOverflow && !isExpanded && (React.createElement("div", { className: styles.footer },
            React.createElement(Button, { className: classNames(styles.button, buttonClassName), colorScheme: "primary", onClick: () => setIsExpanded(true), ref: buttonRef, variant: "text" }, buttonText)))));
});

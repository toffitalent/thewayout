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
import { Button, ButtonLink } from './Button';
import styles from './IconButton.module.scss';
const createIconButtonComponent = (Component) => React.forwardRef((_a, ref) => {
    var { className, round = true, size = 'md' } = _a, props = __rest(_a, ["className", "round", "size"]);
    return (React.createElement(Component, Object.assign({}, props, { size: size, className: classNames(styles.iconButton, styles[size], { [styles.round]: round }, className), ref: ref })));
});
/**
 * IconButton renders a `Button` component, expecting only an `Icon` as a child. It is recommended
 * to set ARIA attributes on the component for users that may need assistance understanding the
 * function of the IconButton.
 */
export const IconButton = createIconButtonComponent(Button);
export const IconButtonLink = createIconButtonComponent(ButtonLink);

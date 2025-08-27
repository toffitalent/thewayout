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
import React from 'react';
import { ButtonBase } from './ButtonBase';
/**
 * Buttons are used for a wide variety of actions and events, e.g. submitting forms or navigating
 * to a different page.
 *
 * Note: The `Button` component is configured to render an HTML button element. Use `ButtonLink` to
 * render an HTML anchor tag or `ButtonBase` to render custom elements with the features and styles
 * of a button.
 */
export const Button = React.forwardRef((_a, ref) => {
    var { disabled = false, loading = false, type = 'button' } = _a, props = __rest(_a, ["disabled", "loading", "type"]);
    return (React.createElement(ButtonBase, Object.assign({}, props, { as: "button", loading: loading, disabled: disabled || loading, type: type, ref: ref })));
});
export const ButtonLink = React.forwardRef((props, ref) => (React.createElement(ButtonBase, Object.assign({}, props, { as: "a", ref: ref }))));

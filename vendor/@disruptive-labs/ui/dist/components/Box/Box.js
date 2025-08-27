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
import { useSx } from '../../styles';
/**
 * Box provides a low-level polymorphic component for other components to compose, or to be used
 * directly in layouts. Box accepts all system styling props to make styling components and
 * creating layouts simpler.
 */
export const Box = React.forwardRef((_a, ref) => {
    var { as } = _a, inProps = __rest(_a, ["as"]);
    const Component = as || 'div';
    const props = useSx(inProps);
    return React.createElement(Component, Object.assign({ ref: ref }, props));
});

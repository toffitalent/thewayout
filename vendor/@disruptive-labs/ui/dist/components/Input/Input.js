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
import React, { useId } from 'react';
import { getProps } from '../../styles';
import { FormControl, FormHelperText, FormLabel } from '../Form';
import { InputBase } from './InputBase';
/**
 * Input renders a text field where users can enter and edit text.
 */
export const Input = React.forwardRef((_a, ref) => {
    var { helperText, label } = _a, props = __rest(_a, ["helperText", "label"]);
    const id = useId();
    const _b = getProps(props), { sx } = _b, rest = __rest(_b, ["sx"]);
    return (React.createElement(FormControl, { sx: sx },
        label && React.createElement(FormLabel, { htmlFor: id }, label),
        React.createElement(InputBase, Object.assign({}, rest, { id: id, ref: ref, "aria-describedby": helperText ? `${id}-helptext` : undefined })),
        helperText && (React.createElement(FormHelperText, { id: `${id}-helptext`, invalid: props.invalid, "aria-live": "polite" }, helperText))));
});

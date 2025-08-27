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
import { useCombobox as useDownshift, } from 'downshift';
import { useId } from 'react';
import { useCallbackRef } from '../../hooks';
import { mergeRefs } from '../../utils';
import { usePopper } from '../Popper';
export const useCombobox = (_a) => {
    var { options } = _a, props = __rest(_a, ["options"]);
    const id = useId();
    const [label, labelRef] = useCallbackRef();
    const { closeMenu, getInputProps, getItemProps, getLabelProps, getMenuProps, getToggleButtonProps, highlightedIndex, inputValue, isOpen, openMenu, reset, selectedItem, selectItem, setHighlightedIndex, setInputValue, toggleMenu, } = useDownshift(Object.assign(Object.assign({}, props), { id }));
    const { getPopperProps, getReferenceProps } = usePopper({
        gutter: 5,
        matchWidth: true,
        placement: 'bottom-start',
    });
    return {
        closeMenu,
        getComboboxProps: (attrs) => getReferenceProps(attrs),
        getInputProps,
        getItemProps,
        getLabelProps: (attrs) => getLabelProps(Object.assign(Object.assign({}, attrs), { ref: mergeRefs(attrs === null || attrs === void 0 ? void 0 : attrs.ref, labelRef) })),
        getMenuProps,
        getPopperProps,
        getToggleButtonProps,
        highlightedIndex,
        inputValue,
        isOpen,
        items: props.items,
        itemToString: props.itemToString || ((item) => String(item)),
        hasLabel: !!label,
        openMenu,
        options,
        reset,
        selectedItem,
        selectItem,
        setHighlightedIndex,
        setInputValue,
        toggleMenu,
    };
};

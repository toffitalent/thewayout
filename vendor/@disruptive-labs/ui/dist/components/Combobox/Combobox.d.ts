import React from 'react';
import { MaybeRenderProp } from '../../utils';
import { BoxProps } from '../Box';
import { IconButtonProps } from '../Button';
import { FormLabelProps } from '../Form';
import { IconProps } from '../Icon';
import { InputBaseProps } from '../Input';
import { UseComboboxProps } from './useCombobox';
export interface ComboboxProps<Item = any> extends Omit<UseComboboxProps<Item>, 'items'>, Omit<BoxProps<'div'>, 'children'> {
    /**
     * Combobox children. Can be render function.
     */
    children?: MaybeRenderProp<{
        isOpen: boolean;
        items: Item[];
    }>;
    /**
     * Items to display in menu if controlled behavior desired.
     */
    items?: Item[];
    /**
     * Array of options to use for autocompletion/suggestion.
     */
    options: Item[];
}
/**
 * Combobox is an accessible autocomplete/combobox implementation that uses Popper and Downshift to
 * display options to users and handle option selection using the keyboard or mouse.
 *
 * The Combobox component renders the container and required context for the other Combobox-related
 * components. ComboboxInput and ComboboxMenu must be among the children.
 */
export declare const Combobox: <Item extends unknown>({ children, items: itemsProp, options, ...props }: ComboboxProps<Item>) => JSX.Element;
/**
 * ComboboxLabel adds an HTML label and related ARIA attributes to the Combobox input. If omitted,
 * an `aria-label` attribute should be added to ComboboxInput for proper accessibility.
 */
export declare const ComboboxLabel: React.ForwardRefExoticComponent<Omit<FormLabelProps, "ref"> & React.RefAttributes<HTMLLabelElement>>;
export type ComboboxInputProps = Omit<InputBaseProps, 'multiline' | 'rows'>;
/**
 * ComboboxInput renders the text input component of the Combobox and also provides the reference
 * element for Popper to position the options menu.
 */
export declare const ComboboxInput: React.ForwardRefExoticComponent<Omit<ComboboxInputProps, "ref"> & React.RefAttributes<HTMLInputElement>>;
export interface ComboboxButtonProps extends IconButtonProps {
    children?: React.ReactElement<IconProps>;
}
/**
 * ComboboxButton composes IconButton, allowing overriding of the icon displayed. It should be
 * rendered as an accessory of ComboboxInput and is automatically wired up to toggle the menu.
 */
export declare const ComboboxButton: React.ForwardRefExoticComponent<Omit<ComboboxButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;
export interface ComboboxItemProps<Item = any> extends BoxProps<'li'> {
    children: React.ReactText;
    index?: number;
    isHighlighted?: boolean;
    item: Item;
}
/**
 * ComboboxItem renders a list item element and applies the props/refs required for Downshift to
 * manage items and selection.
 */
export declare const ComboboxItem: React.ForwardRefExoticComponent<Omit<ComboboxItemProps<any>, "ref"> & React.RefAttributes<HTMLLIElement>>;
/**
 * ComboboxGroup wraps a selection of ComboboxItem components in a group with an optional title.
 * This can be useful for separating items in the menu into logical groups.
 */
export declare const ComboboxGroup: React.ForwardRefExoticComponent<Omit<BoxProps<"li">, "ref"> & React.RefAttributes<HTMLLIElement>>;
interface ComboboxMenuRenderProps<Item = any> {
    isOpen: boolean;
    items: Item[];
    itemToString: (item: Item) => string;
}
export interface ComboboxMenuProps<Item = any> extends Omit<BoxProps<'ul'>, 'children'> {
    children?: MaybeRenderProp<ComboboxMenuRenderProps<Item>>;
}
/**
 * ComboboxMenu renders the options list of the combobox and is positioned relative to the
 * ComboboxInput element using Popper. By default, it will render the array of items as an array of
 * ComboboxItem components. Pass children (or a render function) to customize the appearance or
 * rendering of the combobox menu.
 */
export declare const ComboboxMenu: React.ForwardRefExoticComponent<Omit<ComboboxMenuProps<any>, "ref"> & React.RefAttributes<HTMLUListElement>>;
export {};

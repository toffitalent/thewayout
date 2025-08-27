import React from 'react';
import { MaybeRenderProp } from '../../utils';
import { ButtonProps } from '../Button';
import { UseMenuProps } from './useMenu';
import { BoxProps } from '../Box';
export interface MenuProps extends UseMenuProps {
    /**
     * Menu children. Can be render function.
     */
    children?: MaybeRenderProp<{
        forceUpdate?: () => void;
        isOpen: boolean;
        onClose: () => void;
    }>;
}
/**
 * Menu is an accessible dropdown menu implementation built on the Popover component. Menu attempts
 * to manage focus intelligently, applying focus to a menu item when the menu opens and moving it
 * up and down through the list of items using keyboard navigation.
 *
 * Similar to the Popover component, the Menu component itself is just a wrapper and context
 * provider for the other Menu-related components (e.g. MenuButton, MenuList, MenuItem).
 */
export declare function Menu({ children, ...props }: MenuProps): React.JSX.Element;
/**
 * MenuTrigger wraps a clickable trigger element (for example a button) and attaches event
 * handlers and attributes to wire up the Menu functionality and handle accessibility.
 */
export declare function MenuTrigger({ children }: {
    children: React.ReactNode;
}): React.DetailedReactHTMLElement<React.HTMLProps<HTMLElement>, HTMLElement>;
/**
 * MenuButton is a Button component wrapped by a MenuTrigger. As such, it's already wired up and
 * ready. Supplied props are passed to the button for customization. MenuTrigger should be used for
 * more complex situations or situations where the trigger component should not be a Button.
 */
export declare function MenuButton(props: ButtonProps): React.JSX.Element;
export interface MenuListProps extends BoxProps<'div'> {
    rootProps?: React.HTMLAttributes<HTMLDivElement>;
}
/**
 * MenuList wraps the actual list of items to display in the menu and has role="menu" applied
 * automatically. It contains a wrapper div, to which Popper.js applies positioning styles, and a
 * container div for the menu items, which can be customized though supplied props.
 */
export declare const MenuList: React.ForwardRefExoticComponent<Omit<MenuListProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
export interface MenuItemProps extends Omit<ButtonProps, 'variant'> {
    closeOnSelect?: boolean;
}
/**
 * MenuItem represents an individual interact-able menu item. It wraps a minimally-styled Button
 * component, so it accepts Button props for customization (e.g. left/right accessories).
 */
export declare const MenuItem: React.ForwardRefExoticComponent<Omit<MenuItemProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;
/**
 * MenuGroup can optionally be used to separate certain MenuItems from others and wrap them in a
 * role="group" component. It also accepts an optional title that will be rendered within the
 * group.
 */
export declare const MenuGroup: React.ForwardRefExoticComponent<Omit<BoxProps<"div">, "ref"> & React.RefAttributes<HTMLDivElement>>;

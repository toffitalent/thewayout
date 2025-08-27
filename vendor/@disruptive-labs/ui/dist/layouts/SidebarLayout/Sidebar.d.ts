import React from 'react';
import { BoxProps } from '../../components/Box';
import { IconButtonProps } from '../../components/Button';
import { PropsOf } from '../../components/types';
export interface SidebarMethods {
    /**
     * Close sidebar dialog (mobile).
     */
    close(): void;
    /**
     * Open sidebar dialog (mobile).
     */
    open(): void;
}
export interface SidebarProps {
    /**
     * Whether to automatically close the mobile sidebar on URL changes.
     *
     * @default true
     */
    autoClose?: boolean;
    /**
     * SidebarSection components to render in the Sidebar.
     */
    children?: React.ReactElement<SidebarSectionProps> | React.ReactElement<SidebarSectionProps>[];
    /**
     * Class name(s) to override or extend the styles applied to the component.
     */
    className?: string;
    /**
     * The color scheme of the sidebar.
     *
     * @default "grey"
     */
    colorScheme?: 'grey' | 'light' | 'dark';
    /**
     * A logo component (e.g. <img />) to render at the top of the sidebar and next to the menu
     * button on mobile.
     */
    logo?: React.ReactNode;
    /**
     * A button component for mobile to render as the menu button that opens the sidebar.
     *
     * @default <SidebarCloseButton />
     */
    mobileCloseButton?: React.ReactElement;
    /**
     * A button component for mobile to render as the menu button that opens the sidebar.
     *
     * @default <SidebarOpenButton />
     */
    mobileOpenButton?: React.ReactElement;
}
/**
 * Sidebar is an accessible navigation component (intended to be used with SidebarLayout) that
 * that renders a left-bar style navigation menu, which collapses into a navbar and overlay on
 * mobile.
 */
export declare const Sidebar: React.ForwardRefExoticComponent<SidebarProps & React.RefAttributes<SidebarMethods>>;
export interface SidebarSectionProps extends BoxProps<'div'> {
    /**
     * SidebarItem components to render within the section.
     */
    children: React.ReactElement<SidebarItemProps> | React.ReactElement<SidebarItemProps>[];
    /**
     * Whether this section should be pushed to the bottom (margin-top: auto).
     */
    separated?: boolean;
}
/**
 * SidebarSection wraps and groups a set of SidebarItem components and should be a direct child of
 * the Sidebar component. The `separated` prop can also be used to add a bottom-affixed section.
 */
export declare const SidebarSection: React.ForwardRefExoticComponent<Omit<SidebarSectionProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
export interface SidebarItemProps<WrapperElement extends React.ElementType = 'span'> extends Omit<BoxProps<'li'>, 'as'> {
    /**
     * Element to show before the item's label (e.g. Icon).
     */
    accessoryLeft?: React.ReactNode;
    /**
     * Element to show after the item's label (e.g. SidebarBad or Menu).
     */
    accessoryRight?: React.ReactNode;
    /**
     * Whether this item is active and highlighted.
     */
    active?: boolean;
    /**
     * String label for the item.
     */
    children: string;
    /**
     * Wrapper element to use within the item (useful to change to an anchor or Link).
     *
     * @default "span"
     */
    wrapper?: WrapperElement;
    /**
     * Additional props to pass to the wrapper element.
     */
    wrapperProps?: PropsOf<WrapperElement>;
}
/**
 * SidebarItem represents an individual item on the sidebar. By default, it renders a list item
 * containing a span, but the span can be easily overridden using the `wrapper` prop in order to
 * render an anchor, custom Link, or other component. The accessory props can be used to add icons,
 * badges, menus, or other elements to the sidebar items.
 */
export declare function SidebarItem<WrapperElement extends React.ElementType = 'span'>({ accessoryLeft, accessoryRight, active, children, className, wrapper, wrapperProps, ...props }: SidebarItemProps<WrapperElement>): React.JSX.Element;
export interface SidebarBadgeProps extends BoxProps<'div'> {
    /**
     * Content to render within the badge (e.g. a number).
     */
    children: React.ReactNode;
}
/**
 * SidebarBadge is a simple pre-styled badge for use as an accessory with SidebarItem when a badge
 * is necessary (e.g. an unread messages count).
 */
export declare const SidebarBadge: React.ForwardRefExoticComponent<Omit<SidebarBadgeProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
export type SidebarButtonProps = Omit<IconButtonProps, 'children'>;
/**
 * SidebarCloseButton wraps an IconButton and is used as the default close button for the mobile
 * sidebar.
 */
export declare const SidebarCloseButton: React.ForwardRefExoticComponent<Omit<SidebarButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;
/**
 * SidebarOpenButton wraps an IconButton and is used as the default open/menu button for the mobile
 */
export declare const SidebarOpenButton: React.ForwardRefExoticComponent<Omit<SidebarButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;

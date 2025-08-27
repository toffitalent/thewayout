import React from 'react';
import { BoxProps } from '../Box';
import type { IconProps } from '../Icon';
import { UseTabsProps } from './useTabs';
export interface TabsProps extends UseTabsProps {
    /**
     * The TabList and TabPanel elements to render.
     */
    children?: React.ReactElement<TabListProps | TabPanelProps>[];
}
/**
 * Tabs is an accessible tab-based layout implementation that renders content based on the selected
 * tab and falls back to a more-manageable Select component on mobile by default.
 */
export declare const Tabs: ({ children, ...props }: TabsProps) => JSX.Element;
export interface TabListProps extends BoxProps<'div'> {
    /**
     * The Tab elements to render in the list.
     */
    children?: React.ReactElement<TabProps>[];
    /**
     * Whether to render a Select on mobile to avoid wrapping tabs.
     *
     * @default true
     */
    showSelectOnMobile?: boolean;
    /**
     * The display type of the tabs.
     *
     * @default "default"
     */
    variant?: 'default' | 'solid';
}
/**
 * TabList wraps the actual list of tabs and applies accessibility-related props. By default, it
 * will fall back to a Select component on mobile to avoid/minimize tabs wrapping.
 */
export declare const TabList: React.ForwardRefExoticComponent<Omit<TabListProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
export interface TabProps extends BoxProps<'button'> {
    /**
     * The string label for the tab button.
     */
    children: string;
    /**
     * Icon element to show before the tab label.
     */
    icon?: React.ReactElement<IconProps>;
    /**
     * ID of the tab to match with associated TabPanel.
     */
    id: string;
}
/**
 * Tab represents an individual tab item and is linked to a related TabPanel component via the
 * required "id" prop. It renders an HTML button component with attached accessibility
 * attributes and handlers for changing the selected tab.
 */
export declare const Tab: React.ForwardRefExoticComponent<Omit<TabProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;
export interface TabPanelProps extends BoxProps<'div'> {
    /**
     * The content to render when the tab is active.
     */
    children?: React.ReactNode;
    /**
     * ID that matches the `id` prop of a Tab button.
     */
    id: string;
}
/**
 * TabPanel wraps the content of a specific tab and is linked to a related Tab component by the
 * required "id" prop.
 *
 * Note: Only the content of the selected tab will be rendered currently, meaning that state will
 * be lost as components unmount and remounted when changing tabs.
 */
export declare const TabPanel: React.ForwardRefExoticComponent<Omit<TabPanelProps, "ref"> & React.RefAttributes<HTMLDivElement>>;

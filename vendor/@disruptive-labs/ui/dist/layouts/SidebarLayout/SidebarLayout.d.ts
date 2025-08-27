import React from 'react';
import { SidebarProps } from './Sidebar';
export interface SidebarLayoutProps {
    /**
     * Content to render in the main part of the layout.
     */
    children?: React.ReactNode;
    /**
     * Class name(s) to override or extend the styles applied to the main content container.
     */
    className?: string;
    /**
     * Sidebar component to render for navigation.
     */
    sidebar: React.ReactElement<SidebarProps>;
    /**
     * Link text to use for SkipNav component. Set to empty string or null to disable SkipNav.
     *
     * @default "Skip to content"
     */
    skipNavLink?: string | null;
}
/**
 * SidebarLayout provides a full page layout with a Sidebar component providing navigation and
 * children rendered as the main content of the page.
 */
export declare function SidebarLayout({ children, className, sidebar, skipNavLink, }: SidebarLayoutProps): React.JSX.Element;

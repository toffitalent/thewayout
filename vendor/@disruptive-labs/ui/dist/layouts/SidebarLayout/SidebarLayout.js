import React from 'react';
import { SkipNavContent, SkipNavLink } from '../../components';
import { classNames } from '../../utils';
import styles from './SidebarLayout.module.scss';
/**
 * SidebarLayout provides a full page layout with a Sidebar component providing navigation and
 * children rendered as the main content of the page.
 */
export function SidebarLayout({ children, className, sidebar, skipNavLink = 'Skip to content', }) {
    return (React.createElement(React.Fragment, null,
        skipNavLink && React.createElement(SkipNavLink, null, skipNavLink),
        sidebar,
        skipNavLink && React.createElement(SkipNavContent, null),
        React.createElement("main", { className: classNames(styles.content, className) }, children)));
}

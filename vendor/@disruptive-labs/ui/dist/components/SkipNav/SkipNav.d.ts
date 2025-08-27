import React from 'react';
import type { SystemProps } from '../../styles';
import type { PolymorphicComponentProps, PolymorphicForwardRefExoticComponent } from '../types';
export interface SkipNavLinkComponentProps extends SystemProps {
    /**
     * Content to render in link (e.g. "Skip to content")
     */
    children: React.ReactNode;
    /**
     * Element ID for href attribute
     *
     * @default "skip-nav"
     */
    contentId?: string;
}
export type SkipNavLinkProps<C extends React.ElementType = 'a'> = PolymorphicComponentProps<C, SkipNavLinkComponentProps>;
/**
 * SkipNavContent and SkipNavLink work together to provide a skip navigation link for screen reader
 * and keyboard users. Generally, the main content of the page is not the first thing in the
 * document, so it's valuable to provide a shortcut for keyboard and screen reader users to skip to
 * the content, rather than requiring them to tab through the (many) links in the navbar.
 *
 * If the user does not navigate with the keyboard, they won't see the link.
 */
export declare const SkipNavLink: PolymorphicForwardRefExoticComponent<'a', SkipNavLinkComponentProps>;
export type SkipNavContentProps<C extends React.ElementType = 'div'> = PolymorphicComponentProps<C>;
export declare const SkipNavContent: PolymorphicForwardRefExoticComponent<'div', unknown>;

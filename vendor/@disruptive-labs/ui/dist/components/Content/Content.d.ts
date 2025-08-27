import React from 'react';
import type { SystemProps } from '../../styles';
import type { PolymorphicComponentProps, PolymorphicForwardRefExoticComponent } from '../types';
/**
 * Container renders a width-limited responsive content container.
 */
export declare const Container: PolymorphicForwardRefExoticComponent<'div', SystemProps>;
export interface ContentComponentProps extends SystemProps {
    /**
     * The content of the component.
     */
    children?: React.ReactNode;
    /**
     * If `true`, the content will be wrapped in a `Container` component.
     *
     * @default false
     */
    container?: boolean;
}
export type ContentProps<C extends React.ElementType = 'div'> = PolymorphicComponentProps<C, ContentComponentProps>;
/**
 * Content composes the Box component and adds the option to wrap children in a Container (e.g.
 * `<Content as="section" container>{content}</Content>`).
 */
export declare const Content: PolymorphicForwardRefExoticComponent<'div', ContentComponentProps>;

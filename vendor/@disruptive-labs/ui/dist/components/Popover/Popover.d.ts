import React from 'react';
import type { SystemProps } from '../../styles';
import { MaybeRenderProp } from '../../utils';
import { PolymorphicComponentProps, PolymorphicForwardRefExoticComponent } from '../types';
import { UsePopoverProps } from './usePopover';
export interface PopoverProps extends UsePopoverProps {
    /**
     * Popover children. Can be render function.
     */
    children?: MaybeRenderProp<{
        forceUpdate?: () => void;
        isOpen: boolean;
        onClose: () => void;
    }>;
}
/**
 * Popover is a dialog that renders and repositions relative to a trigger element. It can contain
 * any number of useful contextual pieces of information for the user to read or interact with.
 * The Popover component itself is just the wrapper and context provider for the other Popover-
 * related components (e.g. PopoverTrigger, PopoverContent).
 */
export declare function Popover({ children, gutter, ...props }: PopoverProps): React.JSX.Element;
/**
 * PopoverTrigger wraps a clickable trigger element (for example a button) and attaches event
 * handlers and attributes to wire up the Popover functionality and handle accessibility.
 */
export declare function PopoverTrigger({ children }: {
    children: React.ReactNode;
}): React.DetailedReactHTMLElement<React.HTMLProps<HTMLElement>, HTMLElement>;
export interface PopoverContentComponentProps extends SystemProps {
    rootProps?: React.HTMLAttributes<HTMLDivElement>;
}
export type PopoverContentProps<C extends React.ElementType = 'div'> = PolymorphicComponentProps<C, PopoverContentComponentProps>;
/**
 * PopoverContent is the container inside which the actual Popover content should be rendered. It
 * is wrapped by a div, to which Popper.js applies positioning styles. The content container itself
 * currently has minimal styling applied and can be easily configured.
 */
export declare const PopoverContent: PolymorphicForwardRefExoticComponent<'div', PopoverContentProps>;
/**
 * PopoverArrow adds an arrow between the popover content and it's trigger/reference element. It is
 * optional and can be simply omitted to not render an arrow. Popper.js will apply styles to
 * position the arrow appropriately based on the popover position.
 */
export declare function PopoverArrow({ className, ...props }: React.HTMLProps<HTMLDivElement>): React.JSX.Element;

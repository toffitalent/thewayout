import React from 'react';
import { SystemProps, ThemeColorScheme } from '../../styles';
import { BoxProps } from '../Box';
import { IconProps } from '../Icon';
import { PolymorphicComponentProps, PolymorphicForwardRefExoticComponent } from '../types';
export interface TagComponentProps extends SystemProps {
    /**
     * The content of the tag label.
     */
    children?: React.ReactNode;
    /**
     * The color scheme of the tag.
     *
     * @default "primary"
     */
    colorScheme?: ThemeColorScheme | 'black' | 'white';
    /**
     * Tag size.
     *
     * @default "md"
     */
    size?: 'xs' | 'sm' | 'md' | 'lg';
    /**
     * The display type of the tag.
     *
     * @default "outline"
     */
    variant?: 'outline' | 'solid';
}
export type TagProps<C extends React.ElementType = 'span'> = PolymorphicComponentProps<C, TagComponentProps>;
/**
 * Tags (or Chips) can be used to display an item's status or tags. Compared to the Badge
 * component, Tag renders slightly differently and supports internal buttons and icons.
 */
export declare const Tag: PolymorphicForwardRefExoticComponent<'span', TagComponentProps>;
/**
 * TagLabel wraps the text content of the Tag, particularly when using TagButton or TagIcon
 * components. For basic usage, `<Tag>Label</Tag>` works just fine. But TagLabel will automatically
 * add spacing to when using other Tag-related children.
 */
export declare const TagLabel: React.ForwardRefExoticComponent<Omit<BoxProps<"span">, "ref"> & React.RefAttributes<HTMLSpanElement>>;
/**
 * TagIcon wraps an <Icon /> component and applies styles to ensure it renders appropriately within
 * the Tag.
 */
export declare const TagIcon: React.ForwardRefExoticComponent<{
    children: React.ReactElement<IconProps>;
} & React.RefAttributes<SVGSVGElement>>;
export interface TagButtonProps extends BoxProps<'button'> {
    children: React.ReactElement<IconProps>;
    showBorder?: boolean;
}
/**
 * TagButton renders an HTML button and expects an <Icon /> child. Apply an aria-label attribute
 * for proper accessibility.
 */
export declare const TagButton: React.ForwardRefExoticComponent<Omit<TagButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;

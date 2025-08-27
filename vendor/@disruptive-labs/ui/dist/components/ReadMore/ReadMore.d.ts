import React from 'react';
import { MaybeRenderProp } from '../../utils';
import { BoxProps } from '../Box';
import { TextProps } from '../Text';
export interface ReadMoreRenderProp {
    contentRef: React.RefObject<HTMLParagraphElement>;
    isExpanded: boolean;
}
export interface ReadMoreProps extends Omit<BoxProps<'div'>, 'children'> {
    /**
     * Class name(s) to override or extend the styles applied to the button.
     */
    buttonClassName?: string;
    /**
     * Ref to pass to the button element.
     */
    buttonRef?: React.Ref<HTMLButtonElement>;
    /**
     * The text content/label of the "Read More" button.
     */
    buttonText?: string;
    /**
     * The text content of to clamp/expand. Can be render function.
     */
    children: MaybeRenderProp<ReadMoreRenderProp>;
    /**
     * If `true`, the button will be displayed inline with last line of text.
     */
    inline?: boolean;
    /**
     * Number of lines to show before expanding.
     */
    numberOfLines?: TextProps['numberOfLines'];
}
export declare const ReadMore: React.ForwardRefExoticComponent<Omit<ReadMoreProps, "ref"> & React.RefAttributes<HTMLDivElement>>;

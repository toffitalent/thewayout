import React from 'react';
import { SystemProps, ThemeSpacing } from '../../styles';
import type { PolymorphicComponentProps, PolymorphicForwardRefExoticComponent } from '../types';
type FlexItemSize = false | 'auto' | true | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export interface FlexComponentProps extends SystemProps {
    /**
     * Class name(s) to override or extend the styles applied to the component.
     */
    className?: string;
    /**
     * If `true`, the component will have flex *container* behavior. *Items* should be wrapped with a
     * *container*.
     */
    container?: boolean;
    /**
     * Defines the flex-direction style property for all screen sizes.
     */
    direction?: SystemProps['flexDirection'];
    /**
     * Defines the flex-grow style property for all screen sizes (flex-grow: 0 or 1)
     *
     * NOTE: This property may cause issues with the responsive props
     */
    grow?: SystemProps['flexGrow'];
    /**
     * If `true`, the component will have flex *item* behavior. *Items* should be wrapped with a
     * *container*.
     */
    item?: boolean;
    /**
     * Defines the justify-content style property for all screen sizes.
     */
    justify?: SystemProps['justifyContent'];
    /**
     * Defines the flex-shrink style property for all screen sizes (flex-shrink: 0 or 1)
     *
     * NOTE: This property may cause issues with the responsive props
     */
    shrink?: SystemProps['flexShrink'];
    /**
     * Defines the space between the *item* components. It can only be used on a *container*
     * components.
     *
     * By default, spacing works in increments of 0.5rem (5px), e.g. `spacing={4}` has 2rem between
     * items.
     */
    spacing?: ThemeSpacing;
    /**
     * Defines the flex-wrap style property for all screen sizes.
     */
    wrap?: SystemProps['flexWrap'];
    /**
     * Defines the number of grids the component is going to use. It's applied for all screen sizes
     * with the lowest priority.
     */
    xs?: FlexItemSize;
    /**
     * Defines the number of grids the component is going to use. It's applied for the sm breakpoint
     * and wider screens if not overridden.
     */
    sm?: FlexItemSize;
    /**
     * Defines the number of grids the component is going to use. It's applied for the md breakpoint
     * and wider screens if not overridden.
     */
    md?: FlexItemSize;
    /**
     * Defines the number of grids the component is going to use. It's applied for the lg breakpoint
     * and wider screens if not overridden.
     */
    lg?: FlexItemSize;
    /**
     * Defines the number of grids the component is going to use. It's applied for the xl breakpoint
     * and wider screens.
     */
    xl?: FlexItemSize;
    /**
     * Defines the number of grids the component is going to use. It's applied for the 2xl breakpoint
     * and wider screens.
     */
    '2xl'?: FlexItemSize;
}
export type FlexProps<C extends React.ElementType = 'div'> = PolymorphicComponentProps<C, FlexComponentProps>;
/**
 * Flex is a responsive grid layout component that adapts to screen size and orientation. It
 * follows a standard 12-column layout structure, allowing the number of columns at each
 * responsive breakpoint to be specified.
 */
export declare const Flex: PolymorphicForwardRefExoticComponent<'div', FlexComponentProps>;
export {};

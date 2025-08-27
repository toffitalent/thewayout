import type { ThemeLayout, ThemeSpacing } from './types';
type LayoutSpacing = ThemeSpacing | ThemeLayout;
export interface LayoutStyleProps {
    /**
     * Defines the display style property
     */
    display?: 'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'none';
    /**
     * Defines the height style property
     */
    height?: LayoutSpacing | 'auto' | 'screen';
    /**
     * Defines the max-height style property
     */
    maxHeight?: LayoutSpacing;
    /**
     * Defines the max-width style property
     */
    maxWidth?: LayoutSpacing | 'none' | 'max' | 'min';
    /**
     * Defines the min-height style property
     */
    minHeight?: LayoutSpacing | 'max' | 'min';
    /**
     * Defines the min-width style property
     */
    minWidth?: LayoutSpacing;
    /**
     * Defines the overflow style property
     */
    overflow?: 'auto' | 'hidden' | 'visible';
    /**
     * Defines the width style property
     */
    width?: LayoutSpacing | 'auto' | 'screen';
    /**
     * Defines the visibility style property
     */
    visibility?: 'hidden' | 'visible';
}
export declare const layout: ({
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "display";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "overflow";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "visibility";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "width";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "height";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "maxWidth";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "maxHeight";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "minWidth";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "minHeight";
})[];
export {};

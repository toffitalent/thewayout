import type { ThemeColor } from './types';
export interface BorderStyleProps {
    /**
     * Defines the border style property
     */
    border?: true | 0 | 1;
    /**
     * Defines the border-top style property
     */
    borderTop?: true | 0 | 1;
    /**
     * Defines the border-right style property
     */
    borderRight?: true | 0 | 1;
    /**
     * Defines the border-bottom style property
     */
    borderBottom?: true | 0 | 1;
    /**
     * Defines the border-left style property
     */
    borderLeft?: true | 0 | 1;
    /**
     * Defines the border color property
     */
    borderColor?: ThemeColor | 'transparent';
    /**
     * Defines the border-width style property.
     */
    borderWidth?: true | 0 | 1;
    /**
     * Defines the border-radius style property.
     */
    rounded?: true | 0 | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}
export declare const borders: ({
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "border";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "borderTop";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "borderRight";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "borderBottom";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "borderLeft";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "borderColor";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "borderWidth";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "rounded";
})[];

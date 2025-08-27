import type { ThemeSpacing } from './types';
export interface SpacingStyleProps {
    /**
     * Defines the margin style property.
     */
    m?: ThemeSpacing;
    /**
     * Defines the margin-left and margin-right style properties.
     */
    mh?: ThemeSpacing | 'auto';
    /**
     * Defines the margin-top and margin-bottom style properties.
     */
    mv?: ThemeSpacing;
    /**
     * Defines the margin-top style property.
     */
    mt?: ThemeSpacing;
    /**
     * Defines the margin-right style property.
     */
    mr?: ThemeSpacing | 'auto';
    /**
     * Defines the margin-bottom style property.
     */
    mb?: ThemeSpacing;
    /**
     * Defines the margin-left style property.
     */
    ml?: ThemeSpacing | 'auto';
    /**
     * Defines the padding style property.
     */
    p?: ThemeSpacing;
    /**
     * Defines the padding-left and padding-right style properties.
     */
    ph?: ThemeSpacing;
    /**
     * Defines the padding-top and padding-bottom style properties.
     */
    pv?: ThemeSpacing;
    /**
     * Defines the padding-top style property.
     */
    pt?: ThemeSpacing;
    /**
     * Defines the padding-right style property.
     */
    pr?: ThemeSpacing;
    /**
     * Defines the padding-bottom style property.
     */
    pb?: ThemeSpacing;
    /**
     * Defines the padding-left style property.
     */
    pl?: ThemeSpacing;
}
export declare const spacing: ({
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "m";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "mh";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "mv";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "mt";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "mr";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "mb";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "ml";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "p";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "ph";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "pv";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "pt";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "pr";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "pb";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "pl";
})[];

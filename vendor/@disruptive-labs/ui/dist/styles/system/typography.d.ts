import type { ThemeFont, ThemeFontSize, ThemeFontWeight } from './types';
export interface TypographyStyleProps {
    /**
     * Defines the font size and weight based on the theme (e.g. h1, s1, p1).
     */
    f?: ThemeFont;
    /**
     * Defines the font size based on the theme (e.g. h1, s1, p1).
     */
    fontSize?: ThemeFontSize;
    /**
     * Defines the fontWeight style property.
     */
    fontWeight?: ThemeFontWeight;
    /**
     * Defines the lineHeight style property.
     */
    lineHeight?: 'default' | 'heading' | 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
    /**
     * Defines the text-align style property.
     */
    textAlign?: 'center' | 'left' | 'right' | 'justify';
    /**
     * Defines the text-decoration style property.
     */
    textDecoration?: 'line-through' | 'underline' | 'none';
    /**
     * Defines the text-transform style property.
     */
    textTransform?: 'capitalize' | 'lowercase' | 'uppercase' | 'none';
    /**
     * Defines the white-space style property.
     */
    whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces';
}
export declare const typography: ({
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    /**
     * Defines the white-space style property.
     */
    prop: "f";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    /**
     * Defines the white-space style property.
     */
    prop: "fontSize";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    /**
     * Defines the white-space style property.
     */
    prop: "fontWeight";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    /**
     * Defines the white-space style property.
     */
    prop: "lineHeight";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    /**
     * Defines the white-space style property.
     */
    prop: "textAlign";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    /**
     * Defines the white-space style property.
     */
    prop: "textDecoration";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    /**
     * Defines the white-space style property.
     */
    prop: "textTransform";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    /**
     * Defines the white-space style property.
     */
    prop: "whiteSpace";
})[];

import { ThemeLayout } from '.';
type FlexAlign = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
type FlexValue = 0 | 1 | 2 | 3 | 4;
export interface FlexStyleProps {
    /**
     * Defines the align-content style property.
     */
    alignContent?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'space-between' | 'space-around';
    /**
     * Defines the align-items style property.
     */
    alignItems?: FlexAlign;
    /**
     * Defines the align-self style property.
     */
    alignSelf?: FlexAlign | 'auto';
    /**
     * Defines the flex style property.
     */
    flex?: FlexValue;
    /**
     * Defines the flex-basis style property.
     */
    flexBasis?: ThemeLayout | 0 | 'auto';
    /**
     * Defines the flex-direction style property.
     */
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    /**
     * Defines the flex-grow style property.
     */
    flexGrow?: FlexValue;
    /**
     * Defines the flex-shrink style property.
     */
    flexShrink?: FlexValue;
    /**
     * Defines the flex-wrap style property.
     */
    flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
    /**
     * Defines the justify-content style property.
     */
    justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
}
export declare const flex: ({
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "alignContent";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "alignItems";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "alignSelf";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "flex";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "flexBasis";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "flexDirection";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "flexGrow";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "flexShrink";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "flexWrap";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "justifyContent";
})[];
export {};

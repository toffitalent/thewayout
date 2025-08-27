import type { ThemeColor } from './types';
export interface ColorStyleProps {
    /**
     * Defines the background-color style property.
     */
    bgcolor?: ThemeColor | 'transparent';
    /**
     * Defines the color style property.
     */
    color?: ThemeColor | 'transparent';
}
export declare const colors: ({
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "bgcolor";
} | {
    (props: import("./types").StyleProps): Record<string, string> | undefined;
    prop: "color";
})[];

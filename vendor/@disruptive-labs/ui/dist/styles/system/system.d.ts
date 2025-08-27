import type { StyleProps, SystemProps } from './types';
export declare const system: Record<keyof StyleProps, {
    (props: StyleProps): Record<string, string> | undefined;
    prop: keyof StyleProps;
}>;
export declare const systemProps: ("border" | "borderTop" | "borderRight" | "borderBottom" | "borderLeft" | "borderColor" | "borderWidth" | "rounded" | "bgcolor" | "color" | "alignContent" | "alignItems" | "alignSelf" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "justifyContent" | "display" | "height" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "width" | "visibility" | "m" | "mh" | "mv" | "mt" | "mr" | "mb" | "ml" | "p" | "ph" | "pv" | "pt" | "pr" | "pb" | "pl" | "f" | "fontSize" | "fontWeight" | "lineHeight" | "textAlign" | "textDecoration" | "textTransform" | "whiteSpace" | "visuallyHidden")[];
export declare const getProps: <P extends SystemProps>({ sx, ...props }: P) => P & {
    sx?: StyleProps | undefined;
};
export declare const getStyles: (props: StyleProps | undefined) => string | undefined;

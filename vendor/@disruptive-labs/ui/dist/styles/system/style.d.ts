import type { StyleProps } from './types';
interface StyleFnProps<P extends keyof StyleProps> {
    key?: string | string[];
    prop: P;
    styles: Record<string, string>;
    transform?: (value: StyleProps[P] | undefined, props: StyleProps) => string;
}
export declare const style: <P extends keyof StyleProps>({ key: keyOption, prop, styles, transform, }: StyleFnProps<P>) => {
    (props: StyleProps): Record<string, string> | undefined;
    prop: P;
};
export {};

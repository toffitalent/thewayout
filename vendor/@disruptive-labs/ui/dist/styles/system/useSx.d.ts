import type { SystemProps } from './types';
interface Props extends SystemProps {
    className?: string;
}
type UseSxReturnValue<P extends Props> = Omit<P, keyof SystemProps> & {
    className?: string;
};
export declare const useSx: <P extends Props>(props: P) => UseSxReturnValue<P>;
export {};

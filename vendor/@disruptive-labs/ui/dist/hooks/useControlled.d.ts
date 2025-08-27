export interface UseControlledProps<T = unknown> {
    /**
     * Component value when controlled.
     */
    controlled: T | undefined;
    /**
     * Default value when uncontrolled.
     */
    default: T | undefined;
}
/**
 * `useControlled` is a React hook for managing component state which may be controlled or
 * uncontrolled. When uncontrolled, the supplied default value is used as the initial value and the
 * returned setState function updates the value. When controlled, the controlled value is used as
 * the value and the returned setState function does nothing.
 */
export declare const useControlled: <T = unknown>({ controlled, default: defaultProp, }: UseControlledProps<T>) => [T, (newValue: T | ((prevValue: T) => T)) => void];

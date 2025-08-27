import React from 'react';
import type { PropsOf } from '../types';
import { Button, ButtonLink } from './Button';
interface IconButtonComponentProps {
    /**
     * If `true`, the button will be a circle.
     *
     * @default false
     */
    round?: boolean;
}
export type IconButtonProps = IconButtonComponentProps & PropsOf<typeof Button>;
export type IconButtonLinkProps = IconButtonComponentProps & PropsOf<typeof ButtonLink>;
/**
 * IconButton renders a `Button` component, expecting only an `Icon` as a child. It is recommended
 * to set ARIA attributes on the component for users that may need assistance understanding the
 * function of the IconButton.
 */
export declare const IconButton: React.ForwardRefExoticComponent<Omit<IconButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;
export declare const IconButtonLink: React.ForwardRefExoticComponent<Omit<IconButtonLinkProps, "ref"> & React.RefAttributes<HTMLAnchorElement>>;
export {};

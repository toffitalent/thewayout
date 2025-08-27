import React from 'react';
import { ButtonBaseProps } from './ButtonBase';
export interface ButtonProps extends ButtonBaseProps<'button'> {
    /**
     * If `true`, the button will be disabled.
     *
     * @default false
     */
    disabled?: boolean;
    /**
     * HTML button type attribute.
     *
     * @default "button"
     */
    type?: 'button' | 'reset' | 'submit';
}
/**
 * Buttons are used for a wide variety of actions and events, e.g. submitting forms or navigating
 * to a different page.
 *
 * Note: The `Button` component is configured to render an HTML button element. Use `ButtonLink` to
 * render an HTML anchor tag or `ButtonBase` to render custom elements with the features and styles
 * of a button.
 */
export declare const Button: React.ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;
export type ButtonLinkProps = ButtonBaseProps<'a'>;
export declare const ButtonLink: React.ForwardRefExoticComponent<Omit<ButtonLinkProps, "ref"> & React.RefAttributes<HTMLAnchorElement>>;

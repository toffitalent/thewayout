import React from 'react';
import { UseWizardProps, WizardStep } from './useWizard';
import { IconButtonProps } from '../Button';
import { ProgressProps } from '../Progress';
export interface WizardProps<WizardData extends object = object> extends Omit<UseWizardProps<WizardData>, 'steps'> {
    /**
     * Wizard also accepts children as an alternative to the `steps` prop. NOTE: Children are only
     * processed once so changes will not be picked up.
     */
    children?: React.ReactElement<WizardStep<WizardData>>;
    /**
     * Layout component to wrap the wizard.
     *
     * @default WizardLayout
     */
    layout?: React.FunctionComponent<{
        children: React.ReactNode;
    }>;
    /**
     * Array of steps for the wizard.
     */
    steps?: UseWizardProps<WizardData>['steps'];
}
/**
 * Wizard is a powerful component with internal state and data management to complex multi-step
 * data collection flows (e.g. onboarding). Rendering and logic are deeply customizable.
 */
export declare function Wizard<WizardData extends object = object>({ children, layout: defaultLayout, steps: stepsProp, ...props }: WizardProps<WizardData>): React.JSX.Element;
export interface WizardFormProps<WizardData extends object = object> extends Pick<WizardStep<WizardData>, 'fields' | 'nextButtonLabel'> {
    /**
     * Class names(s) to override the styling on the form parent component.
     */
    className?: string;
}
/**
 * WizardForm is the default component for rendering a step consisting of one or more form fields.
 * Configured fields render the Field component in the context of a form allowing for easy use of
 * validation and other Field features. A field type of `choices` can also be used to render a
 * WizardChoices component in place of a checkbox/radio group. Initial values for the fields
 * are automatically extracted from the wizard data object.
 */
export declare function WizardForm<WizardData extends object = object>({ className, fields, nextButtonLabel, }: WizardFormProps<WizardData>): React.JSX.Element;
export type WizardProgressProps = Omit<ProgressProps, 'value'>;
/**
 * WizardProgress displays the percentage of steps completed in the wizard flow.
 */
export declare function WizardProgress({ className, ...props }: WizardProgressProps): React.JSX.Element;
/**
 * WizardBackButton can be used to render a minimal back arrow button in the corner of a wizard
 * layout. It will trigger the previous step method when clicked and hide automatically if there
 * is no previous step.
 */
export declare function WizardBackButton({ className, isFirst, ...props }: IconButtonProps & {
    isFirst?: boolean;
}): React.JSX.Element;
export interface WizardLayoutProps<WizardData extends object = object> extends Pick<WizardStep<WizardData>, 'title' | 'description' | 'showBackButton'> {
    /**
     * Children to render in the layout (i.e. where the step is rendered).
     */
    children?: React.ReactNode;
    /**
     * Class name(s) to override or extend the styles applied to the parent Content component.
     */
    className?: string;
    /**
     * If `true`, the content will be wrapped in a `Container` component.
     *
     * @default true
     */
    container?: boolean;
    /**
     * If `true`, a WizardProgress progressbar component will be displayed.
     *
     * @default true
     */
    showProgress?: boolean;
}
/**
 * WizardLayout is the default layout component for the wizard, which can be easily overridden for
 * the whole form or on a per-step basis. Depending on supplied props and the step being rendered,
 * it will display a progress bar, title, description, and the step component, plus an optional
 * back button if enabled.
 */
export declare function WizardLayout<WizardData extends object = object>({ children, className, container, title, description, showProgress, showBackButton: showBackButtonProp, }: WizardLayoutProps<WizardData>): React.JSX.Element;

import React from 'react';
import type { FieldType, FieldComponentProps } from '../Field';
import { WizardContextValue } from './WizardContext';
import { WizardChoicesProps } from './WizardChoices';
type WizardFormFields<T> = T extends FieldType ? Omit<FieldComponentProps<T>, 'control'> : never;
type WizardField = WizardFormFields<FieldType> | (Omit<WizardChoicesProps, 'control'> & {
    type: 'choices';
});
export interface WizardStep<WizardData extends object = object> {
    /**
     * A unique ID for the step.
     */
    id: string;
    /**
     * Custom ID string, index, or function to determine next step.
     *
     * @default index + 1
     */
    nextStep?: number | string | ((data: WizardData) => number | string | void | Promise<number | string | void>);
    /**
     * Callback to process/adjust data submitted during the step before merging result.
     */
    processStep?: <Data extends object>(data: Data) => WizardData | Promise<WizardData>;
    /**
     * The title to display in the wizard header.
     */
    title?: React.ReactNode;
    /**
     * Additional content to display beneath the title.
     */
    description?: React.ReactNode;
    /**
     * Array of form fields (same props as Field) to render for the step.
     * Also accepts a field of type 'choices' to render WizardChoices.
     */
    fields?: WizardField[];
    /**
     * Class name(s) to pass to the step layout component.
     */
    className?: string;
    /**
     * A custom component to render for the step.
     *
     * @default WizardForm with supplied fields
     */
    component?: React.ReactElement<WizardStep<WizardData>>;
    /**
     * A custom wrapper component for the step.
     *
     * @default WizardLayout with header and progress bar
     */
    layout?: React.FunctionComponent<{
        children: React.ReactNode;
    }>;
    /**
     * Override label displayed on next button.
     */
    nextButtonLabel?: string;
    /**
     * If `true`, the back button will be rendered in the default layout.
     */
    showBackButton?: boolean;
}
export interface UseWizardProps<WizardData extends object = object> {
    /**
     * Data object to initialize the wizard.
     *
     * @default {}
     */
    initialData?: WizardData;
    /**
     * Index of the first step to render.
     *
     * @default 0
     */
    initialStepIndex?: number;
    /**
     * Callback fired _after_ the step changes.
     */
    onStepChange?: (step: WizardStep<WizardData>, data: WizardData) => void;
    /**
     * Array of steps for the wizard.
     */
    steps: WizardStep<WizardData>[];
    /**
     * If `true`, the back button will be rendered in the default layout. This value can be
     * overridden by `showBackButton` on individual steps.
     */
    showBackButton?: boolean;
}
export declare function useWizard<WizardData extends object = object>({ initialData, initialStepIndex, onStepChange: onStepChangeProp, showBackButton, steps: wizardSteps, }: UseWizardProps<WizardData>): WizardContextValue<WizardData>;
export {};

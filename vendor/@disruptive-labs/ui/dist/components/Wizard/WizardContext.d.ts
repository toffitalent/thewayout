import React from 'react';
export interface WizardContextValue<WizardData extends object = object> {
    /**
     * `id` property of the current step.
     */
    currentStepId: string;
    /**
     * Index of the current step.
     */
    currentStepIndex: number;
    /**
     * Wizard data object (i.e. data supplied to `next()` and/or `setData()` from steps and merged)
     */
    data: WizardData;
    /**
     * Whether this is the first step.
     */
    isFirst: boolean;
    /**
     * Whether this is the last step.
     */
    isLast: boolean;
    /**
     * The total number of steps. Note: some steps may be skipped based on configuration.
     */
    length: number;
    /**
     * The percentage completion of the wizard (i.e. currentStepIndex / length).
     */
    progress: number;
    /**
     * Whether a back button should be shown. This is the value that was passed to `useWizard`.
     */
    showBackButton: boolean;
    /**
     * Immediately set the current step to the supplied step ID (if string) or step index (if
     * number).
     */
    goTo: (step: string | number) => void;
    /**
     * Move to the next step, either based on the `nextStep` value of the current step, if supplied,
     * or `currentStepIndex + 1` if not. Note: data can be optionally supplied as an argument, which
     * is merged _before_ calculating the next step and moving.
     */
    next: <Data extends object>(data?: Data) => Promise<void>;
    /**
     * Move to the previous step that was shown. Note: this takes into account skipped steps and
     * advanced flows (i.e. this is NOT `currentStepIndex - 1`).
     */
    previous: () => void;
    /**
     * Reset the wizard to the initial data and initial step base on initial configuration. **All
     * current progress/data will be lost!**
     */
    reset: () => void;
    /**
     * Merge data into the wizard data object without navigating. Note: `next()` also optionally
     * accepts data.
     */
    setData: (data: WizardData) => Promise<WizardData>;
}
export declare const WizardContext: React.Context<WizardContextValue<object>>;
export declare function useWizardContext<WizardData extends object = object>(): WizardContextValue<WizardData>;

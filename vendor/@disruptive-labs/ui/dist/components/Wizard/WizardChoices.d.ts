import React from 'react';
import { FieldOptions, FieldProps } from '../Field';
import { Control, FormControlProps } from '../Form';
export interface WizardChoicesItemProps extends FieldOptions {
    /**
     * If `true`, the choice (checkbox/radio) is checked.
     */
    checked: boolean;
    /**
     * If `true`, the choice (checkbox/radio) is disabled.
     */
    disabled?: boolean;
    /**
     * Callback to invoke when the checked state changes.
     */
    onChange?: (value: any, checked: boolean) => void;
    /**
     * The role to render for accessibility (checkbox if multiple, radio if single).
     */
    role: 'checkbox' | 'radio';
}
/**
 * WizardChoicesItem renders an accessible element to mimics a checkbox or radio and is useable via
 * both keyboard and mouse.
 */
export declare function WizardChoicesItem({ checked, disabled, label, onChange: onChangeProp, role, value, }: WizardChoicesItemProps): React.JSX.Element;
export interface WizardChoicesGroup {
    /**
     * The title to display above the group of choices.
     */
    title?: React.ReactNode;
    /**
     * The list of options to display as choice items.
     */
    options: FieldOptions[];
}
export type WizardChoicesControlProps = Omit<FormControlProps, 'children' | 'onChange' | 'ref'> & {
    /**
     * If `true`, the component will extend beyond the default limited-width form.
     */
    fluid?: boolean;
    /**
     * Content to render as helper text.
     */
    helperText?: string;
    /**
     * If `true`, choice items will be rendered horizontally instead of in a vertical list.
     */
    inline?: boolean;
    /**
     * If `true`, helper text will render as invalid.
     */
    invalid?: boolean;
    /**
     * Content to render as a label.
     */
    label?: React.ReactNode;
    /**
     * Maximum count of selected values.
     */
    maxChoices?: number;
    /**
     * If `true`, items use a "checkbox" role and multiple values can be chosen.
     */
    multiple?: boolean;
    /**
     * The list of options or option groups to display as choice items.
     */
    options: (FieldOptions | WizardChoicesGroup)[];
} & ({
    onChange: (value: string) => void;
    value: string;
} | {
    multiple: true;
    onChange: (value: string[]) => void;
    value: string[];
});
export type WizardChoicesProps = Omit<WizardChoicesControlProps, 'onChange' | 'value'> & {
    /**
     * Control object from useForm.
     */
    control: Control<any, any>;
    /**
     * The input name used in form submission.
     */
    name: string;
    /**
     * The input type.
     */
    type?: 'choices';
    /**
     * A validation object or function
     */
    validate?: FieldProps<any>['validate'];
    /**
     * A default validation error to override default validator messages
     *
     * NOTE: Supply custom, error-specific messages using the value/message syntax:
     * validate={{ maxLength: { value: 10, message: 'TOO LONG!' } }}
     */
    validationError?: string;
};
/**
 * WizardChoices is a drop-in replacement for rendering a CheckboxGroup or RadioGroup in the
 * context of a form with a more aesthetically-pleasing design (similar to Typeform for example).
 */
export declare function WizardChoices({ control, name, validate: validateProp, validationError, type, ...props }: WizardChoicesProps): React.JSX.Element;

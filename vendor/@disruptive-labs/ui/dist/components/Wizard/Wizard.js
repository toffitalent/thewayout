var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useWizardContext, WizardContext } from './WizardContext';
import { useWizard } from './useWizard';
import { Button, IconButton } from '../Button';
import { Field } from '../Field';
import { Content } from '../Content';
import { Icon } from '../Icon';
import { Progress } from '../Progress';
import styles from './Wizard.module.scss';
import { WizardChoices } from './WizardChoices';
import { WizardText } from './utils';
import { useForm } from '../Form';
/**
 * Wizard is a powerful component with internal state and data management to complex multi-step
 * data collection flows (e.g. onboarding). Rendering and logic are deeply customizable.
 */
export function Wizard(_a) {
    var { children, layout: defaultLayout = WizardLayout, steps: stepsProp } = _a, props = __rest(_a, ["children", "layout", "steps"]);
    const steps = useMemo(() => {
        if (stepsProp)
            return stepsProp;
        return React.Children.toArray(children)
            .filter(React.isValidElement)
            .map((item) => {
            const childStep = item;
            return childStep.props;
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    const context = useWizard(Object.assign(Object.assign({}, props), { steps }));
    const currentStep = steps[context.currentStepIndex];
    const { fields = [], layout: LayoutComponent = defaultLayout, component } = currentStep;
    return (React.createElement(WizardContext.Provider, { value: context },
        React.createElement(LayoutComponent, Object.assign({}, currentStep), component
            ? React.cloneElement(component, currentStep)
            : !!(fields === null || fields === void 0 ? void 0 : fields.length) && React.createElement(WizardForm, Object.assign({}, currentStep, { key: currentStep.id })))));
}
/**
 * WizardForm is the default component for rendering a step consisting of one or more form fields.
 * Configured fields render the Field component in the context of a form allowing for easy use of
 * validation and other Field features. A field type of `choices` can also be used to render a
 * WizardChoices component in place of a checkbox/radio group. Initial values for the fields
 * are automatically extracted from the wizard data object.
 */
export function WizardForm({ className, fields, nextButtonLabel = 'Next', }) {
    const wizard = useWizardContext();
    const defaultValues = useMemo(() => {
        var _a;
        return (_a = fields === null || fields === void 0 ? void 0 : fields.reduce((acc, field) => {
            var _a;
            return (Object.assign(Object.assign({}, acc), { [field.name]: (_a = wizard.data[field.name]) !== null && _a !== void 0 ? _a : (field.type === 'choices' && field.multiple ? [] : '') }));
        }, {})) !== null && _a !== void 0 ? _a : {};
    }, [fields]);
    const { control, formState: { isSubmitting, isValid }, submitForm, } = useForm({
        defaultValues,
        onSubmit: wizard.next,
    });
    return (React.createElement("form", { className: classNames(styles.form, className), onSubmit: submitForm }, fields === null || fields === void 0 ? void 0 :
        fields.map((field) => {
            switch (field.type) {
                case 'choices':
                    return React.createElement(WizardChoices, Object.assign({ key: field.name }, field, { control: control }));
                case 'checkbox':
                case 'radio':
                case 'toggle':
                    return React.createElement(Field, Object.assign({ key: field.name }, field, { control: control }));
                default:
                    return React.createElement(Field, Object.assign({ key: field.name, fluid: true }, field, { control: control }));
            }
        }),
        React.createElement(Button, { colorScheme: "primary", type: "submit", disabled: isSubmitting || !isValid, loading: isSubmitting, className: styles.submit, fluid: true }, nextButtonLabel)));
}
/**
 * WizardProgress displays the percentage of steps completed in the wizard flow.
 */
export function WizardProgress(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    const { progress } = useWizardContext();
    return (React.createElement(Progress, Object.assign({ colorScheme: "primary" }, props, { className: classNames(styles.progress, className), value: progress * 100 })));
}
/**
 * WizardBackButton can be used to render a minimal back arrow button in the corner of a wizard
 * layout. It will trigger the previous step method when clicked and hide automatically if there
 * is no previous step.
 */
export function WizardBackButton(_a) {
    var { className, isFirst = false } = _a, props = __rest(_a, ["className", "isFirst"]);
    const { previous } = useWizardContext();
    return (React.createElement(IconButton, Object.assign({ "aria-label": "Previous", colorScheme: "grey", disabled: isFirst, size: "sm", variant: "outline" }, props, { className: classNames(styles.back, isFirst && styles.backHidden, className), onClick: previous }),
        React.createElement(Icon, null,
            React.createElement("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
            React.createElement("polyline", { points: "15 6 9 12 15 18" }))));
}
/**
 * WizardLayout is the default layout component for the wizard, which can be easily overridden for
 * the whole form or on a per-step basis. Depending on supplied props and the step being rendered,
 * it will display a progress bar, title, description, and the step component, plus an optional
 * back button if enabled.
 */
export function WizardLayout({ children, className, container = true, title, description, showProgress = true, showBackButton: showBackButtonProp, }) {
    const wizard = useWizardContext();
    const showBackButton = showBackButtonProp !== null && showBackButtonProp !== void 0 ? showBackButtonProp : wizard.showBackButton;
    return (React.createElement(Content, { as: "section", container: container, className: classNames(styles.layout, className) },
        React.createElement("header", { className: styles.header },
            showBackButton && React.createElement(WizardBackButton, { isFirst: wizard.isFirst }),
            showProgress && React.createElement(WizardProgress, null),
            title && (React.createElement(WizardText, { as: "h2", className: styles.title }, title)),
            description && React.createElement(WizardText, { className: styles.description }, description)),
        children));
}

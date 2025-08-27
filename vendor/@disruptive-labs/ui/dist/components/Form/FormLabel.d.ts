import React from 'react';
import type { PolymorphicComponentProps, PolymorphicForwardRefExoticComponent } from '../types';
import type { SystemProps } from '../../styles';
export interface FormLabelComponentProps extends SystemProps {
    /**
     * The content of the component.
     */
    children: React.ReactNode;
}
export type FormLabelProps<C extends React.ElementType = 'label'> = PolymorphicComponentProps<C, FormLabelComponentProps>;
/**
 * FormLabel renders an HTML label element by default and is used to wrap other form control
 * components.
 */
export declare const FormLabel: PolymorphicForwardRefExoticComponent<'label', FormLabelComponentProps>;

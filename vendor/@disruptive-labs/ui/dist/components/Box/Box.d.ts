import React from 'react';
import { SystemProps } from '../../styles';
import type { PolymorphicComponentProps, PolymorphicForwardRefExoticComponent } from '../types';
export type BoxProps<C extends React.ElementType = 'div'> = PolymorphicComponentProps<C, React.PropsWithChildren<SystemProps>>;
/**
 * Box provides a low-level polymorphic component for other components to compose, or to be used
 * directly in layouts. Box accepts all system styling props to make styling components and
 * creating layouts simpler.
 */
export declare const Box: PolymorphicForwardRefExoticComponent<'div', React.PropsWithChildren<SystemProps>>;

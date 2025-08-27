import React from 'react';
import type { UseComboboxReturnValue } from './useCombobox';
export declare const ComboboxContext: React.Context<UseComboboxReturnValue<any>>;
export declare function useComboboxContext<Item = any>(): UseComboboxReturnValue<Item>;

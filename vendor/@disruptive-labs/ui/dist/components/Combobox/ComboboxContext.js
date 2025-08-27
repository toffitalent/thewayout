import React, { useContext } from 'react';
export const ComboboxContext = React.createContext({});
export function useComboboxContext() {
    const comboboxContext = useContext(ComboboxContext);
    return comboboxContext;
}

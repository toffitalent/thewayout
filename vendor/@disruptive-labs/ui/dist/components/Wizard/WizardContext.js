import React, { useContext } from 'react';
export const WizardContext = React.createContext({});
export function useWizardContext() {
    return useContext(WizardContext);
}

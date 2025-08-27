import React, { useContext } from 'react';
export const TabContext = React.createContext({});
export function useTabContext() {
    return useContext(TabContext);
}

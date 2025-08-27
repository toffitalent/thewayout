import React, { useContext } from 'react';
export const PopoverContext = React.createContext({});
export const usePopoverContext = () => useContext(PopoverContext);

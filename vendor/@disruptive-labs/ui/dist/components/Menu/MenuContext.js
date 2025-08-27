import React, { useContext } from 'react';
export const MenuContext = React.createContext({});
export const useMenuContext = () => useContext(MenuContext);

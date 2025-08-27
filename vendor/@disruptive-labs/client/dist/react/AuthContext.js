import React from 'react';
export const initialAuthState = {
    isAuthenticated: false,
    isLoading: true,
    session: null,
    user: null,
};
export const AuthContext = React.createContext(Object.assign(Object.assign({}, initialAuthState), { client: null }));

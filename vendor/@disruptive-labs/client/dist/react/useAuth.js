import { useContext } from 'react';
import { AuthContext } from './AuthContext';
export function useAuth() {
    const authContext = useContext(AuthContext);
    return authContext;
}
export function useClient() {
    const { client } = useAuth();
    return client;
}

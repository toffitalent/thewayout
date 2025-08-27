import { AuthState, AuthSession } from './AuthContext';
type Action = {
    type: 'INITIALIZED';
    session?: AuthSession | null;
} | {
    type: 'LOGIN';
    session: AuthSession;
} | {
    type: 'LOGOUT';
} | {
    type: 'ERROR';
    error: Error;
};
export declare const reducer: (state: AuthState, action: Action) => AuthState;
export {};

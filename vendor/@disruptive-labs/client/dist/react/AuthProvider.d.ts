import React from 'react';
import { Client } from '../client';
import { SessionBase } from '../types';
import { AuthSession, AuthState, AuthUser } from './AuthContext';
export interface AuthProviderProps<User extends AuthUser = AuthUser, Session extends SessionBase<User> = SessionBase, Credentials = any> {
    /**
     * Children to render within auth context.
     */
    children?: React.ReactNode;
    /**
     * Client instance.
     */
    client: Client<User, Session, Credentials>;
    /**
     * Component to render when an error occurs.
     */
    error?: React.ReactNode;
    /**
     * Component to render while initializing.
     */
    loading?: React.ReactNode;
    /**
     * Called with stored session (if any) **before** state updates.
     */
    onInitialize?: (session: AuthSession | null) => void | Promise<void>;
    /**
     * Called with current and previous state following update.
     */
    onStateChange?: (state: AuthState, previousState?: AuthState) => void;
}
export declare function AuthProvider<User extends AuthUser = AuthUser, Session extends SessionBase<User> = SessionBase, Credentials = any>({ children, client, error, loading, onInitialize: onInitializeProp, onStateChange: onStateChangeProp, }: AuthProviderProps<User, Session, Credentials>): JSX.Element;

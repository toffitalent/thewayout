import React from 'react';
import type { Client as ClientType } from '../client';
import type { SessionBase } from '../types';
type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
export type AuthUser = any;
export type AuthSession<User = AuthUser> = SessionBase<User>;
export interface AuthState<User extends AuthUser = AuthUser, Session extends AuthSession<User> = AuthSession<User>> {
    error?: Error;
    isAuthenticated: boolean;
    isLoading: boolean;
    session: Session | null;
    user: User | null;
}
export interface AuthContextType<Client extends ClientType = ClientType> {
    client: Client;
    error?: Error;
    isAuthenticated: boolean;
    isLoading: boolean;
    session?: Awaited<ReturnType<Client['getSession']>>;
    user?: Awaited<ReturnType<Client['getUser']>>;
}
export declare const initialAuthState: AuthState;
export declare const AuthContext: React.Context<AuthContextType<ClientType<any, SessionBase<any>, any>>>;
export {};

import type { ClientBase, ClientProvider } from '../types';
export interface CredentialsRequest {
    username: string;
    password: string;
}
export interface CredentialsResponse {
    tokenType: string;
    accessToken: string;
    refreshToken: string;
    roles?: string[];
    scope: string;
}
export interface CredentialsClaims {
    sub: number | string;
    exp: number;
}
export interface CredentialsUser {
    userId: number | string;
}
interface CredentialsSession<User extends CredentialsUser = CredentialsUser, Claims extends CredentialsClaims = CredentialsClaims> extends CredentialsResponse {
    claims: Claims;
    user: User;
}
type GetClaims<Claims extends CredentialsClaims = CredentialsClaims> = (response: CredentialsResponse) => Claims;
type GetUser<User extends CredentialsUser = CredentialsUser, Claims extends CredentialsClaims = CredentialsClaims, Session extends CredentialsSession<User, Claims> = CredentialsSession<User, Claims>> = (session: Omit<Session, 'user'>) => Promise<User> | User;
interface CredentialsConfig<User extends CredentialsUser = CredentialsUser, Claims extends CredentialsClaims = CredentialsClaims, Session extends CredentialsSession<User, Claims> = CredentialsSession<User, Claims>> {
    clientId: string;
    clientSecret: string;
    tokenEndpoint?: string;
    getClaims?: GetClaims<Claims>;
    getUser?: GetUser<User, Claims, Session>;
}
export declare class CredentialsProvider<User extends CredentialsUser = CredentialsUser, Claims extends CredentialsClaims = CredentialsClaims> implements ClientProvider<User, CredentialsSession<User, Claims>> {
    clientId: string;
    clientSecret: string;
    protected getClaims: GetClaims<Claims>;
    protected getUser: GetUser<User, Claims, CredentialsSession<User, Claims>>;
    protected tokenEndpoint: string;
    constructor({ clientId, clientSecret, getClaims, getUser, tokenEndpoint, }: CredentialsConfig<User, Claims>);
    protected handleResponse(response: CredentialsResponse): Promise<CredentialsSession<User, Claims>>;
    checkSession: (_: any, client: ClientBase) => Promise<boolean>;
    login: (credentials: CredentialsRequest, client: ClientBase) => Promise<CredentialsSession<User, Claims>>;
    logout: (_: any, client: ClientBase) => Promise<void>;
    refresh: (session: CredentialsSession<User, Claims>, client: ClientBase) => Promise<CredentialsSession<User, Claims> | null>;
}
export {};

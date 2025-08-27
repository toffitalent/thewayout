import type { AxiosInstance, AxiosResponse } from 'axios';
import type { AuthRequestConfig } from './auth';
import type { AxiosRefreshOptions, RefreshRequestConfig } from './refresh';
export interface ClientLock {
    acquire(key: string, timeout?: number): Promise<boolean>;
    release(key: string): Promise<void>;
}
export interface ClientStore {
    get<T = any>(key: string): Promise<T | null> | T | null;
    set(key: string, value: any): Promise<void> | void;
    remove(key: string): Promise<void> | void;
}
export interface ClientRequestConfig extends AuthRequestConfig, RefreshRequestConfig {
}
export interface ClientBase {
    get<T = any, R = AxiosResponse<T>>(url: string, config?: ClientRequestConfig): Promise<R>;
    delete<T = any, R = AxiosResponse<T>>(url: string, config?: ClientRequestConfig): Promise<R>;
    head<T = any, R = AxiosResponse<T>>(url: string, config?: ClientRequestConfig): Promise<R>;
    options<T = any, R = AxiosResponse<T>>(url: string, config?: ClientRequestConfig): Promise<R>;
    post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: ClientRequestConfig): Promise<R>;
    put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: ClientRequestConfig): Promise<R>;
    patch<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: ClientRequestConfig): Promise<R>;
    getToken(): Promise<string | null>;
    logout(): Promise<void>;
}
export interface SessionBase<User = any> {
    accessToken: string;
    scope: string;
    user: User;
}
export interface ClientProvider<User = any, Session extends SessionBase<User> = SessionBase<User>, Credentials = any> {
    checkSession?: (session: Session, client: ClientBase) => Promise<boolean>;
    login: (credentials: Credentials, client: ClientBase) => Promise<Session>;
    logout?: (session: Session, client: ClientBase) => Promise<void>;
    refresh?: (session: Session, client: ClientBase) => Promise<Session | null>;
}
export interface ClientConfig<User = any, Session extends SessionBase<User> = SessionBase<User>, Credentials = any> {
    axios?: AxiosInstance;
    baseURL: string;
    cookie?: ClientStore;
    cookieName?: string;
    lock?: ClientLock;
    provider: ClientProvider<User, Session, Credentials>;
    refresh?: AxiosRefreshOptions;
    retries?: number;
    store: ClientStore;
    timeout?: number;
}
export interface ClientEvents<User = any, Session extends SessionBase<User> = SessionBase<User>> {
    login: [Session];
    logout: [];
    refresh: [Session | null];
    sessionChange: [Session | null];
}

/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import type { Middleware } from '../types';
type Algorithm = 'HS256' | 'HS384' | 'HS512';
interface Roles {
    [role: string]: string[];
}
export interface AuthConfig {
    algorithm?: Algorithm;
    audience?: string;
    issuer?: string;
    roles?: Roles;
    secret?: string;
}
export interface AuthContext {
    [key: string]: any;
    appId: number | string | null;
    userId: number | string | null;
    roles: string[];
    scope: string[];
    is: (...args: any[]) => boolean;
    has: (...args: any[]) => boolean;
}
export declare function auth({ algorithm, audience, issuer, roles, secret, }?: AuthConfig): Middleware;
export {};

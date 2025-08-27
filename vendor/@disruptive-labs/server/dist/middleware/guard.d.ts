/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import type { Context, Middleware } from '../types';
type AuthorizerFunction = (ctx: Context) => boolean | Promise<boolean>;
export declare function guard(scopes?: string[], authorizer?: AuthorizerFunction | undefined): Middleware;
export {};

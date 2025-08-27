/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
/// <reference types="node" />
import type { ParsedUrlQuery } from 'querystring';
import compose from 'koa-compose';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import type { Redis } from 'ioredis';
import type { AuthConfig, AuthContext } from './middleware/auth';
import type { CacheConfig } from './middleware/cache';
import type { CorsConfig } from './middleware/cors';
import type { CspConfig } from './middleware/csp';
import type { CtoConfig } from './middleware/cto';
import type { HstsConfig } from './middleware/hsts';
import type { Log, LogConfig } from './log';
import type { LoggerConfig } from './middleware/logger';
import type { PaginateContext } from './middleware/paginate';
import type { ParserConfig } from './middleware/parser';
import type { ReferrerConfig } from './middleware/referrer';
import type { RestError } from './errors';
import type { StoreConfig } from './store';
import type { ThrottleConfig, ThrottleContext } from './middleware/throttle';
import type { VersionConfig } from './middleware/version';
import type { XframeConfig } from './middleware/xframe';
import type { XssConfig } from './middleware/xss';
interface MiddlewareConfig {
    [key: string]: any;
    enabled?: boolean;
}
export interface Config {
    [key: string]: any;
    auth?: AuthConfig & MiddlewareConfig;
    cache?: CacheConfig & MiddlewareConfig;
    cors?: CorsConfig & MiddlewareConfig;
    csp?: CspConfig & MiddlewareConfig;
    cto?: CtoConfig & MiddlewareConfig;
    hsts?: HstsConfig & MiddlewareConfig;
    log?: LogConfig;
    logger?: LoggerConfig & MiddlewareConfig;
    parser?: ParserConfig & MiddlewareConfig;
    referrer?: ReferrerConfig & MiddlewareConfig;
    store?: StoreConfig;
    throttle?: ThrottleConfig & MiddlewareConfig;
    version?: VersionConfig & MiddlewareConfig;
    xframe?: XframeConfig & MiddlewareConfig;
    xss?: XssConfig & MiddlewareConfig;
}
export interface Request<BodyT = any> extends Koa.Request {
    _querycache: Record<string, any>;
    body: BodyT;
    rawBody: any;
}
export type Response = Koa.Response;
type RestErrorMethods = keyof typeof RestError;
type Filter<T, U> = T extends U ? never : T;
type FilterMethods = keyof typeof Error | 'wrap';
type RestErrors = {
    [P in Filter<RestErrorMethods, FilterMethods>]: (typeof RestError)[P];
};
interface BaseContext<BodyT = any, ParamsT = any, QueryT extends ParsedUrlQuery = any> extends Koa.Context, RestErrors {
    request: Request<BodyT>;
    response: Response;
    auth: AuthContext;
    emit: (event: string, ...args: any[]) => void;
    log: Log;
    pagination?: PaginateContext;
    param(key: keyof ParamsT, coerce: 'id'): number;
    param<T = string>(key: keyof ParamsT, coerce?: any): T;
    params: ParamsT;
    query: QueryT;
    requestId: string;
    routerPath?: string | undefined;
    store: () => Redis;
    throttle: ThrottleContext;
    version: number;
    created(body: Record<string, any>): void;
    ok(body?: Record<string, any>): void;
    send(body?: Record<string, any>): void;
}
export type Context<BodyT = any, ParamsT = any, QueryT extends ParsedUrlQuery = any, StateT = any, CustomT = Record<string, unknown>> = BaseContext<BodyT, ParamsT, QueryT> & {
    state: StateT;
    router: Router<StateT, CustomT>;
    _matchedRoute: string | RegExp | undefined;
    _matchedRouteName: string | undefined;
} & CustomT;
export type Middleware = compose.Middleware<Context>;
export type MiddlewareFactory = (config?: any, app?: any) => Middleware;
export type Next = () => Promise<void>;
declare module 'koa-router' {
    interface IRouterParamContext extends BaseContext {
    }
}
export {};

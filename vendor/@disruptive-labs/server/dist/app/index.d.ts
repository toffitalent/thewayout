/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import http from 'http';
import Koa from 'koa';
import { Redis } from 'ioredis';
import { Config, Context, Middleware } from '../types';
import { Log } from '../log';
import { Router } from '../router';
export type Enhancer = (app: App) => void;
declare class App extends EventEmitter {
    static Router: typeof Router;
    app: Koa;
    context: Context;
    log: Log;
    router: Router;
    private conf;
    private redis;
    private server;
    constructor(config?: Config);
    config(key: string, defaultValue?: any): any;
    use(middleware: Middleware): void;
    store(): Redis;
    mount(router: Router | Middleware): void;
    callback(): ReturnType<Koa['callback']>;
    start(portOverride?: number): http.Server;
    stop(callback?: () => void): void;
}
export { App, Router };

/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import BaseRouter from 'koa-router';
import { Middleware } from '../types';
type Path = string | string[];
export declare class Router extends BaseRouter {
    mount(router: Router | Middleware): BaseRouter;
    mount(path: Path, router: Router | Middleware): BaseRouter;
}
export {};

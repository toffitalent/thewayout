/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import { KoaBodyDirectOptions } from 'koa-body';
import type { Middleware } from '../types';
interface ParseError extends Error {
    type?: string;
}
export type ParserConfig = Partial<KoaBodyDirectOptions>;
export declare function onError(error: ParseError): never;
export declare function parser({ encoding, formLimit, includeUnparsed, json, jsonLimit, multipart, parsedMethods, text, textLimit, urlencoded, ...bodyOptions }?: ParserConfig): Middleware;
export {};

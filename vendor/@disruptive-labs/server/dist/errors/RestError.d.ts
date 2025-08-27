/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
export type ValidationErrorSource = 'body' | 'headers' | 'params' | 'query';
export type RestErrorData = {
    [key: string]: any;
} | null | undefined;
export interface RestErrorHeaders {
    [key: string]: string;
}
export interface RestErrorOptions {
    code?: string;
    status?: number;
    data?: RestErrorData;
    headers?: RestErrorHeaders;
    errors?: Partial<ValidationError>[];
}
export interface ValidationError {
    key: string | string[];
    error: string;
    source: ValidationErrorSource;
}
export interface RestErrorError extends ValidationError {
    key: string[];
}
export declare class RestError extends Error {
    readonly code: string;
    readonly status: number;
    errors: RestErrorError[];
    data: RestErrorData;
    headers: RestErrorHeaders;
    constructor(message?: string, options?: RestErrorOptions);
    toJSON(): Record<string, unknown>;
    static wrap(error: Error & {
        code?: string;
        headers?: {
            [key: string]: any;
        };
        statusCode?: number;
        status?: number;
    }, expose?: boolean): RestError;
    static apiError(message: string, data?: RestErrorData): RestError;
    static badMethod(message: string, data?: RestErrorData, allow?: string[]): RestError;
    static badRequest(message: string, data?: RestErrorData): RestError;
    static insufficientScope(message: string, data?: RestErrorData): RestError;
    static invalidCredentials(message: string, data?: RestErrorData): RestError;
    static invalidRequest(message: string, errors: Partial<ValidationError> | Partial<ValidationError>[], data?: RestErrorData): RestError;
    static invalidVersion(message: string, data?: RestErrorData): RestError;
    static maintenance(message: string): RestError;
    static notAuthorized(message: string, data?: RestErrorData): RestError;
    static outOfInventory(message: string, data?: RestErrorData): RestError;
    static paymentDeclined(message: string, data?: RestErrorData): RestError;
    static requestThrottled(message: string, data?: RestErrorData, retry?: number): RestError;
    static resourceConflict(message: string, errors?: ValidationError | ValidationError[], data?: RestErrorData): RestError;
    static resourceNotFound(message: string, data?: RestErrorData): RestError;
    static serverError(message: string, data?: RestErrorData): RestError;
}

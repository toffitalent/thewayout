import type { AxiosInstance } from 'axios';
export declare enum ApiErrorType {
    Client = "CLIENT",
    Internal = "INTERNAL",
    Network = "NETWORK",
    Server = "SERVER"
}
export declare class ApiError extends Error {
    type: ApiErrorType;
    status: number;
    data: Record<string, unknown>;
    code: string;
    static Types: typeof ApiErrorType;
    constructor(type: ApiErrorType, status?: number, data?: Record<string, unknown>, code?: string);
}
export declare function axiosError(client: AxiosInstance): number;

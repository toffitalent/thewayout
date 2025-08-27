import { AxiosInstance, AxiosRequestConfig } from 'axios';
export interface AxiosRefreshOptions {
    interceptNetworkError?: boolean;
    statusCodes?: Array<number>;
    onRetry?: (requestConfig: AxiosRequestConfig) => AxiosRequestConfig;
}
export interface RefreshRequestConfig extends AxiosRequestConfig {
    skipAuthRefresh?: boolean;
}
export declare function axiosRefresh(instance: AxiosInstance, refreshFn: (error: any) => Promise<any>, options?: AxiosRefreshOptions): number;

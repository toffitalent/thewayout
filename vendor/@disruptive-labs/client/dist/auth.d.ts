import type { AxiosInstance, AxiosRequestConfig } from 'axios';
type Token = string | null | undefined;
export interface AuthRequestConfig extends AxiosRequestConfig {
    authToken?: string | false;
}
export declare function axiosAuth(client: AxiosInstance, getAccessToken: () => Promise<Token> | Token): number;
export {};

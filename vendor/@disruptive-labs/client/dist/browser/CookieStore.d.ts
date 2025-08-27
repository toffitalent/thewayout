import type { ClientStore } from '../types';
interface CookieStoreOptions {
    daysUntilExpire?: number;
    prefix?: string;
}
export declare class CookieStore implements ClientStore {
    protected daysUntilExpire: number;
    protected prefix: string;
    constructor({ daysUntilExpire, prefix }?: CookieStoreOptions);
    protected getCacheKey(key: string): string;
    get<T = any>(key: string): T | null;
    set(key: string, value: any): void;
    remove(key: string): void;
}
export {};

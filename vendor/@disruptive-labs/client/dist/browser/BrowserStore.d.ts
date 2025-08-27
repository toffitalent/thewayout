import type { ClientStore } from '../types';
interface BrowserStoreOptions {
    prefix?: string;
    storage?: Storage;
}
export declare class BrowserStore implements ClientStore {
    protected prefix: string;
    protected storage: Storage;
    constructor({ prefix, storage }?: BrowserStoreOptions);
    protected getCacheKey(key: string): string;
    get<T = any>(key: string): T;
    set(key: string, value: any): void;
    remove(key: string): void;
}
export {};

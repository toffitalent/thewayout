import type { ClientStore } from '../types';
interface NativeStorage {
    getItem(key: string): Promise<string | null> | string | null;
    setItem(key: string, value: string): Promise<void> | void;
    removeItem(key: string): Promise<void> | void;
}
interface NativeStoreOptions {
    prefix?: string;
    storage: NativeStorage;
}
export declare class NativeStore implements ClientStore {
    protected prefix: string;
    protected storage: NativeStorage;
    constructor({ prefix, storage }: NativeStoreOptions);
    protected getCacheKey(key: string): string;
    get<T = any>(key: string): Promise<T>;
    set(key: string, value: any): Promise<void>;
    remove(key: string): Promise<void>;
}
export {};

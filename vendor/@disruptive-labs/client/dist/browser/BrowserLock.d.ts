import Lock from 'browser-tabs-lock';
import type { ClientLock } from '../types';
interface BrowserLockOptions {
    prefix?: string;
}
export declare class BrowserLock implements ClientLock {
    protected lock: Lock;
    protected prefix: string;
    constructor({ prefix }?: BrowserLockOptions);
    acquire(key: string, timeout?: number): Promise<boolean>;
    release(key: string): Promise<void>;
}
export {};

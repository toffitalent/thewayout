import Lock from 'browser-tabs-lock';
export class BrowserLock {
    constructor({ prefix = '' } = {}) {
        this.lock = new Lock();
        this.prefix = prefix;
    }
    acquire(key, timeout = 5000) {
        return this.lock.acquireLock(`${this.prefix}.${key}`, timeout);
    }
    release(key) {
        return this.lock.releaseLock(`${this.prefix}.${key}`);
    }
}

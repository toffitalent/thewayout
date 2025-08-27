export class BrowserStore {
    constructor({ prefix = '', storage = window.localStorage } = {}) {
        this.prefix = prefix;
        this.storage = storage;
    }
    getCacheKey(key) {
        return `${this.prefix ? `${this.prefix}.` : ''}${key}`;
    }
    get(key) {
        const value = this.storage.getItem(this.getCacheKey(key));
        return value && JSON.parse(value);
    }
    set(key, value) {
        this.storage.setItem(this.getCacheKey(key), JSON.stringify(value));
    }
    remove(key) {
        this.storage.removeItem(this.getCacheKey(key));
    }
}

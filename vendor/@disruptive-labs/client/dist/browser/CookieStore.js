import * as Cookies from 'es-cookie';
export class CookieStore {
    constructor({ daysUntilExpire = 30, prefix = '' } = {}) {
        this.daysUntilExpire = daysUntilExpire;
        this.prefix = prefix;
    }
    getCacheKey(key) {
        return `${this.prefix ? `${this.prefix}.` : ''}${key}`;
    }
    get(key) {
        const value = Cookies.get(this.getCacheKey(key));
        if (typeof value === 'undefined') {
            return null;
        }
        return value && JSON.parse(value);
    }
    set(key, value) {
        let cookieAttributes = {
            expires: this.daysUntilExpire,
        };
        if (window.location.protocol === 'https:') {
            cookieAttributes = {
                secure: true,
                sameSite: 'none',
            };
        }
        Cookies.set(this.getCacheKey(key), JSON.stringify(value), cookieAttributes);
    }
    remove(key) {
        Cookies.remove(this.getCacheKey(key));
    }
}

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import axiosRetry, { exponentialDelay } from 'axios-retry';
import EventEmitter from 'eventemitter3';
import { axiosAuth } from './auth';
import { axiosError } from './errors';
import { axiosRefresh } from './refresh';
import { retryPromise } from './utils';
export class Client {
    constructor(config) {
        this.getSession = () => __awaiter(this, void 0, void 0, function* () { return this.store.get('session'); });
        this.saveSession = (session) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (session) {
                yield ((_a = this.cookie) === null || _a === void 0 ? void 0 : _a.set(this.cookieName, true));
                this.store.set('session', session);
                return this.emit('sessionChange', session);
            }
            yield ((_b = this.cookie) === null || _b === void 0 ? void 0 : _b.remove(this.cookieName));
            this.store.remove('session');
            return this.emit('sessionChange', null);
        });
        this.getToken = () => __awaiter(this, void 0, void 0, function* () {
            var _c;
            const session = yield this.getSession();
            return (_c = session === null || session === void 0 ? void 0 : session.accessToken) !== null && _c !== void 0 ? _c : null;
        });
        this.getUser = () => __awaiter(this, void 0, void 0, function* () {
            var _d;
            const session = yield this.getSession();
            return (_d = session === null || session === void 0 ? void 0 : session.user) !== null && _d !== void 0 ? _d : null;
        });
        this.isAuthenticated = () => __awaiter(this, void 0, void 0, function* () {
            const session = yield this.getSession();
            return !!session;
        });
        this.checkSession = () => __awaiter(this, void 0, void 0, function* () {
            var _e, _f, _g;
            const session = yield this.getSession();
            const check = !!session && ((_g = (yield ((_f = (_e = this.provider).checkSession) === null || _f === void 0 ? void 0 : _f.call(_e, session, this)))) !== null && _g !== void 0 ? _g : true);
            if (!check)
                this.saveSession(null);
            return check;
        });
        this.login = (credentials) => __awaiter(this, void 0, void 0, function* () {
            const session = yield this.provider.login(credentials, this);
            yield this.saveSession(session);
            this.emit('login', session);
        });
        this.logout = () => __awaiter(this, void 0, void 0, function* () {
            var _h, _j;
            const session = yield this.getSession();
            if (session) {
                yield ((_j = (_h = this.provider).logout) === null || _j === void 0 ? void 0 : _j.call(_h, session, this).catch(() => {
                    // Ignore errors to ensure session erased
                }));
            }
            yield this.saveSession(null);
            this.emit('logout');
        });
        this.refreshToken = () => __awaiter(this, void 0, void 0, function* () {
            var _k, _l, _m;
            if (yield retryPromise(() => !this.lock || this.lock.acquire('refresh', 5000), 10)) {
                const session = yield this.getSession();
                // If no valid session, assume logout occurred while waiting for lock
                if (!session)
                    return;
                try {
                    const refreshed = yield ((_l = (_k = this.provider).refresh) === null || _l === void 0 ? void 0 : _l.call(_k, session, this));
                    if (refreshed) {
                        this.saveSession(refreshed);
                        this.emit('refresh', refreshed);
                    }
                }
                finally {
                    (_m = this.lock) === null || _m === void 0 ? void 0 : _m.release('refresh');
                }
            }
            else {
                throw new Error('Timed out while attempting to refresh auth token');
            }
        });
        // Events
        this.emit = (eventName, ...args) => {
            this.emitter.emit(eventName, ...args);
        };
        this.addListener = (eventName, listener) => {
            this.emitter.addListener(eventName, listener);
            return () => {
                this.emitter.removeListener(eventName, listener);
            };
        };
        this.removeListener = (eventName, listener) => {
            this.emitter.removeListener(eventName, listener);
        };
        const { axios: axiosInstance, baseURL, cookie, cookieName = 'is.authenticated', lock, provider, refresh, retries = 4, store, timeout = 0, } = config;
        this.cookie = cookie;
        this.cookieName = cookieName;
        this.emitter = new EventEmitter();
        this.lock = lock;
        this.provider = provider;
        this.store = store;
        this.client = axiosInstance !== null && axiosInstance !== void 0 ? axiosInstance : axios.create({ baseURL, timeout });
        axiosAuth(this.client, this.getToken);
        if (this.provider.refresh)
            axiosRefresh(this.client, this.refreshToken, refresh);
        axiosRetry(this.client, { retries, retryDelay: exponentialDelay });
        // This needs to be last to avoid interceptor incompatibilities with custom errors
        axiosError(this.client);
        this.get = this.client.get;
        this.delete = this.client.delete;
        this.head = this.client.head;
        this.options = this.client.options;
        this.post = this.client.post;
        this.put = this.client.put;
        this.patch = this.client.patch;
    }
}

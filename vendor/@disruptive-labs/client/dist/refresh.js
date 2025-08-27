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
const shouldInterceptError = (error, options) => {
    var _a, _b;
    if (!error || ((_a = error === null || error === void 0 ? void 0 : error.config) === null || _a === void 0 ? void 0 : _a.skipAuthRefresh)) {
        return false;
    }
    if (!(options.interceptNetworkError && !error.response && error.request.status === 0) &&
        (!error.response || !((_b = options.statusCodes) === null || _b === void 0 ? void 0 : _b.includes(parseInt(error.response.status, 10))))) {
        return false;
    }
    // Copy config to response if there's a network error, so config can be modified and used in the retry
    if (!error.response) {
        error.response = {
            config: error.config,
        };
    }
    return true;
};
export function axiosRefresh(instance, refreshFn, options = {}) {
    if (typeof refreshFn !== 'function') {
        throw new Error('Invalid refresh function');
    }
    const opts = Object.assign({ interceptNetworkError: false, statusCodes: [401] }, options);
    let interceptor;
    let refreshing;
    return instance.interceptors.response.use(undefined, (error) => __awaiter(this, void 0, void 0, function* () {
        if (!shouldInterceptError(error, opts)) {
            return Promise.reject(error);
        }
        refreshing = refreshing !== null && refreshing !== void 0 ? refreshing : refreshFn(error);
        interceptor = instance.interceptors.request.use((request) => {
            if (!refreshing || request.skipAuthRefresh)
                return request;
            return refreshing
                .catch(() => {
                throw new axios.Cancel('Refresh call failed');
            })
                .then(() => (opts.onRetry ? opts.onRetry(request) : request));
        });
        return refreshing
            .finally(() => {
            instance.interceptors.request.eject(interceptor);
            refreshing = undefined;
        })
            .catch((err) => Promise.reject(err))
            .then(() => {
            error.config.skipAuthRefresh = true;
            return instance(error.response.config);
        });
    }));
}

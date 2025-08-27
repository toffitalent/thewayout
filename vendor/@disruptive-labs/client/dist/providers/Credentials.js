var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { parseJwt } from '../utils';
const defaultGetClaims = (response) => {
    try {
        return parseJwt(response.accessToken);
    }
    catch (err) {
        return { sub: 0, exp: 0 };
    }
};
const defaultGetUser = (session) => ({ userId: session.claims.sub });
export class CredentialsProvider {
    constructor({ clientId, clientSecret, getClaims = defaultGetClaims, getUser = defaultGetUser, tokenEndpoint = '/oauth/token', }) {
        this.checkSession = (_, client) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                yield client.get(this.tokenEndpoint);
                return true;
            }
            catch (err) {
                const status = (err === null || err === void 0 ? void 0 : err.status) || ((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status);
                if (status >= 400 && status < 500) {
                    return false;
                }
                // Assume network/server error
                throw err;
            }
        });
        this.login = (credentials, client) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield client.post(this.tokenEndpoint, Object.assign(Object.assign({}, credentials), { clientId: this.clientId, clientSecret: this.clientSecret, grantType: 'password' }), { authToken: false, skipAuthRefresh: true });
            return this.handleResponse(data);
        });
        this.logout = (_, client) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield client.delete(this.tokenEndpoint, { skipAuthRefresh: true });
            }
            catch (err) {
                // Ignore
            }
        });
        this.refresh = (session, client) => __awaiter(this, void 0, void 0, function* () {
            var _b, _c;
            if (!session || session.claims.exp - 60 > Math.floor(Date.now() / 1000)) {
                return session;
            }
            try {
                const { data } = yield client.post(this.tokenEndpoint, {
                    clientId: this.clientId,
                    clientSecret: this.clientSecret,
                    grantType: 'refresh_token',
                    refreshToken: session.refreshToken,
                }, { authToken: false, skipAuthRefresh: true });
                return this.handleResponse(data);
            }
            catch (err) {
                const token = yield client.getToken();
                if (token && session.accessToken !== token) {
                    return null;
                }
                // Assume refresh token has expired or been invalidated
                if (((_b = err.response) === null || _b === void 0 ? void 0 : _b.status) >= 400 && ((_c = err.response) === null || _c === void 0 ? void 0 : _c.status) <= 500) {
                    yield client.logout();
                }
                throw err;
            }
        });
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.getClaims = getClaims;
        this.getUser = getUser;
        this.tokenEndpoint = tokenEndpoint;
    }
    handleResponse(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const claims = this.getClaims(response);
            const user = yield this.getUser(Object.assign(Object.assign({}, response), { claims }));
            return Object.assign(Object.assign({}, response), { claims,
                user });
        });
    }
}

export var ApiErrorType;
(function (ApiErrorType) {
    ApiErrorType["Client"] = "CLIENT";
    ApiErrorType["Internal"] = "INTERNAL";
    ApiErrorType["Network"] = "NETWORK";
    ApiErrorType["Server"] = "SERVER";
})(ApiErrorType || (ApiErrorType = {}));
export class ApiError extends Error {
    constructor(type, status = 0, data = {}, code = '') {
        super(`API ERROR - ${type}`);
        this.type = type;
        this.status = status;
        this.data = data;
        this.code = code;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
ApiError.Types = ApiErrorType;
export function axiosError(client) {
    return client.interceptors.response.use(undefined, (error) => {
        var _a, _b;
        if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) {
            const type = error.response.status >= 500 ? ApiErrorType.Server : ApiErrorType.Client;
            return Promise.reject(new ApiError(type, error.response.status, error.response.data, (_b = error.response.data) === null || _b === void 0 ? void 0 : _b.code));
        }
        if (error instanceof ApiError) {
            return Promise.reject(error);
        }
        if (error.request) {
            return Promise.reject(new ApiError(ApiErrorType.Network));
        }
        return Promise.reject(new ApiError(ApiErrorType.Internal));
    });
}

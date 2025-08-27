var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class NativeStore {
    constructor({ prefix = '', storage }) {
        this.prefix = prefix;
        this.storage = storage;
    }
    getCacheKey(key) {
        return `${this.prefix ? `${this.prefix}.` : ''}${key}`;
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.storage.getItem(this.getCacheKey(key));
            return value && JSON.parse(value);
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storage.setItem(this.getCacheKey(key), JSON.stringify(value));
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storage.removeItem(this.getCacheKey(key));
        });
    }
}

var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { borders } from './borders';
import { colors } from './colors';
import { flex } from './flex';
import { layout } from './layout';
import { spacing } from './spacing';
import { typography } from './typography';
import { other } from './other';
const handlers = [...borders, ...colors, ...flex, ...layout, ...spacing, ...typography, ...other];
export const system = handlers.reduce((map, handler) => (Object.assign(Object.assign({}, map), { [handler.prop]: handler })), {});
export const systemProps = handlers.map((handler) => handler.prop);
export const getProps = (_a) => {
    var { sx } = _a, props = __rest(_a, ["sx"]);
    const split = Object.keys(props).reduce((result, key) => {
        if (systemProps.includes(key)) {
            return Object.assign(Object.assign({}, result), { sx: Object.assign(Object.assign({}, result.sx), { [key]: props[key] }) });
        }
        return Object.assign(Object.assign({}, result), { [key]: props[key] });
    }, {});
    return Object.assign(Object.assign({}, split), { sx: Object.assign(Object.assign({}, split.sx), sx) });
};
export const getStyles = (props) => {
    if (!props)
        return undefined;
    const keys = Object.keys(props);
    return keys.length
        ? Object.values(systemProps
            .filter((prop) => keys.includes(prop))
            .reduce((styles, prop) => {
            var _a;
            return (Object.assign(Object.assign({}, styles), (_a = system[prop]) === null || _a === void 0 ? void 0 : _a.call(system, props)));
        }, {}))
            .filter(Boolean)
            .join(' ')
        : undefined;
};

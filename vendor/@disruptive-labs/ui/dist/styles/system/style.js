export const style = ({ key: keyOption, prop, styles, transform, }) => {
    const fn = (props) => {
        if (props[prop] == null) {
            return undefined;
        }
        const key = keyOption || prop;
        const propValue = props[prop];
        const value = transform
            ? transform === null || transform === void 0 ? void 0 : transform(propValue, props)
            : String(propValue === true ? '' : propValue !== null && propValue !== void 0 ? propValue : '').replace(/\./g, '-');
        if (value == null)
            return undefined;
        return Array.isArray(key)
            ? key.reduce((map, item) => (Object.assign(Object.assign({}, map), { [item]: styles[value ? `${item}-${value}` : item] })), {})
            : { [key]: styles[value ? `${key}-${value}` : key] };
    };
    fn.prop = prop;
    return fn;
};

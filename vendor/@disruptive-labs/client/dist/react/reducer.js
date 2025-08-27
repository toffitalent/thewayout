export const reducer = (state, action) => {
    var _a;
    switch (action.type) {
        case 'INITIALIZED':
        case 'LOGIN':
            return Object.assign(Object.assign({}, state), { isAuthenticated: !!action.session, isLoading: false, session: action.session || null, user: ((_a = action.session) === null || _a === void 0 ? void 0 : _a.user) || null, error: undefined });
        case 'LOGOUT':
            return Object.assign(Object.assign({}, state), { isAuthenticated: false, session: null, user: null });
        case 'ERROR':
            return Object.assign(Object.assign({}, state), { isLoading: false, error: action.error });
        default:
            return state;
    }
};

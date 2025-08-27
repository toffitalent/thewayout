var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useEffect, useMemo, useReducer } from 'react';
import { AuthContext, initialAuthState } from './AuthContext';
import { reducer } from './reducer';
import { useEventCallback, usePrevious } from './utils';
export function AuthProvider({ children, client, error, loading, onInitialize: onInitializeProp, onStateChange: onStateChangeProp, }) {
    const onInitialize = useEventCallback(onInitializeProp);
    const onStateChange = useEventCallback(onStateChangeProp);
    const [state, dispatch] = useReducer(reducer, initialAuthState);
    const previousState = usePrevious(state);
    const value = useMemo(() => (Object.assign(Object.assign({}, state), { client: client })), [client, state]);
    useEffect(() => {
        // Initialize
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield client.checkSession();
                const session = yield client.getSession();
                yield onInitialize(session);
                dispatch({ type: 'INITIALIZED', session });
            }
            catch (error) {
                dispatch({ type: 'ERROR', error });
            }
        }))();
        // Subscribe to client events to update auth context
        const removeLoginListener = client.addListener('login', (session) => __awaiter(this, void 0, void 0, function* () { return dispatch({ type: 'LOGIN', session }); }));
        const removeLogoutListener = client.addListener('logout', () => __awaiter(this, void 0, void 0, function* () { return dispatch({ type: 'LOGOUT' }); }));
        return () => {
            removeLoginListener();
            removeLogoutListener();
        };
    }, [client]); // eslint-disable-line react-hooks/exhaustive-deps
    // Verify client session exists on window visibility change
    useEffect(() => {
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            const onVisibilityChange = () => __awaiter(this, void 0, void 0, function* () {
                if (document.visibilityState === 'visible') {
                    const session = yield client.getSession();
                    if (session) {
                        dispatch({ type: 'LOGIN', session });
                    }
                    else {
                        dispatch({ type: 'LOGOUT' });
                    }
                }
            });
            document.addEventListener('visibilitychange', onVisibilityChange);
            return () => document.removeEventListener('visibilitychange', onVisibilityChange);
        }
        return undefined;
    }, [client]); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        onStateChange(state, previousState);
    }, [onStateChange, previousState, state]);
    let content = children;
    if (typeof loading !== 'undefined' && state.isLoading) {
        content = loading;
    }
    else if (typeof error !== 'undefined' && state.error) {
        content = error;
    }
    return React.createElement(AuthContext.Provider, { value: value }, content);
}

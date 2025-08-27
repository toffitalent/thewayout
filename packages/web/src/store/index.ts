import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { createReduxEnhancer as createSentryReduxEnhancer } from '@sentry/react';
import { reducer, State } from '../reducers';

export const listenerMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  enhancers: [
    // Sentry redux breadcrumbs
    createSentryReduxEnhancer({
      // By default, we'll only send the action types
      actionTransformer: (action) => ({ type: action.type }),
      // And no state
      stateTransformer: () => null,
      // But we'll configure the user automatically
      configureScopeWithState: (scope, state: State) => {
        const { user } = state.auth;
        scope.setUser(
          user
            ? {
                id: String(user.id),
                username: user.email?.toLowerCase(),
                email: user.email,
                ip_address: '{{auto}}',
              }
            : null,
        );
      },
    }),
  ],
});

export type AppDispatch = typeof store.dispatch;
export type { State } from '../reducers';

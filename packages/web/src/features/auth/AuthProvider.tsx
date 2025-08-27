import {
  AuthProvider as ClientAuthProvider,
  AuthProviderProps,
} from '@disruptive-labs/client/react';
import React from 'react';
import { API } from '@app/api';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { fetchUser, logout } from './actions';
import { selectAuthUserId } from './reducer';

export function AuthProvider(props: Omit<AuthProviderProps, 'client'>) {
  const dispatch = useAppDispatch();
  const authUserId = useAppSelector(selectAuthUserId);

  return (
    <ClientAuthProvider
      {...props}
      client={API.client}
      onInitialize={async (session) => {
        if (session) {
          await dispatch(fetchUser());
        }
      }}
      onStateChange={(state, previousState) => {
        if (!state.isAuthenticated && !!previousState?.isAuthenticated && !!authUserId) {
          dispatch(logout());
        }
      }}
    />
  );
}

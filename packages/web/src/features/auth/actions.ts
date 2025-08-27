import { CreateUserRequest } from '@two/shared';
import { API } from '@app/api';
import { createApiThunk } from '@app/utils';

export const fetchUser = createApiThunk('auth/fetchUser', API.user.retrieve);
export const forgotPassword = createApiThunk('auth/forgotPassword', API.user.forgotPassword);

export const login = createApiThunk(
  'auth/login',
  async (credentials: Parameters<typeof API.login>[0], { dispatch }) => {
    await API.login(credentials);
    await dispatch(fetchUser());
  },
);

export const logout = createApiThunk('auth/logout', API.logout);

export const resetPassword = createApiThunk(
  'auth/resetPassword',
  async (
    { username, password, token }: { username: string; password: string; token: string },
    { dispatch },
  ) => {
    await API.user.resetPassword(password, token);
    return dispatch(login({ username, password }));
  },
);

export const signUp = createApiThunk(
  'auth/register',
  async (payload: CreateUserRequest, { dispatch }) => {
    await API.user.create(payload);
    return dispatch(login({ username: payload.email, password: payload.password }));
  },
);

export const updateUser = createApiThunk('auth/updateUser', API.user.update);

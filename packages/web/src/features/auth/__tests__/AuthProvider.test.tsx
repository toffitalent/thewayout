import React from 'react';
import { API } from '@app/api';
import { useAppAuth } from '@app/hooks';
import { act, MockedThunk, mockThunks, render, waitFor } from '@test';
import * as actions from '../actions';
import { AuthProvider } from '../AuthProvider';

jest.mock('@app/api');
const mockedApi = jest.mocked(API);

describe('AuthProvider', () => {
  let auth!: ReturnType<typeof useAppAuth>;
  let fetchUser: MockedThunk;
  let logout: MockedThunk;

  function Child() {
    auth = useAppAuth();
    return null;
  }

  beforeEach(() => {
    auth = undefined as any;
    [fetchUser, logout] = mockThunks(actions, ['fetchUser', 'logout']);
  });

  test('renders correctly', async () => {
    mockedApi.client.addListener.mockReturnValue(jest.fn());

    await waitFor(() =>
      render(
        <AuthProvider>
          <Child />
        </AuthProvider>,
      ),
    );

    await waitFor(() => {
      expect(auth).toEqual({
        client: API.client,
        error: undefined,
        isAuthenticated: false,
        isLoading: false,
        session: null,
        user: null,
      });
    });
    expect(fetchUser).not.toBeCalled();
    expect(logout).not.toBeCalled();
  });

  test('dispatches fetchUser thunk if authenticated', async () => {
    const session: any = { accessToken: '', user: { userId: '__ID__' } };
    mockedApi.client.checkSession.mockResolvedValue(true);
    mockedApi.client.getSession.mockResolvedValue(session);
    mockedApi.client.addListener.mockReturnValue(jest.fn());

    const { dispatch } = await waitFor(() =>
      render(
        <AuthProvider>
          <Child />
        </AuthProvider>,
      ),
    );

    await waitFor(() => {
      expect(auth).toEqual({
        client: API.client,
        error: undefined,
        isAuthenticated: true,
        isLoading: false,
        session,
        user: session.user,
      });
    });
    expect(fetchUser).toBeCalledTimes(1);
    expect(logout).not.toBeCalled();
    expect(dispatch).toBeCalled();
  });

  test('dispatches logout thunk if isAuthenticated becomes false', async () => {
    const session: any = { accessToken: '', user: { userId: '__ID__' } };
    mockedApi.client.checkSession.mockResolvedValue(true);
    mockedApi.client.getSession.mockResolvedValue(session);
    mockedApi.client.addListener.mockReturnValue(jest.fn());

    const { dispatch } = render(
      <AuthProvider>
        <Child />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(auth).toEqual({
        client: API.client,
        error: undefined,
        isAuthenticated: true,
        isLoading: false,
        session,
        user: session.user,
      }),
    );

    act(() => {
      mockedApi.client.addListener.mock.calls[1][1]();
    });

    await waitFor(() =>
      expect(auth).toEqual({
        client: API.client,
        error: undefined,
        isAuthenticated: false,
        isLoading: false,
        session: null,
        user: null,
      }),
    );

    expect(logout).toBeCalled();
    expect(dispatch).toBeCalled();
  });
});

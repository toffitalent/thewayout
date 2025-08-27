import { API, UserType } from '@app/api';
import { fixtures } from '@test';
import {
  fetchUser,
  forgotPassword,
  login,
  logout,
  resetPassword,
  signUp,
  updateUser,
} from '../actions';

jest.mock('@app/api');

const { user } = fixtures;

describe('Auth > Actions', () => {
  beforeEach(() => {
    (API.user.retrieve as jest.Mock).mockResolvedValue(user);
  });

  test('fetchUser calls user retrieve API method', async () => {
    const action = fetchUser();
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.user.retrieve).toBeCalled();
  });

  test('forgotPassword calls user forgot password API method', async () => {
    const username = 'test@example.com';
    const action = forgotPassword(username);
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.user.forgotPassword).toBeCalledWith(username, expect.any(Object));
  });

  test('login calls user login API method', async () => {
    const username = 'test@example.com';
    const password = 'password';
    const dispatch = jest.fn();
    const action = login({ username, password });
    await action(dispatch, jest.fn(), undefined);
    expect(API.login).toBeCalledWith({ username, password });
    expect(dispatch).toBeCalled();
  });

  test('logout calls user logout API method', async () => {
    const action = logout();
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.logout).toBeCalled();
  });

  test('resetPassword calls user reset password API method', async () => {
    const dispatch = jest.fn();
    const payload = { username: 'test@example.com', password: 'password', token: '__TOKEN__' };
    const action = resetPassword(payload);
    await action(dispatch, jest.fn(), undefined);
    expect(API.user.resetPassword).toBeCalledWith(payload.password, payload.token);
    expect(dispatch).toBeCalled();
  });

  test('signUp calls user create api method', async () => {
    const payload = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password',
      type: UserType.Client,
    };
    const dispatch = jest.fn();
    const action = signUp(payload);
    await action(dispatch, jest.fn(), undefined);
    expect(API.user.create).toBeCalledWith(payload);
    expect(dispatch).toBeCalled();
  });

  test('updateUser calls user update API method', async () => {
    const update = { firstName: 'Updated' };
    const action = updateUser(update);
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.user.update).toHaveBeenCalledWith(update, expect.any(Object));
  });
});

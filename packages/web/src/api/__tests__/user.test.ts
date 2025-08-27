import { client } from '../client';
import { user, UserType } from '../user';

jest.mock('../client');

describe('API > User', () => {
  const data = {
    id: 1,
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    type: UserType.Client,
  };

  test('executes user create request', async () => {
    (client.post as jest.Mock).mockImplementationOnce(() => Promise.resolve({ data }));
    const { id, ...rest } = data;
    const res = await user.create({ ...rest, password: 'password' });
    expect(res).toBe(data);
  });

  test('exectues user retrieve request', async () => {
    (client.get as jest.Mock).mockImplementationOnce(() => Promise.resolve({ data }));
    const res = await user.retrieve();
    expect(res).toBe(data);
    expect(client.get).toBeCalledWith('/v1/user');
  });

  test('executes user update request', async () => {
    (client.patch as jest.Mock).mockImplementationOnce(() => Promise.resolve({ data }));
    const res = await user.update({ firstName: 'Test' });
    expect(res).toBe(data);
  });

  test('executes forgot password request', async () => {
    (client.post as jest.Mock).mockImplementation(() => Promise.resolve({}));
    const res = await user.forgotPassword('test@example.com');
    expect(res).toBe(undefined);
  });

  test('executes password reset request', async () => {
    (client.post as jest.Mock).mockImplementation(() => Promise.resolve({ data }));
    const res = await user.resetPassword('password', '1234567890');
    expect(res).toBe(data);
  });
});

import { client } from '../client';

describe('API > Client', () => {
  const jwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOjEsInN1YiI6MSwidGlkIjoxLCJzY29wZSI6InNlbGYiLCJpYXQiOjE2MDk0ODgwMDAsImV4cCI6MTYwOTQ4ODkwMH0.wYZ87_KJ_ZA-vWNBqXGhdJ5vj-203FFkhq8xKYr9zk0';

  const response = {
    accessToken: jwt,
    refreshToken: '__TOKEN__',
    scope: 'self',
    tokenType: 'Bearer',
  };

  test('add JWT claims and user object to session', async () => {
    jest.spyOn(client, 'post').mockResolvedValueOnce({
      data: response,
    });

    const login = jest.spyOn((client as any).provider, 'login');

    await client.login({ username: 'test@example.com', password: 'password' });
    expect(login).toBeCalled();
    await expect(login.mock.results[0].value).resolves.toEqual({
      ...response,
      claims: {
        aud: 1,
        sub: 1,
        tid: 1,
        scope: 'self',
        iat: 1609488000,
        exp: 1609488900,
      },
      user: {
        id: 1,
        roles: [],
        scope: 'self',
        userId: 1,
      },
    });
  });
});

import { client } from '../browser';

describe('API > Client (Browser)', () => {
  const jwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ0aWxseS1hcGkiLCJhenAiOiIxLjEiLCJqdGkiOiJydC0xIiwic3ViIjoxLCJzY29wZSI6InNlbGYiLCJ1aWQiOjEsImlhdCI6MTYwOTQ4ODAwMCwiZXhwIjoxNjA5NDg4OTAwfQ.CUjb-ATuewmnPBlFQlUXP39w-E7NSTPHNW--EdQKJx4';

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
        aud: 'tilly-api',
        azp: '1.1',
        jti: 'rt-1',
        sub: 1,
        scope: 'self',
        uid: 1,
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

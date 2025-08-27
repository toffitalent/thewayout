import { send } from '@two/mail';
import { app } from '@app/app';
import { fixtures, request, resetDb, resetStore } from '@test';

describe('Routes > Users > Password', () => {
  beforeEach(async () => {
    await resetDb();
    await resetStore();
  });

  describe('POST /api/v1/users/password/token', () => {
    test('sends a password reset email', async () => {
      const res = await request().post('/api/v1/users/password/token').send({
        clientId: fixtures.client.id,
        clientSecret: fixtures.client.secret,
        username: fixtures.user1.email,
      });

      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < 5; i += 1) {
        const keys = await app.store().keys('password-reset:*');
        if (!keys.length)
          await new Promise((resolve) => {
            setTimeout(resolve, 500);
          });
      }

      const keys = await app.store().keys('password-reset:*');
      const value = await app.store().get(keys[0]);

      expect(res.status).toBe(204);
      expect(keys).toHaveLength(1);
      expect(value).toBe(fixtures.user1.id);
      expect(send).toBeCalledTimes(1);
      expect((send as jest.Mock).mock.calls[0][0].name).toBe(
        `${fixtures.user1.firstName} ${fixtures.user1.lastName}`,
      );
      expect((send as jest.Mock).mock.calls[0][0].email).toBe(fixtures.user1.email);
      expect((send as jest.Mock).mock.calls[0][1]).toBe('PasswordReset');
      expect((send as jest.Mock).mock.calls[0][2]!.token).toBe(keys[0].split(':')[1]);
    });

    test('returns successful response for unknown usernames', async () => {
      const res = await request().post('/api/v1/users/password/token').send({
        clientId: fixtures.client.id,
        clientSecret: fixtures.client.secret,
        username: 'unknown@example.com',
      });
      expect(res.status).toBe(204);
    });

    test('returns an invalid parameter response for unauthorized clients', async () => {
      const res = await request().post('/api/v1/users/password/token').send({
        clientId: fixtures.unknownId,
        clientSecret: '1234567890',
        username: 'unknown@example.com',
      });

      expect(res.status).toBe(400);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('POST /api/v1/users/password', () => {
    test('resets password', async () => {
      // Add reset code
      await app.store().set('password-reset:12345', fixtures.user1.id);

      const res = await request().post('/api/v1/users/password').send({
        clientId: fixtures.client.id,
        clientSecret: fixtures.client.secret,
        password: 'asdfas2342kj!',
        token: '12345',
      });

      const value = await app.store().get('password-reset:12345');

      expect(res.status).toBe(204);
      expect(value).toBe(null);
    });

    test('sends account security email', async () => {
      // Add reset code
      await app.store().set('password-reset:12345', fixtures.user1.id);

      await request().post('/api/v1/users/password').send({
        clientId: fixtures.client.id,
        clientSecret: fixtures.client.secret,
        password: 'asdfas2342kj!',
        token: '12345',
      });

      expect(send).toBeCalledTimes(1);
      expect((send as jest.Mock).mock.calls[0][0].name).toBe(
        `${fixtures.user1.firstName} ${fixtures.user1.lastName}`,
      );
      expect((send as jest.Mock).mock.calls[0][0].email).toBe(fixtures.user1.email);
      expect((send as jest.Mock).mock.calls[0][1]).toBe('SecurityPassword');
    });

    test('returns an invalid parameter response for unauthorized clients', async () => {
      // Add reset code
      await app.store().set('password-reset:12345', fixtures.user1.id);

      const res = await request().post('/api/v1/users/password').send({
        clientId: fixtures.unknownId,
        clientSecret: '1234567890',
        password: 'asdfas2342kj!',
        token: '12345',
      });

      expect(res.status).toBe(400);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('returns an invalid parameter response for invalid reset tokens', async () => {
      const res = await request().post('/api/v1/users/password').send({
        clientId: fixtures.client.id,
        clientSecret: fixtures.client.secret,
        password: 'asdfas2342kj',
        token: '00000',
      });

      expect(res.status).toBe(400);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });
});

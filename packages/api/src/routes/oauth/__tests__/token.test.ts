import JWT from 'jsonwebtoken';
import config from '@two/config';
import { AuthGrantType } from '@two/shared';
import { app } from '@app/app';
import { App, AppClient, AppToken, AppUser } from '@app/models';
import {
  auth,
  createFakeApp,
  createFakeClient,
  fixtures,
  request,
  resetDb,
  resetStore,
} from '@test';

async function createApp() {
  const application = await App.query().insert(createFakeApp()).returning('*');
  const client = await AppClient.query()
    .insert(createFakeClient({ appId: application.id, grantType: AuthGrantType.AuthorizationCode }))
    .returning('*');

  await AppUser.query().insert({
    appId: application.id,
    userId: fixtures.user1.id,
    scope: ['user'],
  });

  return { application, client };
}

describe('Routes > OAuth > Token', () => {
  beforeEach(async () => {
    await resetDb();
    await resetStore();
  });

  describe('GET /api/v1/oauth/token', () => {
    test('returns token information', async () => {
      const res = await request().get('/api/v1/oauth/token').use(auth());

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot({
        expiresAt: expect.any(Number),
        expiresIn: expect.any(Number),
      });
    });

    test('does not allow unauthenticated requests', async () => {
      const res = await request().get('/api/v1/oauth/token');
      expect(res.status).toBe(401);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('POST /api/v1/oauth/token', () => {
    test('returns an invalid parameter response for unknown clients', async () => {
      const res = await request().post('/api/v1/oauth/token').send({
        clientId: fixtures.unknownId,
        clientSecret: '1234567890',
        grantType: 'password',
        username: fixtures.user1.email,
        password: 'DLabs2018!',
      });

      expect(res.status).toBe(400);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('returns an invalid parameter response for invalid client secrets', async () => {
      const res = await request().post('/api/v1/oauth/token').send({
        clientId: fixtures.client.id,
        clientSecret: 'INVALID',
        grantType: 'password',
        username: fixtures.user1.email,
        password: 'DLabs2018!',
      });

      expect(res.status).toBe(400);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('returns an invalid parameter response for mismatched grant type', async () => {
      const res = await request().post('/api/v1/oauth/token').send({
        clientId: fixtures.client.id,
        clientSecret: fixtures.client.secret,
        grantType: 'authorization_code',
        code: '12345',
      });

      expect(res.status).toBe(400);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    describe('Authorization Code Grant', () => {
      let application: any;
      let client: any;

      beforeEach(async () => {
        ({ application, client } = await createApp());
      });

      test('returns access and refresh tokens', async () => {
        await app.store().set(`oauth:${client.id}:12345`, fixtures.user1.id);

        const res = await request().post('/api/v1/oauth/token').send({
          clientId: client.id,
          clientSecret: client.secret,
          grantType: 'authorization_code',
          code: '12345',
        });

        expect(res.status).toBe(200);
        expect(res.type).toBe('application/json');
        expect(res.body).toMatchSnapshot({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });

        const accessToken: any = JWT.verify(
          res.body.accessToken,
          config.get('api.auth.secret', ''),
        );

        expect(accessToken.azp).toBe(application.id);
        expect(accessToken.client_id).toBe(client.id);
        expect(accessToken.sub).toBe(fixtures.user1.id);
        expect(accessToken.scope).toBe('user');

        const refreshToken = await AppToken.query()
          .findOne({
            token: Buffer.from(res.body.refreshToken, 'base64'),
          })
          .throwIfNotFound();

        expect(refreshToken).not.toBeNull();
        expect(refreshToken.id).toBe(accessToken.jti);
        expect(refreshToken.appId).toBe(application.id);
        expect(refreshToken.clientId).toBe(client.id);
        expect(refreshToken.userId).toBe(fixtures.user1.id);
        expect(refreshToken.self).toBe(false);
      });

      test('deletes authorization code from cache to avoid replay', async () => {
        await app.store().set(`oauth:${client.id}:12345`, fixtures.user1.id);

        const res = await request().post('/api/v1/oauth/token').send({
          clientId: client.id,
          clientSecret: client.secret,
          grantType: 'authorization_code',
          code: '12345',
        });

        const keys = await app.store().keys(`oauth:${client.id}:*`);
        const value = await app.store().get(`oauth:${client.id}:12345`);

        expect(res.status).toBe(200);
        expect(keys).toHaveLength(0);
        expect(value).toBeNull();
      });

      test('returns an invalid parameter response for invalid codes', async () => {
        const res = await request().post('/api/v1/oauth/token').send({
          clientId: client.id,
          clientSecret: client.secret,
          grantType: 'authorization_code',
          code: '12345',
        });

        expect(res.status).toBe(400);
        expect(res.type).toBe('application/json');
        expect(res.body).toMatchSnapshot();
      });

      test('returns a not authorized response for unauthorized apps', async () => {
        await AppUser.query().where('appId', application.id).del();
        await app.store().set(`oauth:${client.id}:12345`, fixtures.user1.id);

        const res = await request().post('/api/v1/oauth/token').send({
          clientId: client.id,
          clientSecret: client.secret,
          grantType: 'authorization_code',
          code: '12345',
        });

        expect(res.status).toBe(403);
        expect(res.type).toBe('application/json');
        expect(res.body).toMatchSnapshot({ message: expect.any(String) });
        expect(res.body.message).toBe(`App ${application.id} is not authorized`);
      });
    });

    describe('Password Grant', () => {
      test('returns access and refresh tokens', async () => {
        const res = await request().post('/api/v1/oauth/token').send({
          clientId: fixtures.client.id,
          clientSecret: fixtures.client.secret,
          grantType: 'password',
          username: fixtures.user1.email,
          password: 'DLabs2018!',
        });

        expect(res.status).toBe(200);
        expect(res.type).toBe('application/json');
        expect(res.body).toMatchSnapshot({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });

        const accessToken: any = JWT.verify(
          res.body.accessToken,
          config.get('api.auth.secret', ''),
        );

        expect(accessToken.azp).toBe(fixtures.app.id);
        expect(accessToken.client_id).toBe(fixtures.client.id);
        expect(accessToken.sub).toBe(fixtures.user1.id);
        expect(accessToken.scope).toBe('self client');

        const refreshToken = await AppToken.query()
          .findOne({
            token: Buffer.from(res.body.refreshToken, 'base64'),
          })
          .throwIfNotFound();

        expect(refreshToken).not.toBeNull();
        expect(refreshToken.id).toBe(accessToken.jti);
        expect(refreshToken.appId).toBe(fixtures.app.id);
        expect(refreshToken.clientId).toBe(fixtures.client.id);
        expect(refreshToken.userId).toBe(fixtures.user1.id);
        expect(refreshToken.self).toBe(true);
      });

      test('returns an invalid credentials response for invalid usernames/passwords', async () => {
        const res = await request().post('/api/v1/oauth/token').send({
          clientId: fixtures.client.id,
          clientSecret: fixtures.client.secret,
          grantType: 'password',
          username: fixtures.user1.email,
          password: 'invalid_password',
        });

        expect(res.status).toBe(401);
        expect(res.type).toBe('application/json');
        expect(res.body).toMatchSnapshot();
      });
    });

    describe('Refresh Token Grant', () => {
      test('returns access and refresh tokens', async () => {
        const refresh = await AppToken.query()
          .insert({
            appId: fixtures.app.id,
            clientId: fixtures.client.id,
            userId: fixtures.user1.id,
            self: true,
          })
          .returning('*');

        const res = await request()
          .post('/api/v1/oauth/token')
          .send({
            clientId: fixtures.client.id,
            clientSecret: fixtures.client.secret,
            grantType: 'refresh_token',
            refreshToken: refresh.token.toString('base64'),
          });

        expect(res.status).toBe(200);
        expect(res.type).toBe('application/json');
        expect(res.body).toMatchSnapshot({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });

        const accessToken: any = JWT.verify(
          res.body.accessToken,
          config.get('api.auth.secret', ''),
        );

        expect(accessToken.azp).toBe(fixtures.app.id);
        expect(accessToken.client_id).toBe(fixtures.client.id);
        expect(accessToken.sub).toBe(fixtures.user1.id);
        expect(accessToken.scope).toBe('self client');

        const refreshToken = await AppToken.query()
          .findOne({
            token: Buffer.from(res.body.refreshToken, 'base64'),
          })
          .throwIfNotFound();

        expect(refreshToken).not.toBeNull();
        expect(refreshToken.id).toBe(accessToken.jti);
        expect(refreshToken.appId).toBe(fixtures.app.id);
        expect(refreshToken.clientId).toBe(fixtures.client.id);
        expect(refreshToken.userId).toBe(fixtures.user1.id);
        expect(refreshToken.self).toBe(true);
      });

      test('only includes authorized scopes for non-password-grant tokens', async () => {
        const { application, client } = await createApp();
        const refresh = await AppToken.query()
          .insert({
            appId: application.id,
            clientId: client.id,
            userId: fixtures.user1.id,
            self: false,
          })
          .returning('*');

        const res = await request()
          .post('/api/v1/oauth/token')
          .send({
            clientId: client.id,
            clientSecret: client.secret,
            grantType: 'refresh_token',
            refreshToken: refresh.token.toString('base64'),
          });

        expect(res.status).toBe(200);
        expect(res.type).toBe('application/json');
        expect(res.body).toMatchSnapshot({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });

        const accessToken: any = JWT.verify(
          res.body.accessToken,
          config.get('api.auth.secret', ''),
        );

        expect(accessToken.azp).toBe(application.id);
        expect(accessToken.client_id).toBe(client.id);
        expect(accessToken.sub).toBe(fixtures.user1.id);
        expect(accessToken.scope).toBe('user');

        const refreshToken = await AppToken.query()
          .findOne({
            token: Buffer.from(res.body.refreshToken, 'base64'),
          })
          .throwIfNotFound();

        expect(refreshToken).not.toBeNull();
        expect(refreshToken.id).toBe(accessToken.jti);
        expect(refreshToken.appId).toBe(application.id);
        expect(refreshToken.clientId).toBe(client.id);
        expect(refreshToken.userId).toBe(fixtures.user1.id);
        expect(refreshToken.self).toBe(false);
      });

      test('returns an invalid parameter response for invalid tokens', async () => {
        const res = await request()
          .post('/api/v1/oauth/token')
          .send({
            clientId: fixtures.client.id,
            clientSecret: fixtures.client.secret,
            grantType: 'refresh_token',
            refreshToken: Buffer.from('000000000').toString('base64'),
          });

        expect(res.status).toBe(400);
        expect(res.type).toBe('application/json');
        expect(res.body).toMatchSnapshot();
      });
    });
  });

  describe('DELETE /api/v1/oauth/token', () => {
    test('removes the associated refresh token', async () => {
      const refresh = await AppToken.query()
        .insert({
          appId: fixtures.app.id,
          clientId: fixtures.client.id,
          userId: fixtures.user1.id,
        })
        .returning('*');

      const payload = {
        jti: refresh.id,
        sub: fixtures.user1.id,
        azp: fixtures.app.id,
        client_id: fixtures.client.id,
        scope: '',
      };

      const accessToken = JWT.sign(payload, config.get<string>('api.auth.secret', ''), {
        algorithm: config.get('api.auth.algorithm', 'HS256'),
        audience: config.get('api.auth.audience', 'api'),
        issuer: config.get('api.auth.issuer', 'api'),
        expiresIn: 10,
      });

      const res = await request()
        .delete('/api/v1/oauth/token')
        .set('Authorization', `Bearer ${accessToken}`);

      const refreshToken = await AppToken.query().findById(refresh.id);

      expect(res.status).toBe(204);
      expect(refreshToken).toBeUndefined();
    });
  });
});

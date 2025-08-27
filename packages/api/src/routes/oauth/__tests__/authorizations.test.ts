import { AuthGrantType } from '@two/shared';
import { app } from '@app/app';
import { App, AppClient, AppUser } from '@app/models';
import {
  auth,
  createFakeApp,
  createFakeClient,
  fixtures,
  request,
  resetDb,
  resetStore,
} from '@test';

describe('Routes > OAuth > Authorizations', () => {
  let application: App;
  let client: AppClient;

  beforeEach(async () => {
    await resetDb();
    await resetStore();

    application = await App.query().insert(createFakeApp()).returning('*');
    client = await AppClient.query()
      .insert(
        createFakeClient({ appId: application.id, grantType: AuthGrantType.AuthorizationCode }),
      )
      .returning('*');
  });

  describe('GET /api/v1/oauth/authorizations/:appId', () => {
    beforeEach(async () => {
      await AppUser.query().insert({
        appId: application.id,
        userId: fixtures.user1.id,
        scope: ['test'],
      });
    });

    test('retrieves an app authorization', async () => {
      const res = await request().get(`/api/v1/oauth/authorizations/${application.id}`).use(auth());

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot({
        id: expect.any(String),
        appId: expect.any(String),
        app: {
          id: expect.any(String),
        },
      });
    });

    test('does not allow requests without self scope', async () => {
      const res = await request()
        .get(`/api/v1/oauth/authorizations/${application.id}`)
        .use(auth(fixtures.user1.id, ['user']));

      expect(res.status).toBe(403);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('returns a resource not found response for unknown authorizations', async () => {
      const res = await request()
        .get(`/api/v1/oauth/authorizations/${fixtures.unknownId}`)
        .use(auth());

      expect(res.status).toBe(404);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('POST /api/v1/oauth/authorizations/:appId', () => {
    test('generates an OAuth authorization code', async () => {
      const res = await request()
        .post(`/api/v1/oauth/authorizations/${application.id}`)
        .send({ clientId: client.id })
        .use(auth());

      const keys = await app.store().keys(`oauth:${client.id}:*`);
      const value = await app.store().get(keys[0]);

      expect(res.status).toBe(201);
      expect(res.type).toBe('application/json');
      expect(res.body).toEqual({
        appId: application.id,
        clientId: client.id,
        code: expect.any(String),
      });

      expect(keys).toHaveLength(1);
      expect(keys[0]).toBe(`oauth:${client.id}:${res.body.code}`);
      expect(value).toBe(fixtures.user1.id);
    });

    test('returns an invalid parameter response for unknown clients', async () => {
      const res = await request()
        .post(`/api/v1/oauth/authorizations/${application.id}`)
        .send({ clientId: fixtures.unknownId })
        .use(auth());

      expect(res.status).toBe(400);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('returns an invalid parameter response for mismatched app-client pairs', async () => {
      const res = await request()
        .post(`/api/v1/oauth/authorizations/${application.id}`)
        .send({ clientId: fixtures.client.id })
        .use(auth());

      expect(res.status).toBe(400);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('PUT /api/v1/oauth/authorizations/:appId', () => {
    test('creates an app authorization for the authenticated user', async () => {
      const res = await request()
        .put(`/api/v1/oauth/authorizations/${application.id}`)
        .send({ scope: ['user'] })
        .use(auth());

      const authorization = await AppUser.query()
        .findOne({
          appId: application.id,
          userId: fixtures.user1.id,
        })
        .throwIfNotFound();

      expect(res.status).toBe(204);
      expect(authorization.appId).toBe(application.id);
      expect(authorization.userId).toBe(fixtures.user1.id);
      expect(authorization.scope).toEqual(['user']);
    });

    test('updates an existing app authorization', async () => {
      const res = await request()
        .put(`/api/v1/oauth/authorizations/${application.id}`)
        .send({ scope: [] })
        .use(auth());

      const authorization = await AppUser.query()
        .findOne({
          appId: application.id,
          userId: fixtures.user1.id,
        })
        .throwIfNotFound();

      expect(res.status).toBe(204);
      expect(authorization.appId).toBe(application.id);
      expect(authorization.userId).toBe(fixtures.user1.id);
      expect(authorization.scope).toEqual([]);
    });

    test('returns a resource not found response for unknown apps', async () => {
      const res = await request()
        .put(`/api/v1/oauth/authorizations/${fixtures.unknownId}`)
        .send({ scope: [] })
        .use(auth());

      expect(res.status).toBe(404);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });
});

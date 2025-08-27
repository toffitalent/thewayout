import { faker } from '@faker-js/faker';
import { send } from '@two/mail';
import { App, User } from '@app/models';
import { auth, fixtures, request, resetDb } from '@test';

describe('Routes > Users > User', () => {
  beforeEach(async () => {
    await resetDb();

    faker.seed(1);
  });

  describe('GET /api/v1/users/:userId', () => {
    test('retrieves a user', async () => {
      const res = await request()
        .get(`/api/v1/users/${fixtures.user1.id}`)
        .use(auth(fixtures.user2.id));
      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('exposes full user data for owner', async () => {
      const res = await request().get(`/api/v1/users/${fixtures.user1.id}`).use(auth());
      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('exposes full user data for admin requests', async () => {
      const res = await request()
        .get(`/api/v1/users/${fixtures.user1.id}`)
        .use(auth(fixtures.user2.id, ['admin']));

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('does not allow unauthenticated requests', async () => {
      const res = await request().get(`/api/v1/users/${fixtures.user1.id}`);
      expect(res.status).toBe(401);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('returns a resource not found response for unknown users', async () => {
      const res = await request().get(`/api/v1/users/${fixtures.unknownId}`);
      expect(res.status).toBe(404);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('GET /api/v1/user', () => {
    test('retrieves the authenticated user', async () => {
      const res = await request().get('/api/v1/user').use(auth());
      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('does not allow unauthenticated requests', async () => {
      const res = await request().get('/api/v1/user');
      expect(res.status).toBe(401);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('PATCH /api/v1/users/:userId', () => {
    test('updates a user', async () => {
      const patch = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: 'DLabs2018!',
        newPassword: 'asdfas2342kj!',
      };

      const res = await request()
        .patch(`/api/v1/users/${fixtures.user1.id}`)
        .send(patch)
        .use(auth());

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('sends email security emails', async () => {
      await request()
        .patch(`/api/v1/users/${fixtures.user1.id}`)
        .send({ email: 'test@example.com' })
        .use(auth());

      expect(send).toBeCalledTimes(1);
      expect((send as jest.Mock).mock.calls[0][0]).toEqual({
        to: {
          address: 'test@example.com',
          name: `${fixtures.user1.firstName} ${fixtures.user1.lastName}`,
        },
        cc: {
          address: fixtures.user1.email,
          name: `${fixtures.user1.firstName} ${fixtures.user1.lastName}`,
        },
      });
      expect((send as jest.Mock).mock.calls[0][1]).toBe('SecurityEmail');
    });

    test('sends password security emails', async () => {
      await request()
        .patch(`/api/v1/users/${fixtures.user1.id}`)
        .send({ password: 'DLabs2018!', newPassword: 'asdfas2342kj!' })
        .use(auth());

      expect(send).toBeCalledTimes(1);
      expect((send as jest.Mock).mock.calls[0][0].name).toBe(
        `${fixtures.user1.firstName} ${fixtures.user1.lastName}`,
      );
      expect((send as jest.Mock).mock.calls[0][0].email).toBe(fixtures.user1.email);
      expect((send as jest.Mock).mock.calls[0][1]).toBe('SecurityPassword');
    });

    test('does not allow unauthenticated requests', async () => {
      const res = await request().patch(`/api/v1/users/${fixtures.user1.id}`).send({});
      expect(res.status).toBe(401);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('does not allow requests from users without permission', async () => {
      const res = await request()
        .patch(`/api/v1/users/${fixtures.user1.id}`)
        .send({})
        .use(auth(fixtures.user2.id));

      expect(res.status).toBe(403);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('returns a resource not found response for unknown users', async () => {
      const res = await request()
        .patch(`/api/v1/users/${fixtures.unknownId}`)
        .send({})
        .use(auth(fixtures.user1.id, ['admin']));

      expect(res.status).toBe(404);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('returns an invalid parameter response for invalid passwords', async () => {
      const res = await request()
        .patch(`/api/v1/users/${fixtures.user1.id}`)
        .send({
          password: 'invalid_password',
          newPassword: 'asdfas2342kj!',
        })
        .use(auth());

      expect(res.status).toBe(400);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('returns a resource conflict response for duplicate email addresses', async () => {
      const res = await request()
        .patch(`/api/v1/users/${fixtures.user2.id}`)
        .send({
          email: fixtures.user1.email,
        })
        .use(auth(fixtures.user2.id));

      expect(res.status).toBe(409);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('PATCH /api/v1/user', () => {
    test('updates the authenticated user', async () => {
      const patch = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: 'DLabs2018!',
        newPassword: 'asdfas2342kj!',
      };

      const res = await request().patch('/api/v1/user').send(patch).use(auth());
      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('does not allow unauthenticated requests', async () => {
      const res = await request().patch('/api/v1/user').send({});
      expect(res.status).toBe(401);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('DELETE /api/v1/users/:userId', () => {
    test('deletes a user', async () => {
      const res = await request()
        .delete(`/api/v1/users/${fixtures.user3.id}`)
        .use(auth(fixtures.user1.id, ['admin']));

      expect(res.status).toBe(204);

      const user = await User.query().findById(fixtures.user3.id);
      expect(user).toBeUndefined();
    });

    test('does not allow requests from non-admins', async () => {
      const res = await request().delete(`/api/v1/users/${fixtures.user3.id}`).use(auth());
      expect(res.status).toBe(403);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('returns a resource not found response for unknown users', async () => {
      const res = await request()
        .delete(`/api/v1/users/${fixtures.unknownId}`)
        .use(auth(fixtures.user1.id, ['admin']));

      expect(res.status).toBe(404);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('returns a resource conflict response for users with exiting linked resources', async () => {
      await App.query().insert({
        name: 'Test App',
        userId: fixtures.user1.id,
      });

      const res = await request()
        .delete(`/api/v1/users/${fixtures.user1.id}`)
        .use(auth(fixtures.user1.id, ['admin']));

      expect(res.status).toBe(409);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });
});

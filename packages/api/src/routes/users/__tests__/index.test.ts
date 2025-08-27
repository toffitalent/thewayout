import { faker } from '@faker-js/faker';
import { RspRole, UserType } from '@two/shared';
import { RspAccount, RspInvitation } from '@app/models';
// import { send } from '@two/mail';
import { auth, fixtures, request, resetDb } from '@test';

describe('Routes > Users', () => {
  beforeEach(async () => {
    await resetDb();

    faker.seed(1);
  });

  describe('GET /api/v1/users', () => {
    test('lists users', async () => {
      const res = await request()
        .get('/api/v1/users')
        .use(auth(fixtures.user1.id, ['admin']));

      const first = res.body.shift();

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
      expect(first.email).toBe('josh@disruptivelabs.io');
    });

    test('does not allow requests from non-admins', async () => {
      const res = await request().get('/api/v1/users').use(auth());

      expect(res.status).toBe(403);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('POST /api/v1/users', () => {
    test('creates a user', async () => {
      const email = faker.internet.email().toLowerCase();
      const res = await request().post('/api/v1/users').send({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email,
        password: 'h23(bdURM#',
      });

      expect(res.status).toBe(201);
      expect(res.type).toBe('application/json');
      expect(res.header.location).toBe(`/users/${res.body.id}`);
      expect(res.body).toMatchSnapshot({
        id: expect.any(String),
      });

      /* expect(send).toBeCalledTimes(1);
      expect((send as jest.Mock).mock.calls[0][0].name).toBe(
        `${res.body.firstName} ${res.body.lastName}`,
      );
      expect((send as jest.Mock).mock.calls[0][0].email).toBe(email);
      expect((send as jest.Mock).mock.calls[0][1]).toBe('Welcome'); */
    });

    test('returns a resource conflict response for duplicate email addresses', async () => {
      const res = await request().post('/api/v1/users').send({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: fixtures.user1.email,
        password: 'h23(bdURM#',
      });

      expect(res.status).toBe(409);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('creates rsp owner account for user with rsp role', async () => {
      const email = faker.internet.email().toLowerCase();
      const res = await request().post('/api/v1/users').send({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email,
        password: 'h23(bdURM#',
        type: UserType.Rsp,
      });

      const rspAccount = await RspAccount.query()
        .where({ userId: res.body.id })
        .first()
        .throwIfNotFound();

      expect(rspAccount.role).toBe(RspRole.owner);
    });

    test('creates member rsp account for user with rsp role', async () => {
      const email = faker.internet.email().toLowerCase();
      const invitation = await RspInvitation.query().insert({
        rspId: fixtures.rsp1.id,
        email,
      });
      const res = await request().post('/api/v1/users').send({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email,
        password: 'h23(bdURM#',
        type: UserType.Rsp,
        invitationId: invitation.id,
      });

      const rspAccount = await RspAccount.query()
        .where({ userId: res.body.id })
        .first()
        .throwIfNotFound();

      expect(rspAccount.role).toBe(RspRole.member);
    });

    test('returns resource not found response when no invitation exist', async () => {
      const email = faker.internet.email().toLowerCase();
      const res = await request().post('/api/v1/users').send({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email,
        password: 'h23(bdURM#',
        type: UserType.Rsp,
        invitationId: fixtures.rsp1.id,
      });

      expect(res.status).toBe(404);
    });
  });
});

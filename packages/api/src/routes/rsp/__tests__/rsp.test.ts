import { faker } from '@faker-js/faker';
import { send } from '@two/mail';
import { RspAccount, RspInvitation, User } from '@app/models';
import { auth, fixtures, request, resetDb } from '@test';

const { rsp1, user7, user8, rspAccount2 } = fixtures;

describe('Routes > Rsp > Rsp', () => {
  beforeEach(async () => {
    await resetDb();

    faker.seed(1);
  });

  describe('PATCH /rsp/:id', () => {
    test('updates rsp organization', async () => {
      const res = await request()
        .patch(`/api/v1/rsp/${rsp1.id}`)
        .send({ name: 'Test' })
        .use(auth(user7.id, ['rsp']));

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Test');
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('updates rsp organization only by owner', async () => {
      const res = await request()
        .patch(`/api/v1/rsp/${rsp1.id}`)
        .send({ name: 'Test' })
        .use(auth(user8.id, ['rsp']));

      expect(res.status).toBe(400);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('POST /rsp/:id/accounts/invite', () => {
    test('sends invitation', async () => {
      const res = await request()
        .post(`/api/v1/rsp/${rsp1.id}/accounts/invite`)
        .use(auth(user7.id, ['rsp']))
        .send({
          firstName: 'First',
          lastName: 'Last',
          phone: '4142133945',
          email: 'email@test.com',
        });

      const invitation = await RspInvitation.query()
        .where({ email: 'email@test.com' })
        .first()
        .throwIfNotFound();

      expect(send).toBeCalledTimes(1);
      expect((send as jest.Mock).mock.calls[0][0]).toEqual({
        to: {
          address: 'email@test.com',
          name: 'First Last',
        },
      });
      expect((send as jest.Mock).mock.calls[0][1]).toBe('InviteCaseManager');
      expect((send as jest.Mock).mock.calls[0][2]).toStrictEqual({
        firstName: 'First',
        lastName: 'Last',
        phone: '4142133945',
        email: 'email@test.com',
        invitationId: invitation.id,
        rspName: rsp1.name,
      });

      expect(res.status).toBe(204);
    });

    test('only owner can sends invitation', async () => {
      const res = await request()
        .post(`/api/v1/rsp/${rsp1.id}/accounts/invite`)
        .use(auth(user8.id, ['rsp']))
        .send({
          firstName: 'First',
          lastName: 'Last',
          phone: '4142133945',
          email: 'email@test.com',
        });

      expect(send).toBeCalledTimes(0);

      expect(res.status).toBe(400);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('returns a resource conflict response for duplicate invitation', async () => {
      const email = faker.internet.email().toLowerCase();
      await RspInvitation.query().insert({
        rspId: fixtures.rsp1.id,
        email,
      });

      const res = await request()
        .post(`/api/v1/rsp/${rsp1.id}/accounts/invite`)
        .use(auth(user7.id, ['rsp']))
        .send({
          firstName: 'First',
          lastName: 'Last',
          phone: '4142133945',
          email,
        });

      expect(res.status).toBe(409);
    });

    test('returns a invalid request response for duplicate email addresses', async () => {
      const res = await request()
        .post(`/api/v1/rsp/${rsp1.id}/accounts/invite`)
        .use(auth(user7.id, ['rsp']))
        .send({
          firstName: 'First',
          lastName: 'Last',
          phone: '4142133945',
          email: user8.email,
        });

      expect(res.status).toBe(409);
    });
  });

  describe('GET /rsp/:id/invitations', () => {
    test('lists invitations', async () => {
      await RspInvitation.query().insert({
        rspId: fixtures.rsp1.id,
        email: faker.internet.email().toLowerCase(),
      });

      const res = await request()
        .get(`/api/v1/rsp/${rsp1.id}/invitations`)
        .use(auth(user7.id, ['rsp']));

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect({ body: res.body }).toMatchSnapshot({ body: [{ id: expect.any(String) }] });
    });

    test('lists only pending invitations', async () => {
      const email = faker.internet.email().toLowerCase();
      await RspInvitation.query().insert({
        rspId: fixtures.rsp1.id,
        email,
      });
      const newUser = await User.query().insert({ email });
      await RspAccount.query().insert({
        userId: newUser.id,
        rspId: fixtures.rsp1.id,
        isProfileFilled: true,
      });

      const res = await request()
        .get(`/api/v1/rsp/${rsp1.id}/invitations`)
        .use(auth(user7.id, ['rsp']));

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body.length).toBe(0);
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('DELETE /rsp/:id/invitations/:invitationId', () => {
    test('removes invitation', async () => {
      const invitation = await RspInvitation.query().insert({
        rspId: fixtures.rsp1.id,
        email: faker.internet.email().toLowerCase(),
      });

      const res = await request()
        .delete(`/api/v1/rsp/${rsp1.id}/invitations/${invitation.id}`)
        .use(auth(user7.id, ['rsp']));

      const removedInvitation = await RspInvitation.query().findById(invitation.id);
      expect(removedInvitation).toBeUndefined();

      expect(res.status).toBe(204);
    });

    test('removes invitation only for owner', async () => {
      const invitation = await RspInvitation.query().insert({
        rspId: fixtures.rsp1.id,
        email: faker.internet.email().toLowerCase(),
      });

      const res = await request()
        .delete(`/api/v1/rsp/${rsp1.id}/invitations/${invitation.id}`)
        .use(auth(user8.id, ['rsp']));

      expect(res.status).toBe(400);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('GET /rsp/:id/case-managers', () => {
    test('lists case managers', async () => {
      const res = await request()
        .get(`/api/v1/rsp/${rsp1.id}/case-managers`)
        .use(auth(user7.id, ['rsp']));

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('lists case managers only for owner', async () => {
      const res = await request()
        .get(`/api/v1/rsp/${rsp1.id}/case-managers`)
        .use(auth(user8.id, ['rsp']));

      expect(res.status).toBe(400);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('PATCH /rsp/:id/accounts/:id', () => {
    test('updates case manager account', async () => {
      expect(user8.firstName).not.toBe('New');
      const res = await request()
        .patch(`/api/v1/rsp/${rsp1.id}/accounts/${rspAccount2.userId}`)
        .send({ firstName: 'New' })
        .use(auth(user7.id, ['rsp']));

      expect(res.status).toBe(200);
      expect(res.body.firstName).toBe('New');
    });

    test('updates case manager account only by owner', async () => {
      const res = await request()
        .patch(`/api/v1/rsp/${rsp1.id}/accounts/${rspAccount2.userId}`)
        .send({ firstName: 'New' })
        .use(auth(user8.id, ['rsp']));

      expect(res.status).toBe(400);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('GET /rsp/:id/accounts/:userId', () => {
    test('returns rsp account', async () => {
      const res = await request()
        .get(`/api/v1/rsp/${rsp1.id}/accounts/${rspAccount2.userId}`)
        .use(auth(user7.id, ['rsp']));

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('returns rsp account only for owner', async () => {
      const res = await request()
        .get(`/api/v1/rsp/${rsp1.id}/accounts/${rspAccount2.userId}`)
        .use(auth(user8.id, ['rsp']));

      expect(res.status).toBe(400);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('DELETE /rsp/:id/accounts/:userId', () => {
    test('removes rsp account', async () => {
      const res = await request()
        .delete(`/api/v1/rsp/${rsp1.id}/accounts/${rspAccount2.userId}`)
        .use(auth(user7.id, ['rsp']));

      expect(res.status).toBe(204);
    });

    test('removes rsp account only for owner', async () => {
      const res = await request()
        .delete(`/api/v1/rsp/${rsp1.id}/accounts/${rspAccount2.userId}`)
        .use(auth(user8.id, ['rsp']));

      expect(res.status).toBe(400);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });
});

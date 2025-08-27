import { faker } from '@faker-js/faker';
import { auth, fixtures, request, resetDb } from '@test';

const { rsp1, rspAccount2, user7, user8 } = fixtures;

describe('Routes > Rsp > Accounts', () => {
  beforeEach(async () => {
    await resetDb();

    faker.seed(1);
  });

  describe('PUT /rsp/:id/accounts/:userId', () => {
    test('updates rsp member account', async () => {
      const res = await request()
        .put(`/api/v1/rsp/${rsp1.id}/accounts/${rspAccount2.userId}`)
        .use(auth(user8.id, ['rsp']))
        .send({ phone: '4142133945' });

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('only updates account by selfs', async () => {
      const res = await request()
        .put(`/api/v1/rsp/${rsp1.id}/${rspAccount2.userId}/accounts`)
        .use(auth(user7.id, ['rsp']))
        .send({ phone: '4142133945' });

      expect(res.status).toBe(404);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('GET /rsp/:id/accounts/case-managers', () => {
    test('list case manager names', async () => {
      const res = await request()
        .get(`/api/v1/rsp/${rsp1.id}/accounts/case-managers`)
        .use(auth(user8.id, ['rsp']));

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });
});

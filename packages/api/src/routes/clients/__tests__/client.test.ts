import { faker } from '@faker-js/faker';
import { RspClient } from '@app/models/RspClient';
import { auth, fixtures, request, resetDb } from '@test';

describe('Routes > Clients > client', () => {
  beforeEach(async () => {
    await resetDb();

    faker.seed(1);
  });

  describe('DELETE /api/v1/clients/:id/rsp', () => {
    test('remove rsp client relation', async () => {
      const existingRspClient = await RspClient.query()
        .where({ userId: fixtures.user4.id })
        .first();
      expect(existingRspClient).not.toBeUndefined();

      const res = await request()
        .delete(`/api/v1/clients/${fixtures.clientProfile1.id}/rsp`)
        .use(auth(fixtures.user1.id, ['admin']));

      expect(res.status).toBe(204);
      expect(res.body).toMatchSnapshot();

      const removedRspClient = await RspClient.query().where({ userId: fixtures.user4.id }).first();
      expect(removedRspClient).toBeUndefined();
    });

    test('does not allow request from non-admins', async () => {
      const res = await request()
        .delete(`/api/v1/clients/${fixtures.clientProfile1.id}/rsp`)
        .use(auth());

      expect(res.status).toBe(403);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('PATCH /clients/:id', () => {
    test('updates client profile', async () => {
      const res1 = await request()
        .patch(`/api/v1/clients/${fixtures.clientProfile1.id}`)
        .send({
          relativeExperience: [
            {
              startAtMonth: 'May',
              startAtYear: '2015',
              endAtMonth: '5',
              endAtYear: '2016',
            },
          ],
        })
        .use(auth(fixtures.user4.id, ['client']));
      expect(res1.status).toBe(400);

      const res2 = await request()
        .patch(`/api/v1/clients/${fixtures.clientProfile1.id}`)
        .send({
          relativeExperience: [
            {
              startAtMonth: '5',
              startAtYear: '2015',
              endAtMonth: '5',
              endAtYear: '2016',
            },
          ],
        })
        .use(auth(fixtures.user4.id, ['client']));
      expect(res2.status).toBe(200);
    });
  });
});

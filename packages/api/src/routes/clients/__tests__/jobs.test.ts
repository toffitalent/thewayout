import { faker } from '@faker-js/faker';
import { auth, fixtures, request, resetDb } from '@test';

describe('Routes > Clients > jobs', () => {
  beforeEach(async () => {
    await resetDb();

    faker.seed(1);
  });

  describe('GET /api/v1/clients/:id/jobs', () => {
    test('return jobs', async () => {
      const res = await request()
        .get(`/api/v1/clients/${fixtures.user4.id}/jobs`)
        .use(auth(fixtures.user4.id, ['client']));

      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });

    test('returns a resource not found response for client without profile', async () => {
      const res = await request()
        .get(`/api/v1/clients/${fixtures.user1.id}/jobs`)
        .use(auth(fixtures.user1.id, ['client'])); // user1 is client without profile

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/clients/:id/jobs/suggested', () => {
    test('return suggested jobs', async () => {
      const res = await request()
        .get(`/api/v1/clients/${fixtures.clientProfile1.id}/jobs/suggested`)
        .use(auth(fixtures.user4.id, ['client']));

      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });

    test('return 400 for not authorized client', async () => {
      const res = await request()
        .get(`/api/v1/clients/${fixtures.clientProfile1.id}/jobs/suggested`)
        .use(auth(fixtures.user3.id, ['client']));

      expect(res.status).toBe(400);
    });

    test('return suggested jobs for veteran', async () => {
      const res = await request()
        .get(`/api/v1/clients/${fixtures.clientProfileVeteran2.id}/jobs/suggested`)
        .use(auth(fixtures.userClientVeteran2.id, ['client']));

      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });
  });
});

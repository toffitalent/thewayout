import { faker } from '@faker-js/faker';
import { auth, fixtures, request, resetDb } from '@test';

describe('Routes > Employers > employer', () => {
  beforeEach(async () => {
    await resetDb();

    faker.seed(1);
  });

  describe('PATCH /api/v1/employers/:id', () => {
    test('updates employer profile', async () => {
      const res = await request()
        .patch(`/api/v1/employers/${fixtures.employer1.id}`)
        .send({
          name: 'Test',
          availableJobsCount: 10,
          availableProfilesUncloak: 10,
        })
        .use(auth(fixtures.user6.id, ['employer']));

      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
      // limits can be update only by admin
      expect(res.body.availableJobsCount).not.toBe(10);
      expect(res.body.availableProfilesUncloak).not.toBe(10);
    });

    test('return not found error for not authorized employer', async () => {
      const res = await request()
        .patch(`/api/v1/employers/${fixtures.employer1.id}`)
        .send({
          name: 'Test',
        })
        .use(auth(fixtures.user5.id, ['employer']));

      expect(res.status).toBe(404);
    });

    test('updates employer limits by admin', async () => {
      const res = await request()
        .patch(`/api/v1/employers/${fixtures.employer1.id}`)
        .send({
          availableJobsCount: 10,
          availableProfilesUncloak: 10,
        })
        .use(auth(fixtures.user1.id, ['admin']));

      expect(res.status).toBe(200);
      expect(res.body.availableJobsCount).toBe(10);
      expect(res.body.availableProfilesUncloak).toBe(10);
      expect(res.body).toMatchSnapshot();
    });

    test('does not allow update limit from non-admins', async () => {
      const res = await request()
        .patch(`/api/v1/employers/${fixtures.employer1.id}`)
        .send({
          availableJobsCount: 10,
          availableProfilesUncloak: 10,
        })
        .use(auth());

      expect(res.status).toBe(403);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });
});

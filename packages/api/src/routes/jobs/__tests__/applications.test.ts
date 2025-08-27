import { faker } from '@faker-js/faker';
import { JusticeStatus, OffenseCategory, VeteranOrJustice } from '@two/shared';
import { Client, Job, JobApplication } from '@app/models';
import {
  auth,
  createFakeApplication,
  createFakeClientProfile,
  createFakeJob,
  fixtures,
  request,
  resetDb,
} from '@test';

describe('Routes > Jobs > Applications', () => {
  beforeEach(async () => {
    await resetDb();

    faker.seed(1);
  });

  describe('POST /api/v1/jobs/:jobId/applications', () => {
    test('creates a applications', async () => {
      const res = await request()
        .post(`/api/v1/jobs/${fixtures.job3.id}/applications`)
        .use(auth(fixtures.user4.id, ['client']));

      expect(res.status).toBe(200);
    });

    test('returns error when client already applied to job', async () => {
      const res = await request()
        .post(`/api/v1/jobs/${fixtures.job1.id}/applications`)
        .use(auth(fixtures.user4.id, ['client']));

      expect(res.status).toBe(409);
    });

    test('returns a resource not found response for client without profile', async () => {
      const res = await request()
        .post(`/api/v1/jobs/${fixtures.job1.id}/applications`)
        .use(auth(fixtures.user1.id, ['client'])); // user1 is client without profile

      expect(res.status).toBe(400);
    });

    test('returns error when job does not allow client offenses', async () => {
      await Client.query().insert(
        createFakeClientProfile({
          userId: fixtures.user2.id,
          offense: [OffenseCategory.arson, OffenseCategory.burglary],
        }),
      );
      const job1 = createFakeJob({
        employerId: fixtures.employer1.id,
        offenses: [OffenseCategory.arson],
      });
      const job2 = createFakeJob({
        employerId: fixtures.employer1.id,
        offenses: [OffenseCategory.arson, OffenseCategory.burglary, OffenseCategory.distribution],
      });

      await Job.query().insert([job1, job2]);

      const res1 = await request()
        .post(`/api/v1/jobs/${job1.id}/applications`)
        .use(auth(fixtures.user2.id, ['client']));

      expect(res1.status).toBe(400);

      const res2 = await request()
        .post(`/api/v1/jobs/${job2.id}/applications`)
        .use(auth(fixtures.user2.id, ['client']));

      expect(res2.status).toBe(200);
    });

    test('returns error when job does not allow justice or veteran status', async () => {
      await Client.query().insert(
        createFakeClientProfile({
          userId: fixtures.user2.id,
          veteranOrJustice: [VeteranOrJustice.veteran],
          offense: [OffenseCategory.arson],
        }),
      );
      const job1 = createFakeJob({
        employerId: fixtures.employer1.id,
        veteranOrJustice: [VeteranOrJustice.justiceImpacted],
        offenses: [OffenseCategory.arson],
      });
      const job2 = createFakeJob({
        employerId: fixtures.employer1.id,
        veteranOrJustice: [VeteranOrJustice.justiceImpacted, VeteranOrJustice.veteran],
        offenses: [OffenseCategory.arson],
      });
      const job3 = createFakeJob({
        employerId: fixtures.employer1.id,
        veteranOrJustice: [VeteranOrJustice.veteran],
        offenses: [OffenseCategory.arson],
      });

      await Job.query().insert([job1, job2, job3]);

      const res1 = await request()
        .post(`/api/v1/jobs/${job1.id}/applications`)
        .use(auth(fixtures.user2.id, ['client']));

      expect(res1.status).toBe(400);

      const res2 = await request()
        .post(`/api/v1/jobs/${job2.id}/applications`)
        .use(auth(fixtures.user2.id, ['client']));

      expect(res2.status).toBe(200);

      const res3 = await request()
        .post(`/api/v1/jobs/${job3.id}/applications`)
        .use(auth(fixtures.user2.id, ['client']));

      expect(res3.status).toBe(200);
    });

    test('returns error when client reached application limit', async () => {
      const newClient = await Client.query().insert(
        createFakeClientProfile({ userId: fixtures.user2.id }),
      );
      const application1 = createFakeApplication(fixtures.job1.id, newClient.id);
      const application2 = createFakeApplication(fixtures.job2.id, newClient.id);
      await JobApplication.query().insert([application1, application2]);

      const res1 = await request()
        .post(`/api/v1/jobs/${fixtures.job3.id}/applications`)
        .use(auth(fixtures.user2.id, ['client']));
      expect(res1.status).toBe(200);

      const res2 = await request()
        .post(`/api/v1/jobs/${fixtures.job4.id}/applications`)
        .use(auth(fixtures.user2.id, ['client']));
      expect(res2.status).toBe(429);
    });

    test('returns error when client has currently incarcerated justice status', async () => {
      await Client.query().insert(
        createFakeClientProfile({
          userId: fixtures.user2.id,
          justiceStatus: JusticeStatus.currentlyIncarcerated,
        }),
      );

      const res = await request()
        .post(`/api/v1/jobs/${fixtures.job1.id}/applications`)
        .use(auth(fixtures.user2.id, ['client']));

      expect(res.status).toBe(400);
    });
  });
});

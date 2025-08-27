import { faker } from '@faker-js/faker';
import { JobApplicationStatus } from '@two/shared';
import { Client, Employer } from '@app/models';
import * as Slack from '@app/services/Slack';
import {
  auth,
  createFakeClientProfile,
  createFakeEmployer,
  fixtures,
  request,
  resetDb,
} from '@test';

jest.mock('@app/services/Slack');

describe('Routes > Employers > jobs', () => {
  beforeEach(async () => {
    await resetDb();

    faker.seed(1);
  });

  describe('GET /api/v1/employers/:id/jobs', () => {
    test('return jobs', async () => {
      const res = await request()
        .get(`/api/v1/employers/${fixtures.user6.id}/jobs`)
        .use(auth(fixtures.user6.id, ['employer']));

      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });

    test('wrong user id - return 403', async () => {
      const res = await request()
        .get(`/api/v1/employers/${fixtures.user4.id}/jobs`)
        .use(auth(fixtures.user5.id, ['employer']));

      expect(res.status).toBe(403);
    });

    test('returns a resource not found response for employer without profile', async () => {
      const res = await request()
        .get(`/api/v1/employers/${fixtures.user5.id}/jobs`)
        .use(auth(fixtures.user5.id, ['employer'])); // user5 is employer without profile

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/employers/:id/jobs/:jobId/applications', () => {
    test('returns job applications', async () => {
      const res = await request()
        .get(`/api/v1/employers/${fixtures.user6.id}/jobs/${fixtures.job1.id}/applications`)
        .use(auth(fixtures.user6.id, ['employer']));

      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });

    test('returns job applications with page', async () => {
      const res = await request()
        .get(`/api/v1/employers/${fixtures.user6.id}/jobs/${fixtures.job1.id}/applications`)
        .query({ page: 1 })
        .use(auth(fixtures.user6.id, ['employer']));

      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });

    test('returns 403 when the job is not owned by the employer', async () => {
      const res = await request()
        .get(`/api/v1/employers/${fixtures.user6.id}/jobs/${fixtures.job1.id}/applications`)
        .use(auth(fixtures.user5.id, ['employer']));

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/v1/employers/:id/jobs/:jobId/applications/:clientId', () => {
    test('returns client information', async () => {
      const res = await request()
        .get(
          `/api/v1/employers/${fixtures.employer1.id}/jobs/${fixtures.job1.id}/applications/${fixtures.clientProfile1.id}`,
        )
        .use(auth(fixtures.user6.id, ['employer']));

      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });

    test('not returns client information if not apply to employer job', async () => {
      const newClient = await Client.query()
        .insert(createFakeClientProfile({ userId: fixtures.user2.id }))
        .returning('*');
      const res = await request()
        .get(
          `/api/v1/employers/${fixtures.user6.id}/jobs/${fixtures.job1.id}/applications/${newClient.id}`,
        )
        .use(auth(fixtures.user6.id, ['employer']));

      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/v1/employers/:id/jobs/:jobId/applications/:clientId', () => {
    test('change application status', async () => {
      const res = await request()
        .patch(
          `/api/v1/employers/${fixtures.employer1.id}/jobs/${fixtures.job1.id}/applications/${fixtures.application1.id}`,
        )
        .send({ status: JobApplicationStatus.interview })
        .use(auth(fixtures.user6.id, ['employer']));

      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });

    test('returns 403 when the job is not owned by the employer', async () => {
      const newEmployer = await Employer.query().insert(
        createFakeEmployer({ userId: fixtures.user5.id }),
      );
      const res = await request()
        .patch(
          `/api/v1/employers/${newEmployer.id}/jobs/${fixtures.job1.id}/applications/${fixtures.application1.id}`,
        )
        .send({ status: JobApplicationStatus.interview })
        .use(auth(fixtures.user5.id, ['employer']));

      expect(res.status).toBe(403);
    });

    test('returns 403 when the employer is not authorized', async () => {
      const res = await request()
        .patch(
          `/api/v1/employers/${fixtures.employer1.id}/jobs/${fixtures.job1.id}/applications/${fixtures.application1.id}`,
        )
        .send({ status: JobApplicationStatus.interview })
        .use(auth(fixtures.user5.id, ['employer']));

      expect(res.status).toBe(403);
    });

    test('return 402 when exceeded limit of profiles uncloak', async () => {
      await request()
        .patch(
          `/api/v1/employers/${fixtures.employer1.id}/jobs/${fixtures.job1.id}/applications/${fixtures.application1.id}`,
        )
        .send({ status: JobApplicationStatus.interview })
        .use(auth(fixtures.user6.id, ['employer']));
      await request()
        .patch(
          `/api/v1/employers/${fixtures.employer1.id}/jobs/${fixtures.job2.id}/applications/${fixtures.application2.id}`,
        )
        .send({ status: JobApplicationStatus.interview })
        .use(auth(fixtures.user6.id, ['employer']));
      const res1 = await request()
        .patch(
          `/api/v1/employers/${fixtures.employer1.id}/jobs/${fixtures.job3.id}/applications/${fixtures.application3.id}`,
        )
        .send({ status: JobApplicationStatus.interview })
        .use(auth(fixtures.user6.id, ['employer']));
      expect(res1.status).toBe(200);

      const res2 = await request()
        .patch(
          `/api/v1/employers/${fixtures.employer1.id}/jobs/${fixtures.job4.id}/applications/${fixtures.application4.id}`,
        )
        .send({ status: JobApplicationStatus.interview })
        .use(auth(fixtures.user6.id, ['employer']));
      expect(res2.status).toBe(402);
      expect(Slack.alert).toBeCalledWith(
        `User ${fixtures.user6.id} exceeded limit of profile uncloak`,
      );
    });
  });
});

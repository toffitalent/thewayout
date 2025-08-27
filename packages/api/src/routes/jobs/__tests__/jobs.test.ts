import { JobStatus } from '@two/shared';
import { auth, fixtures, request } from '@test';

describe('GET /api/v1/jobs/:jobId', () => {
  test('get a job as a client without application', async () => {
    const res = await request()
      .get(`/api/v1/jobs/${fixtures.job1.id}`)
      .use(auth(fixtures.user1.id, ['client']));

    expect(res.status).toBe(200);
    expect(res.body.applications).toBeUndefined();
  });

  test('get a job as a client with application', async () => {
    const res = await request()
      .get(`/api/v1/jobs/${fixtures.job1.id}`)
      .use(auth(fixtures.user4.id, ['client']));

    expect(res.status).toBe(200);
    expect(res.body.applications.length).toBe(1);
    expect(
      res.body.applications.filter(
        (application: any) => application.clientId === fixtures.clientProfile1.id,
      ).length,
    ).toBe(1);
  });

  test('get a job as a employer', async () => {
    const res = await request()
      .get(`/api/v1/jobs/${fixtures.job1.id}`)
      .use(auth(fixtures.user5.id, ['employer']));

    expect(res.status).toBe(200);
    expect(res.body.applications).toBeUndefined();
  });
});

describe('PATCH /api/v1/jobs/:jobId', () => {
  test('updates job', async () => {
    const res = await request()
      .patch(`/api/v1/jobs/${fixtures.job1.id}`)
      .send({
        status: JobStatus.paused,
      })
      .use(auth(fixtures.user6.id, ['employer']));

    expect(res.status).toBe(200);
    expect(res.body).toMatchSnapshot();
  });

  test('return error when its not employer job', async () => {
    const res = await request()
      .patch(`/api/v1/jobs/${fixtures.job1.id}`)
      .send({
        status: JobStatus.paused,
      })
      .use(auth(fixtures.user5.id, ['employer']));

    expect(res.status).toBe(403);
  });
});

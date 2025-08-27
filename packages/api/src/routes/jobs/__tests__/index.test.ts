import { faker } from '@faker-js/faker';
import {
  Experience,
  JobSalaries,
  OffenseCategory,
  TypeOfWork,
  UserType,
  VeteranOrJustice,
  WorkingTime,
} from '@two/shared';
import { Client, Employer, Job, User } from '@app/models';
import {
  auth,
  createFakeClientProfile,
  createFakeEmployer,
  createFakeJob,
  fixtures,
  request,
  resetDb,
} from '@test';

describe('Routes > Jobs', () => {
  beforeEach(async () => {
    await resetDb();

    faker.seed(1);
  });

  describe('POST /api/v1/jobs', () => {
    const requestData = {
      title: 'ABC',
      description: 'ABCdesc',
      department: 'department',
      startDate: 'startDate',
      typeOfWork: TypeOfWork.hybrid,
      workingTime: WorkingTime.fullTime,
      experience: Experience.entry,
      numberOfOpenPositions: 3,
      responsibilities: ['responsibilities'],
      skillsDescription: 'skillsDescription',
      salaryOptions: {
        salary: JobSalaries.hourly,
        min: '30',
        max: '50',
        description: 'description',
        bonuses: ['bonuses'],
      },
      veteranOrJustice: [VeteranOrJustice.justiceImpacted],
    };

    test('create an job', async () => {
      const res = await request()
        .post('/api/v1/jobs')
        .use(auth(fixtures.user6.id, ['employer']))
        .send(requestData);

      expect(res.status).toBe(200);
      expect(res.body.employer.availableJobsCount).toBe(0);
    });

    test('return 403 for users who is not employer', async () => {
      const res = await request()
        .post('/api/v1/employers')
        .use(auth(fixtures.user4.id, ['client']))
        .send(requestData);

      expect(res.status).toBe(403);
    });

    test('return validation error', async () => {
      const r = { ...requestData };
      r.title = '';
      const res = await request()
        .post('/api/v1/employers')
        .use(auth(fixtures.user4.id, ['employer']))
        .send(requestData);

      expect(res.status).toBe(400);
    });

    test('returns a resource not found response for employer without profile', async () => {
      const res = await request()
        .post('/api/v1/jobs')
        .use(auth(fixtures.user5.id, ['employer'])) // user5 is employer without profile
        .send(requestData);

      expect(res.status).toBe(400);
    });

    test('return 402 when exceeded limit of job creation', async () => {
      const newUser = await User.query()
        .insert({
          firstName: 'Test',
          lastName: 'User',
          roles: [UserType.Employer],
          email: 'test@test.com',
          password: 'DLabs2018!',
        })
        .returning('*');
      await Employer.query().insert({
        ...createFakeEmployer({ userId: newUser.id, availableJobsCount: 0 }),
      });

      const res2 = await request()
        .post('/api/v1/jobs')
        .use(auth(newUser.id, ['employer']))
        .send(requestData);
      expect(res2.status).toBe(402);
    });
  });

  describe('GET /api/v1/jobs', () => {
    test('get all jobs', async () => {
      const res = await request()
        .get(`/api/v1/jobs`)
        .use(auth(fixtures.user1.id, ['client']));

      expect(res.status).toBe(200);
    });

    test('returns job does allow client offenses', async () => {
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

      const res = await request()
        .get(`/api/v1/jobs`)
        .use(auth(fixtures.user2.id, ['client']));

      expect(res.body.find((el: Job) => el.id === job1.id)).toBeUndefined();
      expect(res.body.find((el: Job) => el.id === job2.id)).toBeDefined();
    });
  });
});

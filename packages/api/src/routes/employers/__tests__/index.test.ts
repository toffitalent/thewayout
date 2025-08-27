import { faker } from '@faker-js/faker';
import { Industry, NumberOfEmployers, State, YearsInBusiness } from '@two/shared';
import { Employer } from '@app/models/Employer';
import { auth, fixtures, request, resetDb } from '@test';

describe('Routes > Employers', () => {
  beforeEach(async () => {
    await resetDb();

    faker.seed(1);
  });

  describe('POST /api/v1/employers', () => {
    const requestData = {
      name: 'ABC',
      industry: Industry.accounting,
      description: 'Test descriptions',
      yearsInBusiness: YearsInBusiness['0-3'],
      numberOfEmployees: NumberOfEmployers['1-50'],
      address: 'Test',
      city: 'Los Angeles',
      state: State.CA,
      postalCode: '90255',
    };

    test('creates a employer', async () => {
      const res = await request()
        .post('/api/v1/employers')
        .use(auth(fixtures.user5.id, ['employer']))
        .send(requestData);

      expect(res.status).toBe(200);
    });

    test('returns a resource conflict response for users with exiting employer profile', async () => {
      await Employer.query().insert({ ...requestData, userId: fixtures.user5.id });
      const res = await request()
        .post('/api/v1/employers')
        .use(auth(fixtures.user5.id, ['employer']))
        .send(requestData);

      expect(res.status).toBe(409);
    });
  });
});

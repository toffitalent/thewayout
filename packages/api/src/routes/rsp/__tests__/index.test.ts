import { faker } from '@faker-js/faker';
import { JusticeStatus, OffenseCategory, Support, VeteranOrJustice } from '@two/shared';
import { auth, fixtures, request, resetDb } from '@test';

describe('Routes > Rsp', () => {
  beforeEach(async () => {
    await resetDb();

    faker.seed(1);
  });

  describe('POST /api/v1/rsp', () => {
    const data = {
      name: 'Organization Name',
      description: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      phone: '',
      email: '',
      servicesArea: [],
      support: [Support.basicHygieneSupport],
      veteranOrJustice: [VeteranOrJustice.justiceImpacted],
      justiceStatus: [JusticeStatus.extendedSupervision],
      offenses: [OffenseCategory.arson],
      owner: {
        phone: '',
        position: '',
      },
    };

    test('creates rsp organization and updates owner account', async () => {
      expect(fixtures.rspAccount3.isProfileFilled).toBeFalsy();

      const invalidRes = await request()
        .post('/api/v1/rsp')
        .use(auth(fixtures.user9.id, ['rsp']))
        .send({ ...data, justiceStatus: undefined, offenses: undefined });
      expect(invalidRes.status).toBe(400);

      const res = await request()
        .post('/api/v1/rsp')
        .use(auth(fixtures.user9.id, ['rsp']))
        .send(data);

      expect(res.status).toBe(200);
      expect(res.body.owner.isProfileFilled).toBeTruthy();
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot({
        rsp: {
          id: expect.any(String),
        },
        owner: {
          id: expect.any(String),
          rspId: expect.any(String),
          rsp: {
            id: expect.any(String),
          },
        },
      });
    });

    test('creates rsp organization only with unique name', async () => {
      const res = await request()
        .post('/api/v1/rsp')
        .use(auth(fixtures.user7.id, ['rsp']))
        .send({ ...data, name: fixtures.rsp1.name });

      expect(res.status).toBe(409);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('creates rsp organization only by owner account', async () => {
      const res = await request()
        .post('/api/v1/rsp')
        .use(auth(fixtures.user8.id, ['rsp']))
        .send(data);

      expect(res.status).toBe(404);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('creates rsp organization - allowed veteran client type and updates owner account', async () => {
      expect(fixtures.rspAccount3.isProfileFilled).toBeFalsy();

      const res = await request()
        .post('/api/v1/rsp')
        .use(auth(fixtures.user9.id, ['rsp']))
        .send({
          ...data,
          veteranOrJustice: [VeteranOrJustice.veteran],
          justiceStatus: undefined,
          offenses: undefined,
        });

      expect(res.status).toBe(200);
      expect(res.body.owner.isProfileFilled).toBeTruthy();
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot({
        rsp: {
          id: expect.any(String),
        },
        owner: {
          id: expect.any(String),
          rspId: expect.any(String),
          rsp: {
            id: expect.any(String),
          },
        },
      });
    });
  });
});

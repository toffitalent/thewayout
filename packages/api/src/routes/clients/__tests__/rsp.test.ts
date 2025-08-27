import { faker } from '@faker-js/faker';
import { OffenseCategory, Support } from '@two/shared';
import { Rsp } from '@app/models';
import { auth, fixtures, request, resetDb } from '@test';

const rsps = [
  {
    name: '1',
    offenses: [OffenseCategory.arson],
    support: [Support.basicTechSkills],
    servicesArea: ['Adams'],
  },
  {
    name: '2',
    offenses: [OffenseCategory.bailJumping],
    support: [Support.childCare],
    servicesArea: ['Douglas'],
  },
  {
    name: '3',
    offenses: [OffenseCategory.diuDwi],
    support: [Support.employment],
    servicesArea: ['Pepin'],
  },
];

describe('Routes > Clients > Rsp', () => {
  beforeEach(async () => {
    await resetDb();

    faker.seed(1);
  });

  describe('GET /api/v1/clients/:id/rsp', () => {
    beforeEach(async () => {
      await Rsp.query().insert(rsps);
    });

    test('list rsp for clients', async () => {
      const res = await request()
        .get(`/api/v1/clients/${fixtures.clientProfile1.id}/rsp`)
        .use(auth(fixtures.user4.id, ['client']))
        .query({
          support: [Support.clothing],
          offenses: [OffenseCategory.burglary],
          county: 'Adams',
        });

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('lists all rsp when no filters added', async () => {
      const res = await request()
        .get(`/api/v1/clients/${fixtures.clientProfile1.id}/rsp`)
        .use(auth(fixtures.user4.id, ['client']));

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(5);
    });

    test('lists only rsp that match client offenses', async () => {
      const res1 = await request()
        .get(`/api/v1/clients/${fixtures.clientProfile1.id}/rsp`)
        .use(auth(fixtures.user4.id, ['client']))
        .query({
          offenses: [OffenseCategory.arson],
        });

      expect(res1.status).toBe(200);
      expect(res1.body.length).toBe(1);
      expect(res1.body[0].name).toBe('1');
      expect({ body: res1.body }).toMatchSnapshot({ body: [{ id: expect.any(String) }] });

      const res2 = await request()
        .get(`/api/v1/clients/${fixtures.clientProfile1.id}/rsp`)
        .use(auth(fixtures.user4.id, ['client']))
        .query({
          offenses: [OffenseCategory.arson, OffenseCategory.embezzlement],
        });

      expect(res2.status).toBe(200);
      expect(res2.body.length).toBe(0);
      expect(res2.body).toMatchSnapshot();
    });

    test('lists only rsp that match client county', async () => {
      const res = await request()
        .get(`/api/v1/clients/${fixtures.clientProfile1.id}/rsp`)
        .use(auth(fixtures.user4.id, ['client']))
        .query({
          county: 'Douglas',
        });

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('2');
      expect({ body: res.body }).toMatchSnapshot({ body: [{ id: expect.any(String) }] });
    });

    test('lists only rsp that match client support', async () => {
      const res = await request()
        .get(`/api/v1/clients/${fixtures.clientProfile1.id}/rsp`)
        .use(auth(fixtures.user4.id, ['client']))
        .query({
          support: [Support.employment, Support.domesticViolence],
        });

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('3');
      expect({ body: res.body }).toMatchSnapshot({ body: [{ id: expect.any(String) }] });
    });
  });
});

import { faker } from '@faker-js/faker';
import { Knex } from 'knex';
import { send } from '@two/mail';
import { RspClientStatus, StatCategory, StateFederal, Support } from '@two/shared';
import { Client } from '@app/models';
import { RspClient } from '@app/models/RspClient';
import { auth, fixtures, request, resetDb } from '@test';

const { rsp1, rsp2, user7, user8, user14, rspClient1, rspAccount2, user3 } = fixtures;

describe('Routes > Rsp > Clients', () => {
  beforeEach(async () => {
    await resetDb();

    faker.seed(1);
  });

  describe('GET /rsp/:id/clients', () => {
    test('list rsp clients', async () => {
      const res = await request()
        .get(`/api/v1/rsp/${rsp1.id}/clients`)
        .use(auth(user7.id, ['rsp']));

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('list rsp clients with filters', async () => {
      const res = await request()
        .get(`/api/v1/rsp/${rsp1.id}/clients`)
        .query({ support: Support.basicHygieneSupport })
        .use(auth(user7.id, ['rsp']));

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('list rsp clients with status pending', async () => {
      const res = await request()
        .get(`/api/v1/rsp/${rsp1.id}/clients`)
        .query({ status: RspClientStatus.pending })
        .use(auth(user7.id, ['rsp']));

      expect(res.status).toBe(200);
      const clientsWithActiveStatus: RspClient[] = res.body.filter(
        (client: RspClient) => client.status === RspClientStatus.active,
      );
      clientsWithActiveStatus.forEach((el) =>
        expect(el).toEqual(expect.objectContaining({ caseManagerId: null })),
      );
    });
  });

  describe('GET /rsp/:id/clients/:clientId', () => {
    test('returns rsp client', async () => {
      const res = await request()
        .get(`/api/v1/rsp/${rsp1.id}/clients/${rspClient1.id}`)
        .use(auth(user7.id, ['rsp']));

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('returns rsp client information only to assigned case manager', async () => {
      const res = await request()
        .get(`/api/v1/rsp/${rsp1.id}/clients/${rspClient1.id}`)
        .use(auth(user8.id, ['rsp']));

      expect(res.status).toBe(404);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('PATCH /rsp/:id/clients/:clientId', () => {
    test('updates rsp client status', async () => {
      expect(rspClient1.status).toBe(RspClientStatus.pending);

      const res = await request()
        .patch(`/api/v1/rsp/${rsp1.id}/clients/${rspClient1.id}`)
        .send({ status: RspClientStatus.active })
        .use(auth(user7.id, ['rsp']));

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(RspClientStatus.active);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('updates rsp client status to closed with date', async () => {
      const rspClient = await RspClient.query().findById(rspClient1.id).throwIfNotFound();
      expect(rspClient.closedAt).toBeNull();

      const res = await request()
        .patch(`/api/v1/rsp/${rsp1.id}/clients/${rspClient1.id}`)
        .send({ status: RspClientStatus.closed })
        .use(auth(user7.id, ['rsp']));

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(RspClientStatus.closed);
      expect(res.type).toBe('application/json');

      const updatedRspClient = await RspClient.query().findById(rspClient1.id).throwIfNotFound();
      expect(updatedRspClient.closedAt).not.toBeNull();
    });
  });

  describe('PATCH /rsp/:id/clients/:clientId/case-manager', () => {
    test('assigns rsp client case manager', async () => {
      expect(rspClient1.caseManagerId).toBeUndefined();

      const res = await request()
        .patch(`/api/v1/rsp/${rsp1.id}/clients/${rspClient1.id}/case-manager`)
        .send({ caseManagerId: rspAccount2.id })
        .use(auth(user7.id, ['rsp']));

      expect(send).toBeCalledTimes(1);
      expect((send as jest.Mock).mock.calls[0][0]).toEqual({
        to: {
          address: user8.email,
          name: `${user8.firstName} ${user8.lastName}`,
        },
      });
      expect((send as jest.Mock).mock.calls[0][1]).toBe('AssignCaseManager');
      expect((send as jest.Mock).mock.calls[0][2]).toStrictEqual({
        firstName: user8.firstName,
        rspName: rsp1.name,
        rspClientId: rspClient1.id,
        client: {
          firstName: user3.firstName,
          lastName: user3.lastName,
        },
      });

      expect(res.status).toBe(200);
      expect(res.body.caseManagerId).toBe(rspAccount2.id);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('assigns rsp client case manager only by owner', async () => {
      const res = await request()
        .patch(`/api/v1/rsp/${rsp1.id}/clients/${rspClient1.id}/case-manager`)
        .send({ caseManagerId: rspAccount2.id })
        .use(auth(user8.id, ['rsp']));

      expect(res.status).toBe(400);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('GET /rsp/:id/clients/statistic/:category', () => {
    Object.values(StatCategory).forEach((category) => {
      test(`returns statistics for ${category}`, async () => {
        const res = await request()
          .get(`/api/v1/rsp/${rsp1.id}/clients/statistics/${category}`)
          .use(auth(user7.id, ['rsp']));

        expect(res.status).toBe(200);
        expect(res.type).toBe('application/json');
        expect(res.body).toMatchSnapshot();
      });
    });

    test('return statistics only for clients assign to rsp', async () => {
      const query = Client.query()
        .select(['clients.*', 'rsp_clients.id'])
        .where({ stateOrFederal: StateFederal.both })
        .leftJoin('rsp_clients', (join: Knex.JoinClause) => {
          join.on('clients.userId', 'rsp_clients.userId');
        })
        .whereNotNull('rsp_clients.id');
      const countClients = await query.resultSize();
      const countAssignedClients = await query.where('rsp_clients.rspId', rsp2.id).resultSize();

      expect(countClients).not.toBe(countAssignedClients);

      const res = await request()
        .get(`/api/v1/rsp/${rsp2.id}/clients/statistics/${StatCategory.stateOrFederal}`)
        .use(auth(user14.id, ['rsp']));

      expect(res.body.result[StateFederal.both]).toBe(countAssignedClients);
    });
  });
});

import { faker } from '@faker-js/faker';
import { send } from '@two/mail';
import {
  Age,
  Ethnicity,
  Gender,
  JusticeStatus,
  MaritalStatus,
  OffenseCategory,
  Orientation,
  ReferredBy,
  ReleasedAt,
  Religion,
  State,
  StateFederal,
  Support,
  TimeServed,
  VeteranBranchOfService,
  VeteranCampaign,
  VeteranOrJustice,
  VeteranRank,
  VeteranStatus,
  VeteranTypeDischarge,
} from '@two/shared';
import { Client } from '@app/models';
import { RspClient } from '@app/models/RspClient';
import * as Slack from '@app/services/Slack';
import { auth, fixtures, request, resetDb } from '@test';

jest.mock('@app/services/Slack');

describe('Routes > Clients', () => {
  const relativeExperience = {
    title: 'Title',
    company: 'Company',
    startAtMonth: '5',
    startAtYear: '2015',
    endAtMonth: '5',
    endAtYear: '2016',
    location: 'Location',
    description: 'Description',
  };
  const requestData = {
    address: '111 Street',
    city: 'Los Angeles',
    state: State.CA,
    postalCode: '90887',
    support: [Support.resume, Support.childCare],
    gender: Gender.female,
    orientation: Orientation.heterosexual,
    religion: Religion.christianity,
    maritalStatus: MaritalStatus.single,
    age: Age['16-24'],
    disability: false,
    ethnicity: Ethnicity.eastAsian,
    veteranStatus: VeteranStatus.notVeteran,
    referredBy: ReferredBy.familyFriends,
    personalStrengths: [],
    experience: [],
    languages: [],
    personalSummary: 'personal summary',
    relativeExperience: [relativeExperience],
    education: [],
    license: [],
  };

  const justiceImpactedRequestData = {
    justiceStatus: JusticeStatus.freeWorld,
    offense: [OffenseCategory.arson, OffenseCategory.burglary],
    sexualOffenderRegistry: false,
    sbn: false,
    timeServed: TimeServed.timeServed01,
    releasedAt: ReleasedAt.releasedAt01,
    stateOrFederal: StateFederal.state,
  };

  const veteranRequestData = {
    veteranService: [VeteranBranchOfService.usAirForce],
    veteranRank: VeteranRank.AB,
    veteranStartAt: '2000-05-01',
    veteranReservist: false,
    veteranCampaigns: [VeteranCampaign.bosnia],
    veteranTypeDischarge: VeteranTypeDischarge.bcd,
    veteranDd214: true,
  };

  beforeEach(async () => {
    await resetDb();

    faker.seed(1);
  });

  describe('GET /api/v1/clients', () => {
    test('lists clients', async () => {
      const res = await request()
        .get('/api/v1/clients')
        .use(auth(fixtures.user1.id, ['admin']));

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
      expect(res.body.every((client: any) => client.roles.includes('client'))).toBe(true);
    });

    test('does not allow requests from non-admins', async () => {
      const res = await request().get('/api/v1/clients').use(auth());

      expect(res.status).toBe(403);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('POST /api/v1/clients', () => {
    test('creates a client', async () => {
      const resInvalid = await request()
        .post('/api/v1/clients')
        .use(auth(fixtures.user1.id, ['client']))
        .send({
          veteranOrJustice: [VeteranOrJustice.justiceImpacted],
          ...requestData,
          ...justiceImpactedRequestData,
          relativeExperience: [{ ...relativeExperience, startAtMonth: 'May' }],
        });
      expect(resInvalid.status).toBe(400);

      const existingClientRsp = await RspClient.query()
        .where({ userId: fixtures.user1.id })
        .where({ rspId: fixtures.rsp1.id })
        .first();
      expect(existingClientRsp).toBeUndefined();

      const res = await request()
        .post('/api/v1/clients')
        .use(auth(fixtures.user1.id, ['client']))
        .send({
          veteranOrJustice: [VeteranOrJustice.justiceImpacted],
          ...requestData,
          ...justiceImpactedRequestData,
          rspId: fixtures.rsp1.id,
          isNewRspMember: true,
        });

      expect(Slack.alert).toBeCalledWith(
        `User ${fixtures.user1.id} choose Reentry Service Provider: I need a reentry pipeline`,
      );

      expect(send).toBeCalledTimes(2);
      expect((send as jest.Mock).mock.calls[0][0]).toEqual({
        to: {
          address: fixtures.user7.email,
          name: `${fixtures.user7.firstName} ${fixtures.user7.lastName}`,
        },
        cc: {
          address: 'support@twout.org',
          name: 'Support',
        },
      });
      expect((send as jest.Mock).mock.calls[0][1]).toBe('RspApplicationSupport');
      expect((send as jest.Mock).mock.calls[0][2]).toStrictEqual({
        user: {
          name: `${fixtures.user1.firstName} ${fixtures.user1.lastName}`,
          email: fixtures.user1.email,
          address: '111 Street, Los Angeles, CA 90887',
          phone: '',
          support: 'Resume, Child Care',
          offense: 'Arson, Burglary',
          expectedReleasedAt: null,
          facility: null,
          justiceStatus: JusticeStatus.freeWorld,
        },
        rsp: {
          caseManagerFirstName: fixtures.user7.firstName,
          name: fixtures.rsp1.name,
        },
      });
      expect((send as jest.Mock).mock.calls[1][0]).toEqual({
        to: {
          address: fixtures.user1.email,
          name: `${fixtures.user1.firstName} ${fixtures.user1.lastName}`,
        },
      });
      expect((send as jest.Mock).mock.calls[1][1]).toBe('RspApplication');

      expect(res.status).toBe(200);
      const newClientRsp = await RspClient.query()
        .where({ userId: res.body.userId })
        .where({ rspId: fixtures.rsp1.id })
        .first();
      expect(newClientRsp).not.toBeUndefined();
    });

    test('not sends slack notification if client is already a member,', async () => {
      await request()
        .post('/api/v1/clients')
        .use(auth(fixtures.user1.id, ['client']))
        .send({
          veteranOrJustice: [VeteranOrJustice.justiceImpacted],
          ...requestData,
          ...justiceImpactedRequestData,
          rspId: fixtures.rsp1.id,
        });

      expect(Slack.alert).not.toBeCalled();
    });

    test('returns a resource conflict response for users with exiting client profile', async () => {
      await Client.query().insert({ ...requestData, userId: fixtures.user1.id });
      const res = await request()
        .post('/api/v1/clients')
        .use(auth(fixtures.user1.id, ['client']))
        .send({
          veteranOrJustice: [VeteranOrJustice.justiceImpacted],
          ...requestData,
          ...justiceImpactedRequestData,
        });

      expect(res.status).toBe(409);
    });

    test('creates a client with justiceImpacted', async () => {
      const invalidReq1 = await request()
        .post('/api/v1/clients')
        .use(auth(fixtures.user1.id, ['client']))
        .send({
          veteranOrJustice: [VeteranOrJustice.justiceImpacted],
          ...requestData,
        });

      expect(invalidReq1.status).toBe(400);

      const invalidReq2 = await request()
        .post('/api/v1/clients')
        .use(auth(fixtures.user1.id, ['client']))
        .send({
          veteranOrJustice: [VeteranOrJustice.justiceImpacted, VeteranOrJustice.veteran],
          ...requestData,
        });

      expect(invalidReq2.status).toBe(400);

      const res = await request()
        .post('/api/v1/clients')
        .use(auth(fixtures.user1.id, ['client']))
        .send({
          veteranOrJustice: [VeteranOrJustice.justiceImpacted],
          ...requestData,
          ...justiceImpactedRequestData,
          rspId: fixtures.rsp1.id,
          isNewRspMember: true,
        });

      expect(res.status).toBe(200);
    });

    test('creates a client with veteran', async () => {
      const invalidReq1 = await request()
        .post('/api/v1/clients')
        .use(auth(fixtures.user1.id, ['client']))
        .send({
          veteranOrJustice: [VeteranOrJustice.veteran],
          ...requestData,
        });

      expect(invalidReq1.status).toBe(400);

      const invalidReq2 = await request()
        .post('/api/v1/clients')
        .use(auth(fixtures.user1.id, ['client']))
        .send({
          veteranOrJustice: [VeteranOrJustice.justiceImpacted, VeteranOrJustice.veteran],
          ...requestData,
        });

      expect(invalidReq2.status).toBe(400);

      const res = await request()
        .post('/api/v1/clients')
        .use(auth(fixtures.user1.id, ['client']))
        .send({
          veteranOrJustice: [VeteranOrJustice.veteran],
          ...requestData,
          ...veteranRequestData,
        });

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/v1/clients/case-manager/:rspId', () => {
    test('returns client case manager', async () => {
      await RspClient.query()
        .insert({
          caseManagerId: fixtures.rspAccount1.id,
          userId: fixtures.user2.id,
          rspId: fixtures.rsp1.id,
        })
        .returning('*');

      const res = await request()
        .get('/api/v1/clients/case-manager')
        .use(auth(fixtures.user2.id, ['client']));

      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });

    test('returns resource not found response', async () => {
      const res = await request()
        .get('/api/v1/clients/case-manager')
        .use(auth(fixtures.user2.id, ['client']));

      expect(res.status).toBe(404);
      expect(res.body).toMatchSnapshot();
    });
  });
});

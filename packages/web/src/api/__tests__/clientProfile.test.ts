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
  VeteranOrJustice,
  VeteranStatus,
} from '@two/shared';
import { fixtures } from '@test';
import { client } from '../client';
import { clientProfile } from '../clientProfile';

jest.mock('../client');

describe('API > Client', () => {
  const data = {
    firstName: 'Test',
    lastName: 'User',
    justiceStatus: JusticeStatus.freeWorld,
    veteranOrJustice: [VeteranOrJustice.justiceImpacted],
    address: '111 Street',
    city: 'Los Angeles',
    state: State.CA,
    postalCode: '90887',
    support: [Support.resume],
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
    offense: [OffenseCategory.arson],
    sexualOffenderRegistry: false,
    sbn: false,
    timeServed: TimeServed.timeServed01,
    releasedAt: ReleasedAt.releasedAt01,
    stateOrFederal: StateFederal.federal,
    relativeExperience: [],
    personalSummary: 'personal summary',
    education: [],
    license: [],
  };

  test('executes client create request', async () => {
    (client.post as jest.Mock).mockImplementationOnce(() => Promise.resolve({ data }));
    const res = await clientProfile.create({
      ...data,
      rspId: fixtures.rsp.id,
      isNewRspMember: false,
    });
    expect(res).toBe(data);
  });

  test('executes client update request', async () => {
    (client.patch as jest.Mock).mockImplementationOnce(() => Promise.resolve({ data }));
    const res = await clientProfile.update({ id: 'TEST_ID', ...data });
    expect(res).toBe(data);
  });

  test('executes client listSuggestedJobs request', async () => {
    (client.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: [fixtures.job] }),
    );
    const res = await clientProfile.listSuggestedJobs(fixtures.client.id);
    expect(res).toEqual([fixtures.job]);
  });

  test('executes client listRsp request', async () => {
    (client.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: [fixtures.rsp], headers: { 'x-total-count': '1' } }),
    );
    const res = await clientProfile.listRsp({
      userId: fixtures.user.id,
      support: [Support.employment],
      veteranOrJustice: [VeteranOrJustice.justiceImpacted],
    });
    expect(res).toEqual({ data: [fixtures.rsp], total: 1 });
  });

  test('executes client getCaseManager request', async () => {
    (client.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: fixtures.clientCaseManager }),
    );
    const res = await clientProfile.getCaseManager();
    expect(res).toEqual(fixtures.clientCaseManager);
  });
});

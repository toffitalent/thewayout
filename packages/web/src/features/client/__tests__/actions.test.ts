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
import { API } from '@app/api';
import { createState, fixtures } from '@test';
import {
  applyJob,
  createClient,
  listAllJobs,
  listAppliedJobs,
  listRsp,
  listSuggestedJobs,
  retrieveCaseManager,
  retrieveJob,
  updateClient,
} from '../actions';

jest.mock('@app/api');

describe('Client > Actions', () => {
  const data = {
    firstName: 'Test',
    lastName: 'User',
    veteranOrJustice: [VeteranOrJustice.justiceImpacted],
    justiceStatus: JusticeStatus.freeWorld,
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

  test('createClient calls clientProfile create API method', async () => {
    const action = createClient({ ...data, rspId: fixtures.rsp.id, isNewRspMember: false });
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.clientProfile.create).toBeCalled();
  });

  test('updateClient calls clientProfile update API method', async () => {
    const action = updateClient({ id: 'TEST_ID', ...data, firstName: 'First' });
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.clientProfile.update).toBeCalled();
  });

  test('listAllJobs calls jobs list API method', async () => {
    const action = listAllJobs({});
    await action(
      jest.fn(),
      jest.fn().mockReturnValue(
        createState({
          'clientJobs.jobsList.ids': ['1'],
          'clientJobs.jobsList.entities': { '1': { id: '1' } },
        }),
      ),
      undefined,
    );
    expect(API.job.list).toBeCalled();
  });

  test('retrieveJob calls job retrieve API method', async () => {
    const action = retrieveJob({ jobId: fixtures.job.id });
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.job.retrieve).toBeCalled();
  });

  test('applyJob calls job apply API method', async () => {
    const action = applyJob({ jobId: fixtures.job.id });
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.job.apply).toBeCalled();
  });

  test('listAppliedJobs calls clientProfile listJobs API method', async () => {
    const action = listAppliedJobs({ userId: fixtures.user.id });
    await action(
      jest.fn(),
      jest.fn().mockReturnValue(
        createState({
          'clientJobs.appliedJobs.ids': ['1'],
          'clientJobs.appliedJobs.entities': { '1': { id: '1' } },
        }),
      ),
      undefined,
    );
    expect(API.clientProfile.listJobs).toBeCalled();
  });

  test('listSuggestedJobs calls clientProfile listSuggestedJobs API method', async () => {
    const action = listSuggestedJobs(fixtures.client.id);
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.clientProfile.listSuggestedJobs).toBeCalled();
  });

  test('listRsp calls clientProfile listRsp API method', async () => {
    const action = listRsp({ support: [Support.clothing], userId: fixtures.client.id });
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.clientProfile.listRsp).toBeCalled();
  });

  test('retrieveCaseManager calls clientProfile getCaseManager API method', async () => {
    const action = retrieveCaseManager();
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.clientProfile.getCaseManager).toBeCalled();
  });
});

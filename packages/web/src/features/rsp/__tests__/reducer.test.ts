import { Gender, RspClientStatus, StatCategory } from '@two/shared';
import { fetchUser } from '@app/features/auth';
import { createState, fixtures, makeGetState } from '@test';
import {
  acceptClient,
  createRsp,
  declineClient,
  getStatistics,
  listCaseManagers,
  listCaseManagersNames,
  listClients,
  listInvitations,
  listStatisticsClients,
  removeCaseManager,
  removeInvitation,
  retrieveClient,
  retrieveRspAccount,
  updateCaseManager,
  updateRsp,
} from '../actions';
import {
  reducer,
  selectAccount,
  selectAllCaseManagers,
  selectAllCaseManagersNames,
  selectAllClients,
  selectAllInvitations,
  selectAllStatisticsClients,
  selectClient,
  selectRsp,
  selectStatistics,
  selectTotalCaseManagers,
  selectTotalClients,
  selectTotalInvitations,
  selectTotalStatisticsClients,
} from '../reducer';

const getState = makeGetState('rsp');
const {
  rspAccountMember,
  rspAccountOwner,
  rsp,
  user,
  rspClient,
  rspClient2,
  invitation,
  statistics,
} = fixtures;

describe('Rsp > Reducer', () => {
  test('returns empty initial state', () => {
    expect(reducer(undefined, { type: '' })).toMatchSnapshot();
  });

  test('handles listCaseManagers fulfilled actions', () => {
    expect(
      reducer(
        getState({ caseManagers: { ids: [], entities: {} } }),
        listCaseManagers.fulfilled({ data: [rspAccountMember], total: 1 }, '', { rspId: rsp.id }),
      ),
    ).toMatchSnapshot();
  });

  test('handles listCaseManagersNames fulfilled actions', () => {
    expect(
      reducer(
        getState({ caseManagersNames: [] }),
        listCaseManagersNames.fulfilled(
          [
            {
              id: rspAccountMember.id,
              firstName: rspAccountMember.firstName,
              lastName: rspAccountMember.lastName,
            },
          ],
          '',
          '',
        ),
      ),
    ).toMatchSnapshot();
  });

  test('handles retrieveRspAccount fulfilled actions', () => {
    expect(
      reducer(
        getState({ account: null }),
        retrieveRspAccount.fulfilled(rspAccountMember, '', { rspId: rsp.id, userId: user.id }),
      ),
    ).toMatchSnapshot();
  });

  test('handles updateCaseManager fulfilled actions', () => {
    expect(
      reducer(
        getState({
          caseManagers: {
            ids: [rspAccountMember.id],
            entities: { [rspAccountMember.id]: rspAccountMember },
          },
        }),
        updateCaseManager.fulfilled({ ...rspAccountMember, firstName: 'Test' }, '', {
          rspId: rsp.id,
          userId: user.id,
        }),
      ),
    ).toMatchSnapshot();
  });

  test('handles removeCaseManager fulfilled actions', () => {
    expect(
      reducer(
        getState({
          caseManagers: {
            ids: [rspAccountMember.id],
            entities: { [rspAccountMember.id]: rspAccountMember },
            total: 1,
          },
        }),
        removeCaseManager.fulfilled({}, '', {
          rspId: rsp.id,
          userId: rspAccountMember.userId,
        }),
      ),
    ).toMatchSnapshot();
  });

  test('handles createRsp fulfilled actions', () => {
    expect(
      reducer(
        getState({ rsp: null }),
        createRsp.fulfilled({ rsp, owner: rspAccountOwner }, '', {} as any),
      ),
    ).toMatchSnapshot();
  });

  test('handles updateRsp fulfilled actions', () => {
    expect(
      reducer(getState({ rsp }), updateRsp.fulfilled({ ...rsp, name: 'Test' }, '', {})),
    ).toMatchSnapshot();
  });

  test('handles fetchUser fulfilled actions', () => {
    expect(
      reducer(
        getState({ rsp: null }),
        fetchUser.fulfilled({ ...user, rspAccount: rspAccountOwner }, '', {} as any),
      ),
    ).toMatchSnapshot();
  });

  test('handles listClients fulfilled actions', () => {
    expect(
      reducer(
        getState({ clients: { ids: [], entities: {} } }),
        listClients.fulfilled({ data: [rspClient], total: 1 }, '', { rspId: rsp.id }),
      ),
    ).toMatchSnapshot();
  });

  test('handles listStatisticsClients pending actions', () => {
    expect(
      reducer(
        getState(),
        listStatisticsClients.pending('', { rspId: rsp.id, gender: Gender.female }),
      ),
    ).toMatchSnapshot();
  });

  test('handles listStatisticsClients fulfilled actions', () => {
    expect(
      reducer(
        getState({ clients: { ids: [], entities: {} } }),
        listStatisticsClients.fulfilled({ data: [rspClient], total: 1 }, '', {
          rspId: rsp.id,
          gender: Gender.female,
        }),
      ),
    ).toMatchSnapshot();
  });

  test('handles retrieveClient fulfilled actions', () => {
    expect(
      reducer(
        getState({ account: null }),
        retrieveClient.fulfilled(rspClient, '', { rspId: rsp.id, clientId: rspClient.id }),
      ),
    ).toMatchSnapshot();
  });

  test('handles acceptClient fulfilled actions', () => {
    expect(
      reducer(
        getState({
          clients: { ids: [rspClient.id], entities: { [rspClient.id]: rspClient } },
          client: rspClient,
        }),
        acceptClient.fulfilled({ ...rspClient, status: RspClientStatus.active }, '', {
          rspId: rsp.id,
          clientId: rspClient.id,
        }),
      ),
    ).toMatchSnapshot();
  });

  test('handles declineClient fulfilled actions', () => {
    expect(
      reducer(
        getState({
          clients: { ids: [rspClient.id], entities: { [rspClient.id]: rspClient } },
          client: rspClient,
        }),
        declineClient.fulfilled({ ...rspClient, status: RspClientStatus.closed }, '', {
          rspId: rsp.id,
          clientId: rspClient.id,
        }),
      ),
    ).toMatchSnapshot();
  });

  test('handles listInvitations fulfilled actions', () => {
    expect(
      reducer(
        getState({ invitations: { ids: [], entities: {} } }),
        listInvitations.fulfilled({ data: [invitation], total: 1 }, '', { rspId: rsp.id }),
      ),
    ).toMatchSnapshot();
  });

  test('handles removeInvitation fulfilled actions', () => {
    expect(
      reducer(
        getState({
          invitations: {
            ids: [invitation.id],
            entities: { [invitation.id]: invitation },
            total: 1,
          },
        }),
        removeInvitation.fulfilled({}, '', {
          rspId: rsp.id,
          invitationId: invitation.id,
        }),
      ),
    ).toMatchSnapshot();
  });

  test('handles getStatistics fulfilled actions', () => {
    expect(
      reducer(
        getState({ account: null }),
        getStatistics.fulfilled(statistics, '', { rspId: rsp.id, category: StatCategory.services }),
      ),
    ).toMatchSnapshot();
  });
});

describe('Rsp > Selectors', () => {
  test('selectRsp returns rsp', () => {
    expect(selectRsp(createState())).toBe(rsp);
    expect(selectRsp(createState({ 'rsp.rsp': null }))).toBe(null);
  });

  test('selectAccount returns account', () => {
    expect(selectAccount(createState())).toBe(rspAccountOwner);
    expect(selectAccount(createState({ 'rsp.account': null }))).toBe(null);
  });

  test('selectAllCaseManagers returns case managers list', () => {
    expect(selectAllCaseManagers(createState())).toStrictEqual([rspAccountMember]);
    expect(
      selectAllCaseManagers(
        createState({
          'rsp.caseManagers': {
            ids: [],
            entities: {},
          },
        }),
      ),
    ).toStrictEqual([]);
  });

  test('selectTotalCaseManagers returns number of case managers', () => {
    expect(selectTotalCaseManagers(createState())).toBe(1);
    expect(selectTotalCaseManagers(createState({ 'rsp.caseManagers.total': 0 }))).toBe(0);
  });

  test('selectAllCaseManagersNames returns case managers names', () => {
    expect(selectAllCaseManagersNames(createState())).toStrictEqual([
      {
        id: rspAccountMember.id,
        firstName: rspAccountMember.firstName,
        lastName: rspAccountMember.lastName,
      },
    ]);
    expect(
      selectAllCaseManagersNames(
        createState({
          'rsp.caseManagersNames': [],
        }),
      ),
    ).toStrictEqual([]);
  });

  test('selectAllInvitations returns invitations list', () => {
    expect(selectAllInvitations(createState())).toStrictEqual([invitation]);
    expect(
      selectAllInvitations(
        createState({
          'rsp.invitations': {
            ids: [],
            entities: {},
          },
        }),
      ),
    ).toStrictEqual([]);
  });

  test('selectTotalInvitations returns number of invitations', () => {
    expect(selectTotalInvitations(createState())).toBe(1);
    expect(selectTotalInvitations(createState({ 'rsp.invitations.total': 0 }))).toBe(0);
  });

  test('selectAllClients returns clients list', () => {
    expect(selectAllClients(createState())).toStrictEqual([rspClient, rspClient2]);
    expect(
      selectAllClients(
        createState({
          'rsp.clients': {
            ids: [],
            entities: {},
          },
        }),
      ),
    ).toStrictEqual([]);
  });

  test('selectTotalClients returns number of clients', () => {
    expect(selectTotalClients(createState())).toBe(2);
    expect(selectTotalClients(createState({ 'rsp.clients.total': 0 }))).toBe(0);
  });

  test('selectClient returns client', () => {
    expect(selectClient(createState())).toBe(rspClient);
    expect(selectClient(createState({ 'rsp.client': null }))).toBe(null);
  });

  test('selectAllStatisticsClients returns clients list', () => {
    expect(selectAllStatisticsClients(createState())).toStrictEqual([rspClient2]);
    expect(
      selectAllStatisticsClients(
        createState({
          'rsp.statisticsClients': {
            ids: [],
            entities: {},
          },
        }),
      ),
    ).toStrictEqual([]);
  });

  test('selectTotalStatisticsClients returns number of clients', () => {
    expect(selectTotalStatisticsClients(createState())).toBe(1);
    expect(selectTotalStatisticsClients(createState({ 'rsp.statisticsClients.total': 0 }))).toBe(0);
  });

  test('selectStatistics returns statistic', () => {
    expect(selectStatistics(createState())).toBe(statistics);
    expect(selectStatistics(createState({ 'rsp.statistic': null }))).toBe(null);
  });
});

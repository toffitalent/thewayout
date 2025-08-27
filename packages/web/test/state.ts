import { createNextState } from '@reduxjs/toolkit';
import set from 'lodash.set';
import { JobApplicationStatus } from '@two/shared';
import { reducer, State } from '../src/reducers';
import * as fixtures from './fixtures';

export const initialState: State = reducer(undefined, { type: 'test/init' });

export const mockState: State = {
  ...initialState,
  auth: {
    ...initialState.auth,
    user: fixtures.user,
  },
  clientJobs: {
    ...initialState.clientJobs,
    jobs: {
      ids: [fixtures.job.id],
      entities: { [fixtures.job.id]: fixtures.job },
    },
    jobsList: {
      ids: [fixtures.job.id],
      entities: { [fixtures.job.id]: fixtures.job },
      total: 1,
      listUpdatedAt: '',
    },
    appliedJobs: {
      ids: [fixtures.job.id],
      entities: { [fixtures.job.id]: fixtures.job },
      total: 1,
      listUpdatedAt: '',
      forceReload: false,
    },
    suggestedJobs: {
      ids: [fixtures.job.id],
      entities: { [fixtures.job.id]: fixtures.job },
    },
    rspList: {
      ids: [fixtures.rsp.id],
      entities: { [fixtures.rsp.id]: fixtures.rsp },
    },
    caseManager: {
      firstName: 'FirstName',
      lastName: 'LastName',
      email: 'test@test.com',
      rspName: 'Name',
    },
  },
  employerJobs: {
    job: fixtures.job,
    jobsApplications: {
      ids: [fixtures.job.id],
      entities: { [fixtures.job.id]: { id: fixtures.job.id, total: 0, applications: [] } },
    },
    jobs: {
      ids: [fixtures.job.id],
      entities: { [fixtures.job.id]: fixtures.job },
      total: 1,
      listUpdatedAt: '',
    },
    client: {
      ...fixtures.client,
      applicationStatus: JobApplicationStatus.applied,
      applicationId: 'TEST_APPLICATION_ID',
    },
  },
  rsp: {
    caseManagers: {
      ids: [fixtures.rspAccountMember.id],
      entities: { [fixtures.rspAccountMember.id]: fixtures.rspAccountMember },
      total: 1,
      listUpdatedAt: '',
    },
    account: fixtures.rspAccountOwner,
    rsp: fixtures.rsp,
    caseManagersNames: [
      {
        id: fixtures.rspAccountMember.id,
        firstName: fixtures.rspAccountMember.firstName,
        lastName: fixtures.rspAccountMember.lastName,
      },
    ],
    client: fixtures.rspClient,
    clients: {
      ids: [fixtures.rspClient.id, fixtures.rspClient2.id],
      entities: {
        [fixtures.rspClient.id]: fixtures.rspClient,
        [fixtures.rspClient2.id]: fixtures.rspClient2,
      },
      total: 2,
      listUpdatedAt: '',
    },
    invitations: {
      ids: [fixtures.invitation.id],
      entities: { [fixtures.invitation.id]: fixtures.invitation },
      total: 1,
      listUpdatedAt: '',
    },
    statistic: fixtures.statistics,
    statisticsClients: {
      ids: [fixtures.rspClient2.id],
      entities: { [fixtures.rspClient2.id]: fixtures.rspClient2 },
      total: 1,
      listUpdatedAt: '',
    },
  },
};

export type StateOverrides = Record<string, any>;

export const createState = (
  overrides: StateOverrides = {},
  state: State = mockState,
  prefix = '',
) =>
  createNextState(state, (draft) => {
    Object.entries(overrides).forEach(([key, value]) => {
      set(draft, `${prefix ? `${prefix}.` : ''}${key}`, value);
    });
    return draft;
  });

export const makeGetState =
  <T extends keyof State>(key: T, state: State = initialState) =>
  (overrides: StateOverrides = {}, stateOverride = state): State[T] =>
    createState(overrides, stateOverride, key as string)[key];

export { fixtures, reducer };

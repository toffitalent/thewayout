import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import {
  RspAccountListItem,
  RspAccountName,
  RspAccountType,
  RspClient,
  RspClientList,
  RspInvitation,
  RspType,
} from '@two/shared';
import type { State } from '@app/reducers';
import { fetchUser } from '../auth';
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
} from './actions';

interface ListState {
  total: number;
  listUpdatedAt: string;
}

const caseManagersAdapter = createEntityAdapter<RspAccountListItem>({
  sortComparer: false,
});

const invitationsAdapter = createEntityAdapter<RspInvitation>({
  sortComparer: false,
});

const clientsAdapter = createEntityAdapter<RspClientList>({
  sortComparer: false,
});

const statisticsClientsAdapter = createEntityAdapter<RspClientList>({
  sortComparer: false,
});

const initialState = {
  caseManagers: caseManagersAdapter.getInitialState<ListState>({
    total: 0,
    listUpdatedAt: '',
  }),
  invitations: invitationsAdapter.getInitialState<ListState>({
    total: 0,
    listUpdatedAt: '',
  }),
  caseManagersNames: <RspAccountName[]>[],
  account: <RspAccountType | null>null,
  rsp: <RspType | null>null,
  clients: clientsAdapter.getInitialState<ListState>({
    total: 0,
    listUpdatedAt: '',
  }),
  statisticsClients: statisticsClientsAdapter.getInitialState<ListState>({
    total: 0,
    listUpdatedAt: '',
  }),
  client: <RspClient | null>null,
  statistic: <{ result: { [key: string]: number }; total: number } | null>null,
};

export const { name, reducer } = createSlice({
  name: 'rsp',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listCaseManagers.fulfilled, (state, action) => {
        caseManagersAdapter.upsertMany(state.caseManagers, action.payload.data);
        state.caseManagers.total = action.payload.total;
      })
      .addCase(listCaseManagersNames.fulfilled, (state, action) => {
        state.caseManagersNames = action.payload;
      })
      .addCase(retrieveRspAccount.fulfilled, (state, action) => {
        state.account = action.payload;
      })
      .addCase(updateCaseManager.fulfilled, (state, action) => {
        if (action.payload) {
          caseManagersAdapter.updateOne(state.caseManagers, {
            id: action.payload.id,
            changes: action.payload,
          });
        }
      })
      .addCase(removeCaseManager.fulfilled, (state, action) => {
        const account = caseManagersAdapter
          .getSelectors()
          .selectAll(state.caseManagers)
          .find((el) => el.userId === action.meta.arg.userId);
        if (account?.id) {
          caseManagersAdapter.removeOne(state.caseManagers, account?.id);
          state.caseManagers.total -= state.caseManagers.total;
        }
      })
      .addCase(createRsp.fulfilled, (state, action) => {
        if (action.payload) {
          state.rsp = action.payload.rsp;
        }
      })
      .addCase(updateRsp.fulfilled, (state, action) => {
        if (action.payload) {
          state.rsp = action.payload;
        }
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        if (action.payload.rspAccount?.rsp) {
          state.rsp = action.payload.rspAccount.rsp;
        }
      })
      .addCase(listClients.fulfilled, (state, action) => {
        clientsAdapter.upsertMany(state.clients, action.payload.data);
        state.clients.total = action.payload.total;
      })
      .addCase(listStatisticsClients.pending, (state, action) => {
        if (action.meta.arg.forceReload) {
          statisticsClientsAdapter.removeAll(state.statisticsClients);
        }
      })
      .addCase(listStatisticsClients.fulfilled, (state, action) => {
        statisticsClientsAdapter.upsertMany(state.statisticsClients, action.payload.data);
        state.statisticsClients.total = action.payload.total;
      })
      .addCase(retrieveClient.fulfilled, (state, action) => {
        if (action.payload) {
          state.client = action.payload;
        }
      })
      .addCase(acceptClient.fulfilled, (state, action) => {
        if (action.payload) {
          state.client = action.payload;
          clientsAdapter.updateOne(state.clients, {
            id: action.payload.id,
            changes: action.payload,
          });
        }
      })
      .addCase(declineClient.fulfilled, (state, action) => {
        if (action.payload) {
          state.client = action.payload;
          clientsAdapter.updateOne(state.clients, {
            id: action.payload.id,
            changes: action.payload,
          });
        }
      })
      .addCase(listInvitations.fulfilled, (state, action) => {
        invitationsAdapter.upsertMany(state.invitations, action.payload.data);
        state.invitations.total = action.payload.total;
      })
      .addCase(removeInvitation.fulfilled, (state, action) => {
        invitationsAdapter.removeOne(state.invitations, action.meta.arg.invitationId);
        state.invitations.total -= state.invitations.total;
      })
      .addCase(getStatistics.fulfilled, (state, action) => {
        state.statistic = action.payload;
      });
  },
});

export const selectRsp = (state: State) => state[name].rsp;
export const selectAccount = (state: State) => state[name].account;

export const { selectAll: selectAllCaseManagers } = caseManagersAdapter.getSelectors(
  (state: State) => state.rsp.caseManagers,
);
export const selectTotalCaseManagers = (state: State) => state[name].caseManagers.total;
export const selectAllCaseManagersNames = (state: State) => state[name].caseManagersNames;
export const { selectAll: selectAllInvitations } = invitationsAdapter.getSelectors(
  (state: State) => state.rsp.invitations,
);
export const selectTotalInvitations = (state: State) => state[name].invitations.total;

export const { selectAll: selectAllClients } = clientsAdapter.getSelectors(
  (state: State) => state.rsp.clients,
);
export const selectTotalClients = (state: State) => state[name].clients.total;
export const selectClient = (state: State) => state[name].client;
export const { selectAll: selectAllStatisticsClients } = statisticsClientsAdapter.getSelectors(
  (state: State) => state.rsp.statisticsClients,
);
export const selectTotalStatisticsClients = (state: State) => state[name].statisticsClients.total;
export const selectStatistics = (state: State) => state[name].statistic;

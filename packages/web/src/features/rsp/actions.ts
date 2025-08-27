import { ClientType, RspClientStatus } from '@two/shared';
import { API } from '@app/api';
import type { State } from '@app/store';
import { createApiThunk } from '@app/utils';

export const createRsp = createApiThunk('rsp/create', API.rsp.create);

export const updateRsp = createApiThunk('rsp/update', API.rsp.update);

export const createMember = createApiThunk('rsp/createMember', API.rsp.createMember);

export const inviteCaseManager = createApiThunk('rsp/inviteCaseManager', API.rsp.inviteCaseManager);

export const removeInvitation = createApiThunk('rsp/removeInvitation', API.rsp.removeInvitation);

export const removeCaseManager = createApiThunk('rsp/removeCaseManager', API.rsp.removeCaseManager);

export const listCaseManagers = createApiThunk(
  'rsp/caseManagers',
  ({ rspId }: { rspId: string }, { getState }) => {
    const { ids } = (getState() as State).rsp.caseManagers;
    const lastId = [...ids].pop() as string;
    return API.rsp.listCaseManagers(rspId, {
      before: lastId,
    });
  },
);

export const listInvitations = createApiThunk(
  'rsp/invitations',
  ({ rspId }: { rspId: string }, { getState }) => {
    const { ids } = (getState() as State).rsp.invitations;
    const lastId = [...ids].pop() as string;
    return API.rsp.listInvitations(rspId, {
      before: lastId,
    });
  },
);

export const listCaseManagersNames = createApiThunk(
  'rsp/listCaseManagersNames',
  API.rsp.listCaseManagersNames,
);

export const retrieveRspAccount = createApiThunk('rsp/retrieveRspAccount', API.rsp.retrieveAccount);

export const updateCaseManager = createApiThunk('rsp/updateCaseManager', API.rsp.updateCaseManager);

export const listClients = createApiThunk(
  'rsp/clients',
  ({ rspId }: { rspId: string }, { getState }) => {
    const { ids } = (getState() as State).rsp.clients;
    const lastId = [...ids].pop() as string;
    return API.rsp.listClients(rspId, {
      before: lastId,
    });
  },
);

export const listStatisticsClients = createApiThunk(
  'rsp/statisticsClients',
  (
    {
      rspId,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      forceReload,
      ...clientFilters
    }: Partial<ClientType> & { rspId: string; forceReload?: boolean },
    { getState },
  ) => {
    const { ids } = (getState() as State).rsp.statisticsClients;
    const lastId = [...ids].pop() as string;
    return API.rsp.listClients(rspId, {
      ...clientFilters,
      before: lastId,
    });
  },
);

export const retrieveClient = createApiThunk('rsp/retrieveClient', API.rsp.retrieveClient);

export const declineClient = createApiThunk(
  'rsp/declineClient',
  ({ rspId, clientId }: { rspId: string; clientId: string }) =>
    API.rsp.changeClientStatus(rspId, clientId, RspClientStatus.closed),
);

export const acceptClient = createApiThunk(
  'rsp/acceptClient',
  ({ rspId, clientId }: { rspId: string; clientId: string }) =>
    API.rsp.changeClientStatus(rspId, clientId, RspClientStatus.active),
);

export const addClientNotes = createApiThunk('rsp/addClientNotes', API.rsp.addClientNotes);

export const assignCaseManager = createApiThunk(
  'rsp/assignCaseManager',
  ({
    rspId,
    clientId,
    caseManagerId,
  }: {
    rspId: string;
    clientId: string;
    caseManagerId: string;
  }) => API.rsp.assignCaseManager(rspId, clientId, caseManagerId),
);

export const getStatistics = createApiThunk('rsp/statistics', API.rsp.getStatistics);

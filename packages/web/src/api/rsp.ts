import {
  ClientType,
  CreateMemberRsp,
  CreateRspRequest,
  RspAccountListItem,
  RspAccountName,
  RspAccountType,
  RspClient,
  RspClientList,
  RspClientStatus,
  RspInvitation,
  RspType,
  StatCategory,
} from '@two/shared';
import { client } from './client';
import { ListParams } from './types';

interface InviteCaseManagerProps {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  rspId: string;
}

async function create(rsp: CreateRspRequest) {
  const { data } = await client.post<{ rsp: RspType; owner: RspAccountType }>('/v1/rsp', rsp);

  return data;
}

async function update({ id, ...patch }: Partial<RspType>) {
  const { data } = await client.patch<RspType>(`/v1/rsp/${id}`, patch);

  return data;
}

async function createMember({
  rspId,
  ...member
}: CreateMemberRsp & { userId: string; rspId: string }) {
  const { data } = await client.put<RspAccountType>(
    `/v1/rsp/${rspId}/accounts/${member.userId}`,
    member,
  );

  return data;
}

async function listCaseManagers(rspId: string, { since, after, before, limit }: ListParams) {
  const { data, headers } = await client.get<RspAccountListItem[]>(
    `/v1/rsp/${rspId}/case-managers`,
    {
      params: {
        ...(since ? { since } : {}),
        ...(after ? { after } : {}),
        ...(before ? { before } : {}),
        ...(limit ? { limit } : {}),
      },
    },
  );

  return { data, total: Number(headers['x-total-count']) };
}

async function listCaseManagersNames(rspId: string) {
  const { data } = await client.get<RspAccountName[]>(`/v1/rsp/${rspId}/accounts/case-managers`);

  return data;
}

async function inviteCaseManager({ rspId, ...caseManager }: InviteCaseManagerProps) {
  const { data } = await client.post(`/v1/rsp/${rspId}/accounts/invite`, {
    ...caseManager,
  });

  return data;
}

async function listInvitations(rspId: string, { since, after, before, limit }: ListParams) {
  const { data, headers } = await client.get<RspInvitation[]>(`/v1/rsp/${rspId}/invitations`, {
    params: {
      ...(since ? { since } : {}),
      ...(after ? { after } : {}),
      ...(before ? { before } : {}),
      ...(limit ? { limit } : {}),
    },
  });

  return { data, total: Number(headers['x-total-count']) };
}

async function removeInvitation({ rspId, invitationId }: { rspId: string; invitationId: string }) {
  const { data } = await client.delete(`/v1/rsp/${rspId}/invitations/${invitationId}`);

  return data;
}

async function retrieveAccount({ rspId, userId }: { rspId: string; userId: string }) {
  const { data } = await client.get<RspAccountType>(`/v1/rsp/${rspId}/accounts/${userId}`);

  return data;
}

async function updateCaseManager({
  rspId,
  userId,
  ...patch
}: {
  rspId: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}) {
  const { data } = await client.patch<RspAccountType>(`/v1/rsp/${rspId}/accounts/${userId}`, patch);

  return data;
}

async function removeCaseManager({ rspId, userId }: { rspId: string; userId: string }) {
  const { data } = await client.delete(`/v1/rsp/${rspId}/accounts/${userId}`);

  return data;
}

async function listClients(
  rspId: string,
  { since, after, before, limit, ...clientFilters }: Partial<ClientType> & ListParams,
) {
  const { data, headers } = await client.get<RspClientList[]>(`/v1/rsp/${rspId}/clients`, {
    params: {
      ...(since ? { since } : {}),
      ...(after ? { after } : {}),
      ...(before ? { before } : {}),
      ...(limit ? { limit } : {}),
      ...clientFilters,
    },
  });

  return { data, total: Number(headers['x-total-count']) };
}

async function retrieveClient({ rspId, clientId }: { rspId: string; clientId: string }) {
  const { data } = await client.get<RspClient>(`/v1/rsp/${rspId}/clients/${clientId}`);

  return data;
}

async function changeClientStatus(rspId: string, clientId: string, status: RspClientStatus) {
  const { data } = await client.patch<RspClient>(`/v1/rsp/${rspId}/clients/${clientId}`, {
    status,
  });
  return data;
}

async function addClientNotes({
  rspId,
  clientId,
  notes,
}: {
  rspId: string;
  clientId: string;
  notes: string;
}) {
  const { data } = await client.patch<RspClient>(`/v1/rsp/${rspId}/clients/${clientId}`, {
    notes,
  });
  return data;
}

async function assignCaseManager(rspId: string, clientId: string, caseManagerId: string) {
  const { data } = await client.patch<RspClient>(
    `/v1/rsp/${rspId}/clients/${clientId}/case-manager`,
    {
      caseManagerId,
    },
  );
  return data;
}

async function getStatistics({ rspId, category }: { rspId: string; category: StatCategory }) {
  const { data } = await client.get<{ result: { [key: string]: number }; total: number }>(
    `/v1/rsp/${rspId}/clients/statistics/${category}`,
  );

  return data;
}

export const rsp = {
  create,
  update,
  createMember,
  listCaseManagers,
  retrieveAccount,
  updateCaseManager,
  inviteCaseManager,
  listInvitations,
  removeInvitation,
  removeCaseManager,
  listClients,
  retrieveClient,
  listCaseManagersNames,
  changeClientStatus,
  assignCaseManager,
  getStatistics,
  addClientNotes,
};

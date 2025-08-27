import {
  ClientCaseManager,
  CreateClientProfileRequest,
  JobListItem,
  ListRspClientRequest,
  RspListType,
  UpdateClientProfileRequest,
} from '@two/shared';
import { client } from './client';
import { ListParams } from './types';

async function create(clientProfile: CreateClientProfileRequest) {
  const { data } = await client.post('/v1/clients', clientProfile);
  return data;
}

async function update({ id, ...update }: UpdateClientProfileRequest) {
  const { data } = await client.patch(`/v1/clients/${id}`, update);
  return data;
}

async function listJobs(clientUserId: string, { since, after, before, limit }: ListParams) {
  const { data, headers } = await client.get<JobListItem[]>(`/v1/clients/${clientUserId}/jobs`, {
    params: {
      ...(since ? { since } : {}),
      ...(after ? { after } : {}),
      ...(before ? { before } : {}),
      ...(limit ? { limit } : {}),
    },
  });
  return { data, total: Number(headers['x-total-count']) };
}

async function listSuggestedJobs(clientId: string) {
  const { data } = await client.get<JobListItem[]>(`/v1/clients/${clientId}/jobs/suggested`);
  return data;
}

async function listRsp({
  userId,
  support,
  offenses,
  county,
  veteranOrJustice,
}: ListRspClientRequest & { userId: string }) {
  const { data, headers } = await client.get<RspListType[]>(`/v1/clients/${userId}/rsp`, {
    params: {
      ...(support && { support: support.join(',') }),
      ...(offenses && { offenses: offenses.join(',') }),
      ...(veteranOrJustice && { veteranOrJustice: veteranOrJustice.join(',') }),
      county,
    },
  });

  return { data, total: Number(headers['x-total-count']) };
}

async function getCaseManager() {
  const { data } = await client.get<ClientCaseManager>(`/v1/clients/case-manager`);

  return data;
}

export const clientProfile = {
  create,
  update,
  listJobs,
  listSuggestedJobs,
  listRsp,
  getCaseManager,
};

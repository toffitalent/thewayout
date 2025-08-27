import {
  EmployerCreateRequest,
  EmployerType,
  JobApplication,
  JobApplicationListItem,
  JobApplicationStatus,
  JobListItem,
} from '@two/shared';
import { ClientWithApplication } from '@app/types';
import { client } from './client';
import { ListParams } from './types';

async function create(employer: EmployerCreateRequest) {
  const { data } = await client.post<EmployerType>('/v1/employers', employer);
  return data;
}

async function update({ id, ...update }: EmployerCreateRequest & { id: string }) {
  const { data } = await client.patch<EmployerType>(`/v1/employers/${id}`, update);
  return data;
}

async function listJobs(employerUserId: string, { since, after, before, limit }: ListParams) {
  const { data, headers } = await client.get<JobListItem[]>(
    `/v1/employers/${employerUserId}/jobs`,
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

async function listApplications(
  employerUserId: string,
  jobId: string,
  { since, after, before, limit, page }: ListParams,
) {
  const { data, headers } = await client.get<JobApplicationListItem[]>(
    `/v1/employers/${employerUserId}/jobs/${jobId}/applications`,
    {
      params: {
        ...(since ? { since } : {}),
        ...(after ? { after } : {}),
        ...(before ? { before } : {}),
        ...(limit ? { limit } : {}),
        ...(page ? { page } : {}),
      },
    },
  );
  return { data, total: Number(headers['x-total-count']), page };
}

async function getClient(
  employerId: string,
  jobId: string,
  clientId: string,
  { since }: { since?: Date },
) {
  const { data } = await client.get<ClientWithApplication>(
    `/v1/employers/${employerId}/jobs/${jobId}/applications/${clientId}`,
    {
      params: {
        ...(since ? { since } : {}),
      },
    },
  );
  return data;
}

async function changeApplicationStatus(
  employerId: string,
  jobId: string,
  applicationId: string,
  status: JobApplicationStatus,
) {
  const { data } = await client.patch<JobApplication>(
    `/v1/employers/${employerId}/jobs/${jobId}/applications/${applicationId}`,
    { status },
  );
  return data;
}

export const employer = {
  create,
  update,
  listJobs,
  listApplications,
  getClient,
  changeApplicationStatus,
};

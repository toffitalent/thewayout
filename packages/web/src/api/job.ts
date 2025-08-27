import { CreateJobRequest, EmployerType, Job, JobApplication, JobListItem } from '@two/shared';
import { client } from './client';
import { ListParams } from './types';

async function create(employer: CreateJobRequest) {
  const { data } = await client.post<Job & { employer: EmployerType }>('/v1/jobs', employer);
  return data;
}

async function list({ since, after, before, limit }: ListParams) {
  const { data, headers } = await client.get<JobListItem[]>(`/v1/jobs`, {
    params: {
      ...(since ? { since } : {}),
      ...(after ? { after } : {}),
      ...(before ? { before } : {}),
      ...(limit ? { limit } : {}),
    },
  });
  return { data, total: Number(headers['x-total-count']) };
}

async function retrieve(jobId: string, { since }: { since?: Date }) {
  const { data } = await client.get<Job>(`/v1/jobs/${jobId}`, {
    params: {
      ...(since ? { since } : {}),
    },
  });
  return data;
}

async function apply(jobId: string, { questions }: { questions?: { [key: string]: string }[] }) {
  const { data } = await client.post<JobApplication>(`/v1/jobs/${jobId}/applications`, {
    ...(questions && { questions }),
  });
  return data;
}

async function update(jobId: string, patch: Partial<Job>) {
  const { data } = await client.patch<Job>(`/v1/jobs/${jobId}`, patch);
  return data;
}

export const job = {
  create,
  list,
  retrieve,
  apply,
  update,
};

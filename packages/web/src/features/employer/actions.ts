import { Job, JobApplicationStatus } from '@two/shared';
import { API } from '@app/api';
import type { State } from '@app/store';
import { createApiThunk } from '@app/utils';

export const createEmployer = createApiThunk('employer/create', API.employer.create);

export const updateEmployer = createApiThunk('employer/update', API.employer.update);

export const createJob = createApiThunk('employer/job/create', API.job.create);

export const listJobs = createApiThunk(
  'employer/jobs',
  ({ forceReload, userId }: { forceReload?: boolean; userId: string }, { getState }) => {
    const { ids } = (getState() as State).employerJobs.jobs;
    const lastId = [...ids].pop() as string;
    return API.employer.listJobs(userId, {
      ...(!forceReload && { before: lastId }),
    });
  },
);

export const updateListJobs = createApiThunk(
  'employer/jobs/listUpdated',
  ({ userId }: { userId: string }, { getState }) => {
    const { listUpdatedAt, ids } = (getState() as State).employerJobs.jobs;
    const firstId = ids[0] as string;
    const lastId = [...ids].pop() as string;
    return API.employer.listJobs(userId, {
      since: listUpdatedAt,
      after: firstId,
      before: lastId,
    });
  },
);

export const retrieveJob = createApiThunk(
  'employer/job',
  ({ jobId, since }: { jobId: string; since?: Date }) =>
    API.job.retrieve(jobId, {
      ...(since ? { since } : {}),
    }),
);

export const listApplications = createApiThunk(
  'employer/listApplications',
  ({ employerId, jobId }: { employerId: string; jobId: string }, { getState }) => {
    const { entities } = (getState() as State).employerJobs.jobsApplications;
    const page = entities[jobId]?.page;
    const isListEmpty = !entities[jobId]?.applications.length;

    return API.employer.listApplications(employerId, jobId, {
      page: isListEmpty ? 0 : page! + 1,
    });
  },
);

export const getClient = createApiThunk(
  'employer/getClient',
  ({ employerId, jobId, clientId }: { employerId: string; jobId: string; clientId: string }) =>
    API.employer.getClient(employerId, jobId, clientId, {}),
);

export const updateJob = createApiThunk(
  'employer/updateJob',
  ({ jobId, patch }: { jobId: string; patch: Partial<Job> }) => API.job.update(jobId, patch),
);

export const interviewClient = createApiThunk(
  'employer/interviewClient',
  ({
    employerId,
    jobId,
    applicationId,
  }: {
    employerId: string;
    jobId: string;
    applicationId: string;
  }) =>
    API.employer.changeApplicationStatus(
      employerId,
      jobId,
      applicationId,
      JobApplicationStatus.interview,
    ),
);

export const hireClient = createApiThunk(
  'employer/hireClient',
  ({
    employerId,
    jobId,
    applicationId,
  }: {
    employerId: string;
    jobId: string;
    applicationId: string;
  }) =>
    API.employer.changeApplicationStatus(
      employerId,
      jobId,
      applicationId,
      JobApplicationStatus.hired,
    ),
);

export const rejectClient = createApiThunk(
  'employer/rejectClient',
  ({
    employerId,
    jobId,
    applicationId,
  }: {
    employerId: string;
    jobId: string;
    applicationId: string;
  }) =>
    API.employer.changeApplicationStatus(
      employerId,
      jobId,
      applicationId,
      JobApplicationStatus.rejected,
    ),
);

export const notAFitClient = createApiThunk(
  'employer/notAFitClient',
  ({
    employerId,
    jobId,
    applicationId,
  }: {
    employerId: string;
    jobId: string;
    applicationId: string;
  }) =>
    API.employer.changeApplicationStatus(
      employerId,
      jobId,
      applicationId,
      JobApplicationStatus.notAFit,
    ),
);

import { ListRspClientRequest } from '@two/shared';
import { API } from '@app/api';
import type { State } from '@app/store';
import { createApiThunk } from '@app/utils';

export const createClient = createApiThunk('client/create', API.clientProfile.create);

export const updateClient = createApiThunk('client/update', API.clientProfile.update);

export const listAllJobs = createApiThunk(
  'client/jobs',
  ({ forceReload }: { forceReload?: boolean }, { getState }) => {
    const { ids } = (getState() as State).clientJobs.jobsList;
    const lastId = [...ids].pop() as string;
    return API.job.list({
      ...(!forceReload && { before: lastId }),
    });
  },
);

export const retrieveJob = createApiThunk(
  'client/job',
  ({ jobId, since }: { jobId: string; since?: Date }) =>
    API.job.retrieve(jobId, {
      ...(since ? { since } : {}),
    }),
);

export const applyJob = createApiThunk(
  'client/jobApply',
  ({ jobId, questions }: { jobId: string; questions?: { [key: string]: string }[] }) =>
    API.job.apply(jobId, {
      ...(questions ? { questions } : {}),
    }),
);

export const listAppliedJobs = createApiThunk(
  'client/applications',
  ({ forceReload, userId }: { forceReload?: boolean; userId: string }, { getState }) => {
    const { ids } = (getState() as State).clientJobs.appliedJobs;
    const lastId = [...ids].pop() as string;
    return API.clientProfile.listJobs(userId, {
      ...(!forceReload && { before: lastId }),
    });
  },
);

export const listSuggestedJobs = createApiThunk('client/suggestedJobs', (clientId: string) =>
  API.clientProfile.listSuggestedJobs(clientId),
);

export const listRsp = createApiThunk(
  'rsp/list',
  ({ userId, ...rest }: ListRspClientRequest & { userId: string }) =>
    API.clientProfile.listRsp({ userId, ...rest }),
);

export const retrieveCaseManager = createApiThunk(
  'client/caseManager',
  API.clientProfile.getCaseManager,
);

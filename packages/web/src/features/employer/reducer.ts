import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Job, JobApplicationListItem, JobApplicationStatus, JobListItem } from '@two/shared';
import { logout } from '@app/features/auth';
import type { State } from '@app/reducers';
import { ClientWithApplication } from '@app/types';
import {
  createJob,
  getClient,
  hireClient,
  listApplications,
  listJobs,
  notAFitClient,
  rejectClient,
  retrieveJob,
  updateJob,
  updateListJobs,
} from './actions';

type JobWithListApplications = {
  id: string;
  applications: JobApplicationListItem[];
  total: number;
  page?: number;
};

const jobApplicationSort: { [key in JobApplicationStatus]: number } = {
  [JobApplicationStatus.interview]: 1,
  [JobApplicationStatus.applied]: 2,
  [JobApplicationStatus.hired]: 3,
  [JobApplicationStatus.notAFit]: 4,
  [JobApplicationStatus.rejected]: 5,
  [JobApplicationStatus.expired]: 6,
};

const jobsAdapter = createEntityAdapter<JobListItem>({
  sortComparer: (a, b) => b.id.localeCompare(a.id),
});
const jobsApplicationsAdapter = createEntityAdapter<JobWithListApplications>({
  sortComparer: (a, b) => b.id.localeCompare(a.id),
});

interface JobsState {
  total: number;
  listUpdatedAt: string;
}

const initialState = {
  jobs: jobsAdapter.getInitialState<JobsState>({
    total: 0,
    listUpdatedAt: '',
  }),
  job: <Job | null>null,
  jobsApplications: jobsApplicationsAdapter.getInitialState(),
  client: <ClientWithApplication | null>null,
};

const jobApplicationsAdapterUpdate = (
  state: State['employerJobs'],
  jobId: string,
  id: string,
  jobApplicationStatus: JobApplicationStatus,
  application?: Pick<JobApplicationListItem, 'firstName' | 'lastName' | 'email' | 'phone'>,
) => {
  const applications = [...(state.jobsApplications.entities[jobId]?.applications || [])];
  const index = applications?.findIndex((el) => el.id === id);
  let updatedApplication = applications[index];
  if (updatedApplication) {
    if (application) {
      const { firstName, lastName, email, phone } = application;
      updatedApplication = { ...updatedApplication, firstName, lastName, email, phone };
    }
    updatedApplication.status = jobApplicationStatus;
    applications?.splice(index, 1, updatedApplication);

    const sortedApplications = applications.sort(
      (a, b) => jobApplicationSort[a.status] - jobApplicationSort[b.status],
    );

    jobsApplicationsAdapter.updateOne(state.jobsApplications, {
      id: jobId,
      changes: { applications: sortedApplications },
    });
  }

  if (
    [JobApplicationStatus.notAFit, JobApplicationStatus.rejected].includes(jobApplicationStatus)
  ) {
    let count = state.jobs.entities[jobId]?.applicationsCount;
    if (count) {
      count -= 1;
      if (state.job) {
        state.job.applicationsCount = count;
      }
      jobsAdapter.updateOne(state.jobs, {
        id: jobId,
        changes: {
          applicationsCount: count,
        },
      });
    }
  }

  if (jobApplicationStatus === JobApplicationStatus.hired) {
    let count = state.job?.hiredApplicationsCount;
    if (state.job && typeof count === 'number') {
      count += 1;
      state.job.hiredApplicationsCount = count;
    }
  }
};

export const { name, reducer } = createSlice({
  name: 'employerJobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, () => initialState)
      .addCase(listJobs.pending, (state, action) => {
        if (action.meta.arg?.forceReload) {
          jobsAdapter.removeAll(state.jobs);
          state.jobs.listUpdatedAt = new Date().toISOString();
        }
      })
      .addCase(listJobs.fulfilled, (state, action) => {
        jobsAdapter.upsertMany(state.jobs, action.payload.data);
        state.jobs.total = action.payload.total;
      })
      .addCase(updateListJobs.fulfilled, (state, action) => {
        jobsAdapter.upsertMany(state.jobs, action.payload.data);
        state.jobs.total = action.payload.total;
        state.jobs.listUpdatedAt = new Date().toISOString();
      })
      .addCase(createJob.fulfilled, (state, action) => {
        jobsAdapter.upsertOne(state.jobs, action.payload);
      })
      .addCase(retrieveJob.fulfilled, (state, action) => {
        if (action.payload) {
          state.job = action.payload;
        }
      })
      .addCase(listApplications.pending, (state, action) => {
        if (!state.jobsApplications.entities[action.meta.arg.jobId]) {
          jobsApplicationsAdapter.upsertOne(state.jobsApplications, {
            id: action.meta.arg.jobId,
            total: 0,
            applications: [],
            page: 0,
          });
        }
      })
      .addCase(listApplications.fulfilled, (state, action) => {
        if (action.payload.data.length) {
          const jobApplications =
            state.jobsApplications.entities[action.meta.arg.jobId]!.applications;

          const ids = jobApplications!.map((el) => el.id);
          const applications = [
            ...jobApplications,
            ...action.payload.data.filter((el) => !ids.includes(el.id)),
          ];

          jobsApplicationsAdapter.updateOne(state.jobsApplications, {
            id: action.meta.arg.jobId,
            changes: {
              applications,
              total: action.payload.total,
              page: action.payload.page!,
            },
          });
        }
      })
      .addCase(getClient.fulfilled, (state, action) => {
        if (action.payload) {
          state.client = action.payload;
          const { applicationStatus, applicationId, firstName, lastName, email, phone } =
            action.payload;
          jobApplicationsAdapterUpdate(
            state,
            action.meta.arg.jobId,
            applicationId,
            applicationStatus,
            {
              firstName,
              lastName,
              email,
              phone,
            },
          );
        }
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        if (action.payload) {
          jobsAdapter.upsertOne(state.jobs, action.payload);
          state.job = action.payload;
        }
      })
      .addCase(hireClient.fulfilled, (state, action) => {
        if (action.payload && state.client) {
          state.client = { ...state.client, applicationStatus: action.payload.status };
          const { id, status } = action.payload;
          jobApplicationsAdapterUpdate(state, action.meta.arg.jobId, id, status);
        }
      })
      .addCase(rejectClient.fulfilled, (state, action) => {
        if (action.payload && state.client) {
          state.client = { ...state.client, applicationStatus: action.payload.status };
          const { id, status } = action.payload;
          jobApplicationsAdapterUpdate(state, action.meta.arg.jobId, id, status);
        }
      })
      .addCase(notAFitClient.fulfilled, (state, action) => {
        if (action.payload) {
          const { id, status } = action.payload;
          jobApplicationsAdapterUpdate(state, action.meta.arg.jobId, id, status);
        }
      });
  },
});
export const selectTotalJobs = (state: State) => state[name].jobs.total;

export const selectClient = (state: State) => state[name].client;

export const {
  selectIds: selectJobIds,
  selectEntities: selectJobEntities,
  selectAll: selectAllJobs,
} = jobsAdapter.getSelectors((state: State) => state.employerJobs.jobs);

export const { selectById: selectJobApplicationsById, selectAll } =
  jobsApplicationsAdapter.getSelectors((state: State) => state.employerJobs.jobsApplications);

export const selectJob = (state: State) => state[name].job;
export const selectTotalJobApplications = (state: State, jobId: string) =>
  state[name].jobsApplications.entities[jobId]?.total;

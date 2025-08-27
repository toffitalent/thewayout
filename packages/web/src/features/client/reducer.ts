import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { ClientCaseManager, Job, JobListItem, RspListType } from '@two/shared';
import { login, logout } from '@app/features/auth';
import type { State } from '@app/reducers';
import {
  applyJob,
  listAllJobs,
  listAppliedJobs,
  listRsp,
  listSuggestedJobs,
  retrieveCaseManager,
  retrieveJob,
} from './actions';

const jobsListAdapter = createEntityAdapter<JobListItem>({
  sortComparer: (a, b) => b.id.localeCompare(a.id),
});

const jobsAdapter = createEntityAdapter<Job>({
  sortComparer: (a, b) => b.id.localeCompare(a.id),
});

const appliedJobsAdapter = createEntityAdapter<JobListItem>({
  sortComparer: (a, b) => b.id.localeCompare(a.id),
});

const suggestedJobsAdapter = createEntityAdapter<JobListItem>({
  sortComparer: (a, b) => b.id.localeCompare(a.id),
});

const rspAdapter = createEntityAdapter<RspListType>({
  sortComparer: false,
});

interface JobsListState {
  total: number;
  listUpdatedAt: string;
}

const initialState = {
  jobsList: jobsListAdapter.getInitialState<JobsListState>({
    total: 0,
    listUpdatedAt: '',
  }),
  jobs: jobsAdapter.getInitialState(),
  appliedJobs: appliedJobsAdapter.getInitialState<JobsListState & { forceReload: boolean }>({
    total: 0,
    listUpdatedAt: '',
    forceReload: false,
  }),
  suggestedJobs: suggestedJobsAdapter.getInitialState(),
  rspList: rspAdapter.getInitialState(),
  caseManager: <ClientCaseManager | null>null,
};

export const { name, reducer } = createSlice({
  name: 'clientJobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, () => initialState)
      .addCase(login.fulfilled, (state) => {
        jobsListAdapter.removeAll(state.jobsList);
        jobsAdapter.removeAll(state.jobs);
      })
      .addCase(listAllJobs.pending, (state, action) => {
        if (action.meta.arg?.forceReload) {
          jobsListAdapter.removeAll(state.jobsList);
          state.jobsList.listUpdatedAt = new Date().toISOString();
        }
      })
      .addCase(listAllJobs.fulfilled, (state, action) => {
        jobsListAdapter.upsertMany(state.jobsList, action.payload.data);
        state.jobsList.total = action.payload.total;
      })
      .addCase(retrieveJob.fulfilled, (state, action) => {
        if (action.payload) {
          jobsAdapter.upsertOne(state.jobs, action.payload);
        }
      })
      .addCase(applyJob.fulfilled, (state, action) => {
        if (action.payload) {
          jobsAdapter.updateOne(state.jobs, {
            id: action.payload.jobId,
            changes: { applications: [action.payload] },
          });
          state.appliedJobs.forceReload = true;
        }
      })
      .addCase(listAppliedJobs.pending, (state, action) => {
        if (action.meta.arg?.forceReload) {
          appliedJobsAdapter.removeAll(state.appliedJobs);
          state.appliedJobs.listUpdatedAt = new Date().toISOString();
          state.appliedJobs.forceReload = false;
        }
      })
      .addCase(listAppliedJobs.fulfilled, (state, action) => {
        appliedJobsAdapter.upsertMany(state.appliedJobs, action.payload.data);
        state.appliedJobs.total = action.payload.total;
      })
      .addCase(listSuggestedJobs.fulfilled, (state, action) => {
        suggestedJobsAdapter.removeAll(state.suggestedJobs);
        suggestedJobsAdapter.upsertMany(state.suggestedJobs, action.payload);
      })
      .addCase(listRsp.pending, (state) => {
        rspAdapter.removeAll(state.rspList);
      })
      .addCase(listRsp.fulfilled, (state, action) => {
        rspAdapter.upsertMany(state.rspList, action.payload.data);
      })
      .addCase(retrieveCaseManager.fulfilled, (state, action) => {
        state.caseManager = action.payload;
      });
  },
});

export const selectTotalJobs = (state: State) => state[name].jobsList.total;
export const selectTotalAppliedJobs = (state: State) => state[name].appliedJobs.total;

export const selectForceReloadAppliedJobs = (state: State) => state[name].appliedJobs.forceReload;

export const {
  selectIds: selectJobsListIds,
  selectEntities: selectJobsListEntities,
  selectAll: selectAllJobsList,
} = jobsListAdapter.getSelectors((state: State) => state.clientJobs.jobsList);

export const {
  selectIds: selectJobIds,
  selectEntities: selectJobEntities,
  selectAll: selectAllJobs,
  selectById: selectJobById,
} = jobsAdapter.getSelectors((state: State) => state.clientJobs.jobs);

export const { selectAll: selectAppliedJobs } = appliedJobsAdapter.getSelectors(
  (state: State) => state.clientJobs.appliedJobs,
);

export const { selectAll: selectSuggestedJobs } = suggestedJobsAdapter.getSelectors(
  (state: State) => state.clientJobs.suggestedJobs,
);

export const { selectAll: selectAllRsp } = rspAdapter.getSelectors(
  (state: State) => state.clientJobs.rspList,
);
export const selectCaseManager = (state: State) => state[name].caseManager;

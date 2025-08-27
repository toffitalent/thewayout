import { combineReducers } from '@reduxjs/toolkit';
import { name as auth, reducer as authReducer } from '@app/features/auth';
import { name as clientJobs, reducer as clientJobsReducer } from '@app/features/client';
import { name as employerJobs, reducer as employerJobsReducer } from '@app/features/employer';
import { name as rsp, reducer as rspReducer } from '@app/features/rsp';

export const reducer = combineReducers({
  [auth]: authReducer,
  [employerJobs]: employerJobsReducer,
  [clientJobs]: clientJobsReducer,
  [rsp]: rspReducer,
});

export type State = ReturnType<typeof reducer>;

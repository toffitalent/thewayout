import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@app/api';
import type { State } from '@app/reducers';
import { createClient, updateClient } from '../client/actions';
import { createEmployer, createJob, updateEmployer } from '../employer/actions';
import { createMember, createRsp } from '../rsp/actions';
import { fetchUser, logout, updateUser } from './actions';

export interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

export const { name, reducer } = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        if (state.user) {
          state.user.client = action.payload;
        }
      })
      .addCase(createEmployer.fulfilled, (state, action) => {
        if (state.user) {
          state.user.employer = action.payload;
        }
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        if (state.user) {
          const { firstName, lastName, phone, avatar, ...client } = action.payload;
          state.user = {
            ...state.user,
            firstName,
            lastName,
            phone,
            email: action.meta.arg.email,
            avatar,
            client: { ...client, firstName, lastName, phone },
          };
        }
      })
      .addCase(updateEmployer.fulfilled, (state, action) => {
        if (state.user) {
          state.user.employer = action.payload;
        }
      })
      .addCase(createJob.fulfilled, (state, action) => {
        if (state.user) {
          state.user.employer = action.payload.employer;
        }
      })
      .addCase(createRsp.fulfilled, (state, action) => {
        if (state.user) {
          const { phone, avatar } = action.payload.owner;
          state.user.rspAccount = action.payload.owner;
          state.user = { ...state.user, phone, avatar };
        }
      })
      .addCase(createMember.fulfilled, (state, action) => {
        if (state.user) {
          state.user.rspAccount = action.payload;
          const { phone, avatar } = action.payload;
          if (phone) state.user.phone = phone;
          if (avatar) state.user.avatar = avatar;
        }
      })
      .addMatcher(
        (action): action is PayloadAction<User> =>
          fetchUser.fulfilled.match(action) || updateUser.fulfilled.match(action),
        (state, action) => {
          state.user = action.payload;
        },
      );
  },
});

export const selectAuthUser = (state: State) => state[name].user;
export const selectAuthUserId = (state: State) => state[name].user?.id || null;

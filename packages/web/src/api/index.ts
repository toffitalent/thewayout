import { client } from './client';
import { clientProfile } from './clientProfile';
import { employer } from './employer';
import { job } from './job';
import { rsp } from './rsp';
import { uploads } from './uploads';
import { user } from './user';

export const API = {
  user,
  // Expose client and auth methods
  client,
  isAuthenticated: (...args: Parameters<typeof client.isAuthenticated>) =>
    client.isAuthenticated(...args),
  login: (...args: Parameters<typeof client.login>) => client.login(...args),
  logout: (...args: Parameters<typeof client.logout>) => client.logout(...args),
  job,
  employer,
  clientProfile,
  rsp,
  uploads,
};

export * from './client';
export * from './clientProfile';
export * from './employer';
export * from './rsp';
export * from './types';
export * from './uploads';
export * from './user';

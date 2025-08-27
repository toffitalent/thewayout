import type { AppClient } from './browser';

export const client: AppClient =
  // eslint-disable-next-line global-require
  typeof window === 'undefined' ? require('./server').client : require('./browser').client;

export type { AppClient, AuthCredentials, ClientAuthUser } from './browser';
export { ApiError, ApiErrorType } from '@disruptive-labs/client';

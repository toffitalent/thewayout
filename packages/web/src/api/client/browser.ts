import {
  Client,
  CredentialsProvider,
  CredentialsRequest as AuthCredentials,
  CredentialsUser,
  parseJwt,
} from '@disruptive-labs/client';
import { BrowserLock, BrowserStore, CookieStore } from '@disruptive-labs/client/browser';
import { AccessTokenClaims } from '@two/shared';

export interface ClientAuthUser extends CredentialsUser {
  id: string;
  userId: string;
  roles: string[];
  scope: string;
}

interface CredentialsClaims extends AccessTokenClaims {
  exp: number;
  iat: number;
}

export const client = new Client({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/',
  provider: new CredentialsProvider<ClientAuthUser, CredentialsClaims>({
    clientId: process.env.NEXT_PUBLIC_API_CLIENT_ID ?? '',
    clientSecret: process.env.NEXT_PUBLIC_API_CLIENT_SECRET ?? '',
    tokenEndpoint: '/v1/oauth/token',
    getClaims: ({ accessToken }) => parseJwt<CredentialsClaims>(accessToken),
    getUser: ({ claims, scope }) => ({
      id: claims.sub,
      userId: claims.sub,
      scope,
      roles: (claims as any).roles ?? [],
    }),
  }),
  cookie: new CookieStore({ daysUntilExpire: 90, prefix: 'auth' }),
  lock: new BrowserLock({ prefix: 'auth' }),
  store: new BrowserStore({ prefix: 'auth' }),
});

export type AppClient = typeof client;
export type { AuthCredentials };

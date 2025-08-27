import { env } from '@two/config';
import { UserType } from '@two/shared';

export const SCOPES = ['user'];

// Roles CANNOT be requested! Roles are automatically expanded to include all scopes specified.
// IMPORTANT: Ensure role names are UNIQUE and DO NOT CONFLICT with scope names!!!
export const ROLES = {
  admin: [UserType.Client, UserType.Employer, UserType.Rsp, ...SCOPES],
  self: [...SCOPES],

  [UserType.Client]: [],
  [UserType.Employer]: [],
  [UserType.Rsp]: [],
};

export const auth = () => {
  const auth = {
    algorithm: 'HS256',
    audience: 'two-api',
    issuer: 'two',
    secret: env({
      development:
        'MGICAQACEQC0GLtyi4/+XKuxzUliJ0B1AgMBAAECECyOaeG+8ZMGQ6jVVls5GIECCQDrhO4++DizMQIJAMPB/yr+OqiFAgg4tVU4TEQ6wQIIdGJ+ht0nmtECCQDHw8QHR1TrFA==',
      test: 'MGICAQACEQC0GLtyi4/+XKuxzUliJ0B1AgMBAAECECyOaeG+8ZMGQ6jVVls5GIECCQDrhO4++DizMQIJAMPB/yr+OqiFAgg4tVU4TEQ6wQIIdGJ+ht0nmtECCQDHw8QHR1TrFA==',
      env: 'API_AUTH_SECRET',
    }),
    ttl: 900,

    scopes: SCOPES,
    roles: ROLES,
  };

  const authMiddleware = {
    algorithm: auth.algorithm,
    audience: auth.audience,
    issuer: auth.issuer,
    roles: auth.roles,
    secret: auth.secret,
  };

  return { auth, server: { auth: authMiddleware } };
};

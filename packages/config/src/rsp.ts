import { env, register } from '@disruptive-labs/config';

export const rsp = register('rsp', () => ({
  myWayOut: env({
    staging: '018c3bd7-f947-7fad-bacc-dcfc7dd40a04',
    production: '018c6546-2ece-7d63-be06-b3a2b90b8975',
  }),
  employMilwaukee: env({
    production: '018ca7f7-daa8-78e9-a829-1b9d11aecc21',
  }),
  wowWorks: env({
    production: '018c8879-8688-7c27-b946-cf440df83816',
  }),
}));

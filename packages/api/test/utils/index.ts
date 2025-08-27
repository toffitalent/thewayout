import * as dbFixtures from '@app/db/fixtures';

export * from './auth';
export * from './db';
export * from './request';
export * from '@app/db/utils';

export const fixtures = {
  ...dbFixtures,
  unknownId: '00000000-0000-0000-0000-000000000000',
};

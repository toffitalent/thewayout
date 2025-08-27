import { init } from '@disruptive-labs/config';
import findUp from 'find-up';
import { basename, resolve } from 'path';
import { analytics } from './analytics';
import { clients } from './clients';
import { company } from './company';
import { rsp } from './rsp';
import { sentry } from './sentry';
import { slack } from './slack';
import { subscriptionsPlans } from './subscriptionsPlans';
import { uploads } from './uploads';
import { urls } from './urls';

const config = init({
  envFilePath: [
    // ENVFILE path
    process.env.ENVFILE || '',
    // Current directory
    resolve(process.cwd(), '.env'),
    // Package directory
    findUp.sync((dir) => (basename(dir) === 'packages' ? findUp.stop : '.env')) || '',
    // Config package directory
    resolve(__dirname, '../.env'),
    // Monorepo root
    resolve(__dirname, '../../../.env'),
  ].filter(Boolean),
  expandVariables: true,
  ignoreEnvFile: process.env.IGNORE_ENV_FILES === 'true',
  load: [analytics, clients, company, sentry, uploads, urls, slack, subscriptionsPlans, rsp],
});

export default config;
export { env, load, register } from '@disruptive-labs/config';

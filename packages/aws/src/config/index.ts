import { env, Manager } from '@disruptive-labs/config';
import { App } from 'aws-cdk-lib';
import { URL } from 'url';
import { secrets } from './secrets';

const DEPLOY = ['mail', 'web'];
let appEnv: string;

export const getDeployConfig = (context = '') => {
  const deploy = context.split(',').map((value) => value.toLowerCase().trim());

  return DEPLOY.reduce(
    (config, item) => ({
      ...config,
      [item]: deploy.includes('true') || deploy.includes(item),
    }),
    {},
  );
};

export const getEnvId = (id: string) =>
  `${appEnv.replace(/^\w/, (char) => char.toUpperCase())}-${id}`;

export const getHostname = (url?: string) => {
  if (!url) throw new Error('Missing required URL config');
  return new URL(url).hostname;
};

export const loadConfig = (app: App): Manager => {
  appEnv = app.node.tryGetContext('env')?.toLowerCase();

  if (!appEnv) {
    throw new Error(
      'Context env variable missing. Specify environment using the context option, e.g. `-c env=production`',
    );
  }

  if (process.env.APP_ENV && process.env.APP_ENV !== appEnv) {
    throw new Error(
      `Env mismatch! APP_ENV is set to "${process.env.APP_ENV}" but env context is "${appEnv}"`,
    );
  }

  // Set APP_ENV before loading main config
  process.env.APP_ENV = appEnv;
  process.env.NODE_ENV = process.env.NODE_ENV || appEnv;

  // eslint-disable-next-line global-require
  const { default: config, load } = require('@two/config');

  load('aws', [
    () => ({
      account: env('AWS_ACCOUNT', '114149725394'),
      region: env('AWS_REGION', 'us-west-2'),
      deploy: getDeployConfig(app.node.tryGetContext('deploy')),
      // Convert all configured URLs to hostnames
      hostnames: Object.keys(config.get('urls', {})).reduce(
        (urls, key) => ({
          ...urls,
          [key]: getHostname(config.get(`urls.${key}`)),
        }),
        {},
      ),
      secrets,
    }),
  ]);

  return config;
};

export type Config = ReturnType<typeof loadConfig>;

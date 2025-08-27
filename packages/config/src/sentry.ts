import { env, register } from '@disruptive-labs/config';

export const sentry = register('sentry', () => ({
  // Common
  url: 'https://sentry.io/',
  org: env('SENTRY_ORG', 'disruptive-labs'),
  token: env('SENTRY_AUTH_TOKEN', ''),
  release: env('APP_VERSION', ''),

  // Packages
  api: {
    project: 'two-api',
    dsn: env({
      staging: 'https://ef99954d3d7d469f8bf555f042c62ce9@o227825.ingest.sentry.io/4504436804878336',
      production:
        'https://ef99954d3d7d469f8bf555f042c62ce9@o227825.ingest.sentry.io/4504436804878336',
      env: 'SENTRY_DSN',
    }),
  },
  mail: {
    project: 'two-mail',
    dsn: env({
      staging: 'https://2b6e405cbe974ab397c7052a22c17ee4@o227825.ingest.sentry.io/4504436808089600',
      production:
        'https://2b6e405cbe974ab397c7052a22c17ee4@o227825.ingest.sentry.io/4504436808089600',
      env: 'SENTRY_DSN',
    }),
  },
  web: {
    project: 'two-web',
    csp: env({
      staging:
        'https://o227825.ingest.sentry.io/api/4504436810645504/security/?sentry_key=e498c215051d44b6b2c775ec6fbbbb93',
      production:
        'https://o227825.ingest.sentry.io/api/4504436810645504/security/?sentry_key=e498c215051d44b6b2c775ec6fbbbb93',
      env: 'SENTRY_CSP',
    }),
    dsn: env({
      staging: 'https://e498c215051d44b6b2c775ec6fbbbb93@o227825.ingest.sentry.io/4504436810645504',
      production:
        'https://e498c215051d44b6b2c775ec6fbbbb93@o227825.ingest.sentry.io/4504436810645504',
      env: 'SENTRY_DSN',
    }),
  },
}));

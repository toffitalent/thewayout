const { default: config } = require('@two/config');

const appEnv =
  process.env.APP_ENV || process.env.CONFIG_NODE_ENV || process.env.NODE_ENV || 'development';

// Next.js doesn't like other environments
process.env.NODE_ENV = appEnv === 'development' ? 'development' : 'production';

module.exports = {
  PORT: process.env.PORT || 8000,
  APP_ENV: appEnv,
  PUBLIC_URL: config.get('urls.web'),
  UPLOADS_BUCKET: `https://${config.get('uploads.default.bucket')}.s3.amazonaws.com`,
  UPLOADS_URL: config.get('uploads.default.url'),

  // Build
  SENTRY_CSP: config.get('sentry.web.csp', ''),
  SENTRY_DSN: config.get('sentry.web.dsn', ''),
  SENTRY_ORG: config.get('sentry.org', ''),
  SENTRY_PROJECT: config.get('sentry.web.project', ''),
  SENTRY_RELEASE: process.env.APP_VERSION,

  // Public
  NEXT_PUBLIC_APP_ENV: appEnv,
  NEXT_PUBLIC_API_URL: config.get('urls.api'),
  NEXT_PUBLIC_API_CLIENT_ID: config.get('clients.web.id'),
  NEXT_PUBLIC_API_CLIENT_SECRET: config.get('clients.web.secret'),
  NEXT_PUBLIC_SEGMENT_KEY: config.get('analytics.segment.web', ''),
  NEXT_PUBLIC_SENTRY_DSN: config.get('sentry.web.dsn', ''),
  NEXT_PUBLIC_TITLE: config.get('company.name'),
  NEXT_PUBLIC_DESCRIPTION: config.get('company.description'),
};

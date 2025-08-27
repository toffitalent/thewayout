import { env, load } from '@two/config';

const mail = () => ({
  queue: {
    endpoint: env('AWS_ENDPOINT_URL'),
    region: env({
      default: 'us-west-2',
      env: 'AWS_REGION',
    }),
    url: env({
      default: '',
      test: '__QUEUE_URL__',
      env: 'MAIL_QUEUE_URL',
    }),
  },
  transport: env({
    development: 'smtp',
    test: 'json',
    staging: 'json',
    production: 'ses',
  }),
  sendgrid: {
    apiKey: env('SENDGRID_API_KEY', ''),
  },
  smtp: {
    host: env('MAIL_SMTP_HOST', 'localhost'),
    port: env('MAIL_SMTP_PORT', 1025),
  },
});

export const mailConfig = load('mail', [mail]);

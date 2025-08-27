import { env, register } from '@disruptive-labs/config';

export const uploads = register('uploads', () => ({
  default: {
    bucket: env({
      development: 'thewayout-dev',
      test: '__UPLOADS_BUCKET_DEFAULT__',
      staging: 'thewayout-staging-uploads',
      production: 'thewayout-production-uploads',
      env: 'UPLOADS_BUCKET_DEFAULT',
    }),
    url: env({
      development: 'https://thewayout-dev.s3.amazonaws.com',
      test: '__UPLOADS_URL_DEFAULT__',
      staging: 'https://usercontent.thewayout.dev',
      production: 'https://usercontent.thewayouthelps.com',
      env: 'UPLOADS_URL_DEFAULT',
    }),
  },
}));

import { env, register } from '@disruptive-labs/config';

export const urls = register('urls', () => ({
  api: env({
    development: 'http://localhost:3000/api',
    test: 'http://__API__',
    staging: 'https://www.thewayout.dev/api',
    production: 'https://www.thewayouthelps.com/api',
    env: 'API_URL',
  }),
  mail: env({
    development: 'http://localhost:8080',
    test: 'http://__MAIL__',
    staging: 'https://mail-assets.thewayout.dev',
    production: 'https://mail-assets.thewayouthelps.com',
    env: 'MAIL_URL',
  }),
  web: env({
    development: 'http://localhost:8000',
    test: 'http://__WEB__',
    staging: 'https://www.thewayout.dev',
    production: 'https://www.thewayouthelps.com',
    env: 'WEB_URL',
  }),
}));

import { env, register } from '@two/config';

export const tasks = register('tasks', () => ({
  queue: {
    endpoint: env('AWS_ENDPOINT_URL'),
    region: env({
      default: 'us-west-2',
      env: 'AWS_REGION',
    }),
    url: env({
      default: '',
      test: '__QUEUE_URL__',
      env: 'API_TASKS_QUEUE_URL',
    }),
  },
}));

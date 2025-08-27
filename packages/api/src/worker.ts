import './config';

import { Message, SQSClient } from '@aws-sdk/client-sqs';
import { Consumer } from 'sqs-consumer';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import config from '@two/config';
import { knex } from './db';
import { Sentry } from './services/Sentry';
import type { SerializedTask } from './tasks';
import * as Tasks from './tasks';

type TasksType = typeof Tasks;
type TasksMap = Record<string, TasksType[keyof TasksType]>;

const taskMap: TasksMap = Object.values(Tasks).reduce((acc, task) => {
  acc[task.taskName] = task;
  return acc;
}, {} as TasksMap);

async function runTask(taskName: string, payload: any) {
  const task = new taskMap[taskName](payload);
  await task.handle();
}

const isSerializedTask = (obj: any): obj is SerializedTask<any> =>
  typeof obj === 'object' && typeof obj.task === 'string';

async function handleMessage(message: Message) {
  const body = JSON.parse(message.Body ?? '{}');

  if (isSerializedTask(body)) {
    await runTask(body.task, body.payload);
  }
}

function handleError(error: Error, msg?: Message | Message[] | void) {
  const message = (Array.isArray(msg) ? msg[0] : msg) || {};

  Sentry.captureException(error, {
    contexts: { message: { body: message.Body ?? '', id: message.MessageId ?? '' } },
  });
}

yargs(hideBin(process.argv))
  .command<{ task: string; payload?: object }>(
    'run <task>',
    'Run a specific task',
    (yargs) =>
      yargs.positional('task', { type: 'string' }).option('payload', { coerce: JSON.parse }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ({ task, payload, _, $0, ...rest }) => {
      try {
        await runTask(task, { ...payload, ...rest });
        await knex.destroy();
      } catch (err) {
        Sentry.captureException(err);
        throw err;
      }
    },
  )
  .command(
    '*',
    'Start worker',
    () => null,
    async () => {
      const app = new Consumer({
        queueUrl: config.get('api.tasks.queue.url', ''),
        handleMessage,
        sqs: new SQSClient({
          endpoint: config.get('api.tasks.queue.endpoint'),
          region: config.get('api.tasks.queue.region', ''),
        }),
      });

      app.on('error', handleError);
      app.on('processing_error', handleError);

      process.on('SIGINT', () => app.stop({ abort: true }));
      process.on('SIGTERM', () => app.stop({ abort: true }));

      app.start();
    },
  )
  .help().argv;

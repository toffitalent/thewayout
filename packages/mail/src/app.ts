import './config';
import './paths';

import * as aws from '@aws-sdk/client-ses';
import { Message, SQSClient } from '@aws-sdk/client-sqs';
import * as Sentry from '@sentry/node';
import nodemailer from 'nodemailer';
import { Consumer } from 'sqs-consumer';
import config from '@two/config';
import { EmailId, Emails } from './emails';
import { EmailMessage } from './types';

if (config.get('sentry.api.dsn')) {
  Sentry.init({
    dsn: config.get('sentry.mail.dsn'),
    environment: process.env.APP_ENV || process.env.NODE_ENV,
    release: config.get('sentry.release'),
  });
}

export function getTransport(transport: string) {
  switch (transport) {
    case 'ses':
      return nodemailer.createTransport({
        SES: {
          aws,
          ses: new aws.SES({
            region: config.get('mail.queue.region'),
          }),
        },
      });
    case 'smtp':
      return nodemailer.createTransport(config.get('mail.smtp'));
    default:
      return nodemailer.createTransport({ jsonTransport: true });
  }
}

export function isEmailMessage(body: any): body is EmailMessage<any> {
  return typeof body === 'object' && body?.template in Emails && typeof body?.to !== 'undefined';
}

export async function render<T extends EmailId>(
  template: T,
  context: ConstructorParameters<(typeof Emails)[T]>[0],
) {
  const email = new Emails[template](context as any);
  return email.render();
}

export const transport = getTransport(config.get('mail.transport', 'json'));

export async function handleMessage(message: Message) {
  const body = JSON.parse(message.Body ?? '{}');

  if (isEmailMessage(body)) {
    const { template, context = {}, ...mail } = body;
    const res = await render(template, context);

    await transport.sendMail({
      from: {
        address: config.get('company.emailFromAddress', ''),
        name: config.get('company.emailFromName', ''),
      },
      ...res,
      ...mail,
    });
  }
}

export function handleError(error: Error, msg?: Message | Message[] | void) {
  const message = (Array.isArray(msg) ? msg[0] : msg) || {};

  Sentry.captureException(error, {
    contexts: { message: { body: message.Body ?? '', id: message.MessageId ?? '' } },
  });
}

const app = new Consumer({
  queueUrl: config.get('mail.queue.url', ''),
  handleMessage,
  sqs: new SQSClient({
    endpoint: config.get('mail.queue.endpoint'),
    region: config.get('mail.queue.region'),
  }),
});

app.on('error', handleError);
app.on('processing_error', handleError);

process.on('SIGINT', () => app.stop({ abort: true }));
process.on('SIGTERM', () => app.stop({ abort: true }));

app.start();

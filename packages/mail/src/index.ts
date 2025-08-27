import './config';

import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import crypto from 'crypto';
import { SendMailOptions } from 'nodemailer';
import config from '@two/config';
import type { EmailId, Emails } from './emails';
import type { EmailMessage } from './types';

interface ObjectionModel extends Record<string, unknown> {
  $toJson: () => unknown;
}

function isObjectionModel(value: any): value is ObjectionModel {
  return typeof value === 'object' && value != null && typeof value.$toJson === 'function';
}

export function serialize<T extends Record<string, any>>(context: T): T {
  return Object.entries(context).reduce((acc, [key, value]) => {
    // Check if value is an objection model and use model.$toJson method to serialize
    acc[key as keyof T] = isObjectionModel(value) ? value.$toJson() : value;
    return acc;
  }, {} as T);
}

const sqs = new SQSClient({
  endpoint: config.get('mail.queue.endpoint'),
  region: config.get('mail.queue.region'),
});

export async function send<T extends EmailId>(
  mail:
    | (SendMailOptions & { to: EmailMessage<T>['to'] })
    | { name: string; address: string }
    | { name: string; email: string }
    | string,
  template: T,
  context: ConstructorParameters<(typeof Emails)[T]>[0],
) {
  let mailOptions: SendMailOptions & { to: EmailMessage<T>['to'] } = { to: '' };

  if (typeof mail === 'string') {
    mailOptions.to = mail;
  } else if ('email' in mail) {
    mailOptions.to = {
      address: mail.email,
      name: mail.name,
    };
  } else if ('address' in mail) {
    mailOptions.to = mail;
  } else {
    mailOptions = mail;
  }

  const message: EmailMessage<T> = {
    ...mailOptions,
    template,
    context: serialize(context),
  };

  const MessageBody = JSON.stringify(message);

  await sqs.send(
    new SendMessageCommand({
      QueueUrl: config.get('mail.queue.url', ''),
      MessageBody,
      MessageDeduplicationId: crypto.createHash('sha256').update(MessageBody).digest('hex'),
      MessageGroupId: template,
    }),
  );
}

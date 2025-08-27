import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import config from '@two/config';
import { send } from '../index';

describe('send()', () => {
  const user = { firstName: 'Test', lastName: 'User' };
  let clientSend: jest.SpyInstance;

  beforeEach(() => {
    // @ts-ignore
    clientSend = jest.spyOn(SQSClient.prototype, 'send').mockResolvedValue({});
  });

  test('adds email to queue', async () => {
    const res = await send('test@example.com', 'Welcome', { user });
    expect(res).toBeUndefined();
    expect(clientSend).toBeCalledTimes(1);
    expect(SendMessageCommand).toBeCalledWith({
      QueueUrl: config.get('mail.queue.url', ''),
      MessageBody: JSON.stringify({
        to: 'test@example.com',
        template: 'Welcome',
        context: { user },
      }),
      MessageDeduplicationId: expect.any(String),
      MessageGroupId: 'Welcome',
    });
  });

  test('accepts name/email argument', async () => {
    const res = await send(
      {
        email: 'test@example.com',
        name: 'Test User',
      },
      'SecurityEmail',
      { user },
    );

    expect(res).toBeUndefined();
    expect(clientSend).toBeCalledTimes(1);
    expect(SendMessageCommand).toBeCalledWith({
      QueueUrl: config.get('mail.queue.url', ''),
      MessageBody: JSON.stringify({
        to: {
          address: 'test@example.com',
          name: 'Test User',
        },
        template: 'SecurityEmail',
        context: { user },
      }),
      MessageDeduplicationId: expect.any(String),
      MessageGroupId: 'SecurityEmail',
    });
  });

  test('accepts name/address argument', async () => {
    const res = await send(
      {
        address: 'test@example.com',
        name: 'Test User',
      },
      'SecurityEmail',
      { user },
    );

    expect(res).toBeUndefined();
    expect(clientSend).toBeCalledTimes(1);
    expect(SendMessageCommand).toBeCalledWith({
      QueueUrl: config.get('mail.queue.url', ''),
      MessageBody: JSON.stringify({
        to: {
          address: 'test@example.com',
          name: 'Test User',
        },
        template: 'SecurityEmail',
        context: { user },
      }),
      MessageDeduplicationId: expect.any(String),
      MessageGroupId: 'SecurityEmail',
    });
  });

  test('accepts mail options argument', async () => {
    const res = await send(
      {
        to: {
          address: 'test@example.com',
          name: 'Test User',
        },
        cc: {
          address: 'test2@example.com',
          name: 'Test User2',
        },
      },
      'Welcome',
      { user },
    );

    expect(res).toBeUndefined();
    expect(clientSend).toBeCalledTimes(1);
    expect(SendMessageCommand).toBeCalledWith({
      QueueUrl: config.get('mail.queue.url', ''),
      MessageBody: JSON.stringify({
        to: {
          address: 'test@example.com',
          name: 'Test User',
        },
        cc: {
          address: 'test2@example.com',
          name: 'Test User2',
        },
        template: 'Welcome',
        context: { user },
      }),
      MessageDeduplicationId: expect.any(String),
      MessageGroupId: 'Welcome',
    });
  });

  test('serializes objection models in context', async () => {
    class TestModel {
      constructor(
        public firstName: string,
        public lastName: string,
      ) {}

      $toJson() {
        return {
          firstName: this.firstName,
          lastName: this.lastName,
        };
      }

      toJSON() {
        return {};
      }
    }

    const user = new TestModel('Test', 'User');
    const res = await send('test@example.com', 'Welcome', { user });
    expect(res).toBeUndefined();
    expect(clientSend).toBeCalledTimes(1);
    expect(SendMessageCommand).toBeCalledWith({
      QueueUrl: config.get('mail.queue.url', ''),
      MessageBody: JSON.stringify({
        to: 'test@example.com',
        template: 'Welcome',
        context: { user: { firstName: 'Test', lastName: 'User' } },
      }),
      MessageDeduplicationId: expect.any(String),
      MessageGroupId: 'Welcome',
    });
  });
});

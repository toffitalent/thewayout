import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import config from '@two/config';
import { User } from '@app/models';
import { fixtures, resetDb } from '@test';
import { Task } from '../Task';

class TestTask extends Task<any>('test') {
  async handle() {}
}

describe('Tasks > Base Task', () => {
  let clientSend: jest.SpyInstance;

  beforeEach(async () => {
    await resetDb();

    // @ts-ignore
    clientSend = jest.spyOn(SQSClient.prototype, 'send').mockResolvedValue({});
  });

  test('serializes payload and dispatches tasks via SQS', async () => {
    await TestTask.dispatch({ id: 'testTaskId' });
    expect(clientSend).toBeCalledTimes(1);
    expect(SendMessageCommand).toBeCalledWith({
      QueueUrl: config.get('api.tasks.queue.url', ''),
      MessageBody: JSON.stringify({
        task: 'test',
        payload: { id: 'testTaskId' },
      }),
      MessageDeduplicationId: 'test-testTaskId',
      MessageGroupId: 'test',
    });

    // Objection model
    await TestTask.dispatch(await User.query().findById(fixtures.user1.id));
    expect(clientSend).toBeCalledTimes(2);
    expect(SendMessageCommand).toBeCalledWith({
      QueueUrl: config.get('api.tasks.queue.url', ''),
      MessageBody: JSON.stringify({
        task: 'test',
        payload: { id: fixtures.user1.id },
      }),
      MessageDeduplicationId: `test-${fixtures.user1.id}`,
      MessageGroupId: 'test',
    });
  });

  test('uses getTaskId method for MessageDeduplicationId', async () => {
    class IdTest extends TestTask {
      public static getTaskId(): string | undefined {
        return '12345';
      }
    }

    await IdTest.dispatch({});
    expect(clientSend).toBeCalledTimes(1);
    expect(SendMessageCommand).toBeCalledWith({
      QueueUrl: config.get('api.tasks.queue.url', ''),
      MessageBody: JSON.stringify({
        task: 'test',
        payload: {},
      }),
      MessageDeduplicationId: '12345',
      MessageGroupId: 'test',
    });
  });
});

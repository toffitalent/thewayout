import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import config from '@two/config';
import { isObjectWithId, SerializedPayload, serializePayload } from './utils';

const sqs = new SQSClient({
  endpoint: config.get('api.tasks.queue.endpoint'),
  region: config.get('api.tasks.queue.region'),
});

type TaskPayload = { id: string } | void;

export interface SerializedTask<Payload extends TaskPayload> {
  task: string;
  payload: SerializedPayload<Payload>;
}

export function Task<Payload extends TaskPayload = void, TaskName extends string = string>(
  taskName: TaskName,
) {
  abstract class TaskClass {
    public static taskName: TaskName = taskName;

    public static serialize(payload: Payload): SerializedTask<Payload> {
      return {
        task: this.taskName,
        payload: serializePayload(payload),
      };
    }

    public static getTaskId(payload: Payload): string | undefined {
      return isObjectWithId(payload) ? `${this.taskName}-${payload.id}` : undefined;
    }

    public static async dispatch(payload: Payload): Promise<void> {
      await sqs.send(
        new SendMessageCommand({
          QueueUrl: config.get('api.tasks.queue.url', ''),
          MessageBody: JSON.stringify(this.serialize(payload)),
          MessageDeduplicationId: this.getTaskId(payload),
          MessageGroupId: this.taskName,
        }),
      );
    }

    public constructor(protected payload: SerializedPayload<Payload>) {}

    public abstract handle(): void | Promise<void>;
  }

  return TaskClass;
}

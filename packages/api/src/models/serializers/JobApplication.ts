import { Serializer } from '@disruptive-labs/objection-plugins';
import { JobApplicationStatus, UserType } from '@two/shared';
import type { JobApplication } from '../JobApplication';
import { ClientSerializer } from './Client';
import { ClientCloakedSerializer } from './ClientCloaked';
import { Options } from './utils';

export class JobApplicationSerializer extends Serializer {
  static attributes = ['id', 'clientId', 'jobId', 'status', 'createdAt', 'updatedAt'];

  static relations = ['client'];

  client(client: JobApplication['client'], jobApplication: JobApplication, options: Options) {
    if (client && options.ctx?.auth.roles.includes(UserType.Employer)) {
      return jobApplication.status === JobApplicationStatus.interview ||
        jobApplication.status === JobApplicationStatus.hired
        ? new ClientSerializer().serialize(client, options)
        : new ClientCloakedSerializer().serialize(client, options);
    }

    return undefined;
  }
}

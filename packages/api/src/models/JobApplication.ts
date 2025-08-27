import { RelationMappingsThunk } from 'objection';
import { JobApplicationStatus } from '@two/shared';
import { BaseModel } from './BaseModel';
import { Client } from './Client';
import { JobApplicationSerializer } from './serializers';

export class JobApplication extends BaseModel {
  static tableName = 'job_applications';
  static Serializer = JobApplicationSerializer;

  readonly id!: string;

  clientId!: string;
  jobId!: string;
  status!: JobApplicationStatus;
  questions!: { [key: string]: string }[];

  client?: Client;

  static relationMappings: RelationMappingsThunk = () => ({
    client: {
      relation: BaseModel.HasOneRelation,
      modelClass: Client,
      join: {
        from: 'job_applications.clientId',
        to: 'clients.id',
      },
    },
  });
}

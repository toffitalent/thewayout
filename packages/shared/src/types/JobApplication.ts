import { JobApplicationStatus } from '../constants';
import { ClientType } from './Client';
import type { Job } from './Job';

export interface JobApplication {
  id: string;
  jobId: string;
  job: Job;
  client: ClientType;
  clientId: string;
  status: JobApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplicationListItem extends Pick<JobApplication, 'id' | 'clientId' | 'status'> {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  avatar?: string;
}

import { Serializer } from '@disruptive-labs/objection-plugins';
import { UserType } from '@two/shared';
import type { Job } from '../Job';
import { Options } from './utils';

export class JobListItemSerializer extends Serializer {
  static attributes = [
    'id',
    'title',
    'department',
    'workingTime',
    'location',
    'salaryOptions',
    'createdAt',
    'updatedAt',
    'applicationStatus',
    'applicationsCount',
    'pendingApplicationsCount',
    'status',
    'typeOfWork',
    'description',
    'offensesTypes',
    'veteranOrJustice',
  ];

  applicationStatus(applicationStatus: Job['applicationStatus'], _: any, options: Options) {
    if (options.ctx?.auth.roles.includes(UserType.Client)) {
      return applicationStatus;
    }

    return undefined;
  }

  pendingApplicationsCount(
    pendingApplicationsCount: Job['pendingApplicationsCount'],
    _: any,
    options: Options,
  ) {
    if (options.ctx?.auth.roles.includes(UserType.Employer)) {
      return pendingApplicationsCount;
    }

    return undefined;
  }
}

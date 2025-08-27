import { Serializer } from '@disruptive-labs/objection-plugins';
import { UserType } from '@two/shared';
import type { Job } from '../Job';
import { JobApplicationSerializer } from './JobApplication';
import { Options } from './utils';

export class JobSerializer extends Serializer {
  static attributes = [
    'id',
    'title',
    'description',
    'department',
    'startDate',
    'typeOfWork',
    'workingTime',
    'experience',
    'numberOfOpenPositions',
    'offenses',
    'offensesTypes',
    'responsibilities',
    'skillsDescription',
    'salaryOptions',
    'location',
    'questions',
    'createdAt',
    'updatedAt',
    'applications',
    'applicationsCount',
    'hiredApplicationsCount',
    'status',
    'veteranOrJustice',
  ];

  static relations = ['employer'];

  applicationsCount(applicationsCount: Job['applicationsCount'], _: any, options: Options) {
    if (options.ctx?.auth.roles.includes(UserType.Employer)) {
      return applicationsCount;
    }

    return undefined;
  }

  applications(applications: Job['applications'], _: any, options: Options) {
    if (applications && options.ctx?.auth.roles.includes(UserType.Client)) {
      return new JobApplicationSerializer().serialize(applications, options);
    }

    return undefined;
  }

  hiredApplicationsCount(
    hiredApplicationsCount: Job['hiredApplicationsCount'],
    _: any,
    options: Options,
  ) {
    if (options.ctx?.auth.roles.includes(UserType.Employer)) {
      return hiredApplicationsCount;
    }

    return undefined;
  }
}

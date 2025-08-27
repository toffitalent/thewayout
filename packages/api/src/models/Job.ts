import { RelationMappingsThunk } from 'objection';
import {
  Experience,
  JobApplicationStatus,
  JobLocation,
  JobSalary,
  offenseCategories,
  OffenseCategory,
  OffenseCategoryType,
  TypeOfWork,
  VeteranOrJustice,
  WorkingTime,
} from '@two/shared';
import { BaseModel } from './BaseModel';
import { Employer } from './Employer';
import { JobApplication } from './JobApplication';
import { JobSerializer } from './serializers';

export class Job extends BaseModel {
  static tableName = 'jobs';
  static Serializer = JobSerializer;

  readonly id!: string;

  employerId!: string;
  title!: string;
  description!: string;
  department!: string;
  startDate!: string;
  typeOfWork!: TypeOfWork;
  workingTime!: WorkingTime;
  experience!: Experience;
  numberOfOpenPositions!: number;
  offenses?: OffenseCategory[] | null;
  responsibilities!: string[];
  skillsDescription!: string;
  salaryOptions!: JobSalary;
  location!: JobLocation | null;
  questions!: string[];
  applicationsCount!: number;
  pendingApplicationsCount?: number;
  hiredApplicationsCount?: number;
  veteranOrJustice!: VeteranOrJustice[];

  status!: string;

  applicationStatus?: JobApplicationStatus;

  employer?: Employer;
  applications?: JobApplication[];

  get offensesTypes(): OffenseCategoryType[] {
    const offensesTypes: OffenseCategoryType[] = [];
    this.offenses?.forEach((offense) => {
      Object.entries(offenseCategories).forEach(([offenseType, { categories }]) => {
        if (
          categories.includes(offense) &&
          !offensesTypes.includes(offenseType as OffenseCategoryType)
        ) {
          offensesTypes.push(offenseType as OffenseCategoryType);
        }
      });
    });

    return offensesTypes.sort();
  }

  static relationMappings: RelationMappingsThunk = () => ({
    employer: {
      relation: BaseModel.HasOneRelation,
      modelClass: Employer,
      join: {
        from: 'jobs.employerId',
        to: 'employers.id',
      },
    },

    applications: {
      relation: BaseModel.HasManyRelation,
      modelClass: JobApplication,
      join: {
        from: 'jobs.id',
        to: 'job_applications.jobId',
      },
    },
  });
}

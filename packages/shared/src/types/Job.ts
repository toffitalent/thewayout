import {
  Experience,
  JobApplicationStatus,
  JobSalaries,
  JobStatus,
  OffenseCategory,
  OffenseCategoryType,
  TypeOfWork,
  VeteranOrJustice,
  WorkingTime,
} from '../constants';
import type { JobApplication } from './JobApplication';

export interface Job {
  id: string;
  title: string;
  description: string;
  department: string;
  startDate: string;
  typeOfWork: TypeOfWork;
  workingTime: WorkingTime;
  experience: Experience;
  numberOfOpenPositions: number;
  offenses?: OffenseCategory[] | null;
  responsibilities: string[];
  skillsDescription: string;
  salaryOptions: JobSalary;
  location?: JobLocation | null;
  questions?: string[];
  applications: JobApplication[];
  createdAt: Date;
  updatedAt: Date;
  applicationStatus?: JobApplicationStatus;
  applicationsCount: number;
  hiredApplicationsCount?: number;
  status: JobStatus;
  offensesTypes: OffenseCategoryType[];
  veteranOrJustice: VeteranOrJustice[];
}

export type CreateJobRequest = Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applications'>;

// its for now, maybe we will change it later when other list will be ready
export interface JobListItem {
  id: string;
  title: string;
  description: string;
  department: string;
  workingTime: WorkingTime;
  salaryOptions: JobSalary;
  startDate: string;
  location?: JobLocation | null;
  createdAt: Date;
  updatedAt: Date;
  applicationStatus?: JobApplicationStatus;
  applicationsCount: number;
  pendingApplicationsCount?: number;
  status: JobStatus;
  typeOfWork: TypeOfWork;
  offensesTypes: OffenseCategoryType[];
  veteranOrJustice: VeteranOrJustice[];
}

export interface JobLocation {
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface JobSalary {
  salary: JobSalaries;
  min: string;
  max: string;
  description: string;
  bonuses: string[];
}

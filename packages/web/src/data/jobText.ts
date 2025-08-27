import {
  Experience,
  JobApplicationStatus,
  JobSalaries,
  JobStatus,
  TypeOfWork,
  VeteranOrJustice,
  WorkingTime,
} from '@two/shared';

export type JobEnums =
  | TypeOfWork
  | WorkingTime
  | Experience
  | JobSalaries
  | JobStatus
  | JobApplicationStatus
  | VeteranOrJustice;

export const job: { [key in JobEnums]: string } = {
  [TypeOfWork.onsite]: 'Onsite',
  [TypeOfWork.remote]: 'Remote',
  [TypeOfWork.hybrid]: 'Hybrid',
  [TypeOfWork.inPerson]: 'In-person',

  [WorkingTime.fullTime]: 'Full-time',
  [WorkingTime.partTime]: 'Part-time',
  [WorkingTime.contractor]: 'Contractor',
  [WorkingTime.seasonal]: 'Seasonal',

  [Experience.low]: 'Low',
  [Experience.entry]: 'Entry',
  [Experience.mid]: 'Mid',
  [Experience.high]: 'High',
  [Experience.professional]: 'Professional',

  [JobSalaries.hourly]: 'Hourly salary',
  [JobSalaries.yearly]: 'Yearly salary',

  [JobStatus.active]: 'Active',
  [JobStatus.paused]: 'Paused',

  [JobApplicationStatus.applied]: 'Applied',
  [JobApplicationStatus.expired]: 'Expired',
  [JobApplicationStatus.hired]: 'Hired',
  [JobApplicationStatus.interview]: 'Interview',
  [JobApplicationStatus.notAFit]: 'Not A Fit',
  [JobApplicationStatus.rejected]: 'Rejected',

  [VeteranOrJustice.veteran]: 'Veteran',
  [VeteranOrJustice.justiceImpacted]: 'Justice Impacted',
};

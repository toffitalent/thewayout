import { CreateJobRequest, JobSalaries, OffenseWizardType } from '@two/shared';

export interface WizardData
  extends Omit<CreateJobRequest, 'startDate' | 'offenses' | 'salaryOptions' | 'location'>,
    OffenseWizardType {
  // startDate
  startAtMonth: string;
  startAtYear: string;
  // salaryOptions
  salary: JobSalaries;
  min: string;
  max: string;
  salaryDescription: string;
  bonuses: string[];
  // location
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

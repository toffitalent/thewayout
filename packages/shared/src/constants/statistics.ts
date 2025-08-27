import { Age, Ethnicity, Gender, StateFederal } from './client';
import { RspClientStatus } from './rsp';
import { Support } from './support';

export enum StatCategory {
  services = 'services',
  gender = 'gender',
  age = 'age',
  ethnicity = 'ethnicity',
  veteran = 'veteran',
  offense = 'offense',
  stateOrFederal = 'stateOrFederal',
  releasedAt = 'releasedAt',
  postalCode = 'postalCode',
  status = 'status',
}

type StatisticField =
  | 'support'
  | 'gender'
  | 'age'
  | 'ethnicity'
  | 'veteranOrJustice'
  | 'offense'
  | 'stateOrFederal'
  | 'expectedReleasedAt'
  | 'postalCode'
  | 'status';

export type StatisticsType = {
  [key in StatCategory]: {
    fieldName: StatisticField;
    options?: string[];
  };
};

export const statisticField: { [key in StatCategory]: StatisticField } = {
  [StatCategory.services]: 'support',
  [StatCategory.gender]: 'gender',
  [StatCategory.age]: 'age',
  [StatCategory.ethnicity]: 'ethnicity',
  [StatCategory.veteran]: 'veteranOrJustice',
  [StatCategory.offense]: 'offense',
  [StatCategory.stateOrFederal]: 'stateOrFederal',
  [StatCategory.releasedAt]: 'expectedReleasedAt',
  [StatCategory.postalCode]: 'postalCode',
  [StatCategory.status]: 'status',
};

export const statistics: StatisticsType = {
  [StatCategory.services]: { fieldName: 'support', options: Object.keys(Support) },
  [StatCategory.gender]: { fieldName: 'gender', options: Object.keys(Gender) },
  [StatCategory.age]: { fieldName: 'age', options: Object.keys(Age) },
  [StatCategory.ethnicity]: { fieldName: 'ethnicity', options: Object.keys(Ethnicity) },
  [StatCategory.veteran]: { fieldName: 'veteranOrJustice' },
  [StatCategory.offense]: { fieldName: 'offense' },
  [StatCategory.stateOrFederal]: {
    fieldName: 'stateOrFederal',
    options: Object.keys(StateFederal),
  },
  [StatCategory.releasedAt]: { fieldName: 'expectedReleasedAt' },
  [StatCategory.postalCode]: { fieldName: 'postalCode' },
  [StatCategory.status]: { fieldName: 'status', options: Object.keys(RspClientStatus) },
};

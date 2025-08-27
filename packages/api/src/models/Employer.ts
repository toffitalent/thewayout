import type { Industry, NumberOfEmployers, State, YearsInBusiness } from '@two/shared';
import { BaseModel } from './BaseModel';
import { EmployerSerializer } from './serializers';

export class Employer extends BaseModel {
  static tableName = 'employers';
  static Serializer = EmployerSerializer;

  readonly id!: string;

  userId!: string;
  name!: string;
  industry!: Industry;
  description!: string;
  yearsInBusiness!: YearsInBusiness;
  numberOfEmployees!: NumberOfEmployers;
  address!: string;
  city!: string;
  state!: State;
  postalCode!: string;
  availableJobsCount!: number;
  availableProfilesUncloak!: number;
  avatar!: string | null;
}

import { Industry, NumberOfEmployers, State, YearsInBusiness } from '../constants';

export interface EmployerType {
  id: string;
  name: string;
  industry: Industry;
  description: string;
  yearsInBusiness: YearsInBusiness;
  numberOfEmployees: NumberOfEmployers;
  address: string;
  city: string;
  state: State;
  postalCode: string;
  availableJobsCount: number;
  availableProfilesUncloak: number;
  avatar?: string;
}

export interface EmployerCreateRequest {
  name: string;
  industry: Industry;
  description: string;
  yearsInBusiness: YearsInBusiness;
  numberOfEmployees: NumberOfEmployers;
  address: string;
  city: string;
  state: State;
  postalCode: string;
}

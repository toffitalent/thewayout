import { ClientType } from './Client';
import { EmployerType } from './Employer';
import { RspAccountType } from './Rsp';

export enum UserType {
  Client = 'client',
  Employer = 'employer',
  Rsp = 'rsp',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string | null;
  email?: string;
  type: UserType;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  client?: ClientType;
  employer?: EmployerType;
  rspAccount?: RspAccountType;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  type: UserType;
  phone?: string;
  invitationId?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  password?: string;
  newPassword?: string;
}

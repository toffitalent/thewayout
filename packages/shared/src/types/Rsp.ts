import {
  JusticeStatus,
  OffenseCategory,
  RspClientStatus,
  RspPosition,
  RspRole,
  State,
  Support,
  VeteranOrJustice,
} from '../constants';
import type { User } from './User';

export interface RspType {
  id: string;

  name: string;
  description: string;

  address: string;
  city: string;
  state: State;
  postalCode: string;
  phone?: string | null;
  email?: string | null;
  avatar?: string;

  servicesArea: string[];
  support: Support[];
  justiceStatus?: JusticeStatus[];
  offenses?: OffenseCategory[];
  veteranOrJustice: VeteranOrJustice[];
}

export type RspListType = Pick<RspType, 'id' | 'name' | 'description' | 'servicesArea' | 'support'>;

export interface RspAccountType {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: RspRole;
  position: RspPosition;
  avatar?: string;
  isProfileFilled: boolean;
  userId: string;
  caseLoad?: number;

  rspId: string;
  rsp: RspType;
}

export interface ClientCaseManager {
  firstName: string;
  lastName: string;
  avatar?: string;
  email: string;
  rspName: string;
}

export type RspAccountName = Pick<RspAccountType, 'id' | 'firstName' | 'lastName'>;

export interface CreateRspAccountRequest {
  phone: string;
  position: RspPosition;
  avatar?: string;
  rspId?: string;
}

export type CreateRspRequest = Omit<RspType, 'id'> & {
  owner: CreateRspAccountRequest;
};

export type CreateMemberRsp = Omit<CreateRspAccountRequest, 'position'>;

export interface RspAccountListItem {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatar?: string;
  caseLoad?: number;
}

export interface RspClient {
  id: string;
  status: RspClientStatus;
  userId: string;
  user: User;
  rspId: string;
  caseManagerId?: string;
  caseManager?: RspAccountType;
  notes?: string;
}

export type RspClientList = Pick<
  RspClient,
  'id' | 'rspId' | 'status' | 'user' | 'caseManagerId'
> & {
  caseManagerFirstName?: string;
  caseManagerLastName?: string;
};

export interface RspInvitation {
  id: string;
  rspId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

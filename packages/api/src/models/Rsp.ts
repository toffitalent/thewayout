import { JusticeStatus, OffenseCategory, State, Support, VeteranOrJustice } from '@two/shared';
import { BaseModel } from './BaseModel';
import { RspSerializer } from './serializers';

export class Rsp extends BaseModel {
  static tableName = 'rsp';
  static Serializer = RspSerializer;

  readonly id!: string;

  name!: string;
  description!: string;

  address!: string;
  city!: string;
  state!: State;
  postalCode!: string;
  phone!: string | null;
  email!: string | null;
  avatar!: string | null;

  servicesArea!: string[];
  support!: Support[];
  veteranOrJustice!: VeteranOrJustice[];
  justiceStatus?: JusticeStatus[];
  offenses?: OffenseCategory[];
}

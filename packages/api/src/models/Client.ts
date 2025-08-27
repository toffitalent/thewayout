import {
  Age,
  Education,
  Ethnicity,
  ExperienceSkills,
  Gender,
  JusticeStatus,
  Languages,
  License,
  MaritalStatus,
  OffenseCategory,
  Orientation,
  PersonalStrengths,
  ReferredBy,
  RelativeExperience,
  ReleasedAt,
  Religion,
  State,
  StateFederal,
  Support,
  TimeServed,
  VeteranBranchOfService,
  VeteranCampaign,
  VeteranOrJustice,
  VeteranRank,
  VeteranStatus,
  VeteranTypeDischarge,
} from '@two/shared';
import { BaseModel } from './BaseModel';
import { ClientSerializer } from './serializers';

export class Client extends BaseModel {
  static tableName = 'clients';
  static Serializer = ClientSerializer;

  readonly id!: string;

  userId!: string;
  firstName!: string;
  lastName!: string;
  justiceStatus!: JusticeStatus;
  facility!: string | null;
  expectedReleasedAt!: string | null;
  releasedCounty!: string | null;
  phone!: string | null;
  address!: string;
  city!: string;
  state!: State | string;
  postalCode!: string;
  support!: Support[];
  gender!: Gender | null;
  orientation!: Orientation | null;
  religion!: Religion | null;
  maritalStatus!: MaritalStatus | null;
  age!: Age | null;
  disability!: boolean | null;
  ethnicity!: Ethnicity | null;
  veteranStatus!: VeteranStatus | null;
  referredBy!: ReferredBy;
  personalStrengths!: PersonalStrengths[];
  experience!: ExperienceSkills[];
  languages!: Languages[];
  offense!: OffenseCategory[] | null;
  sexualOffenderRegistry!: boolean | null;
  sbn!: boolean | null;
  timeServed!: TimeServed | null;
  releasedAt!: ReleasedAt | null;
  stateOrFederal!: StateFederal | null;
  relativeExperience!: RelativeExperience[];
  personalSummary!: string;
  education!: Education[];
  license!: License[];
  veteranOrJustice!: VeteranOrJustice[];
  veteranService?: VeteranBranchOfService[];
  veteranRank?: VeteranRank;
  veteranReservist?: boolean;
  veteranCampaigns?: VeteranCampaign[];
  veteranStartAt?: string;
  veteranEndAt?: string;
  veteranTypeDischarge?: VeteranTypeDischarge;
  veteranDd214?: boolean;
}

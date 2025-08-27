import {
  Age,
  Ethnicity,
  ExperienceSkills,
  Gender,
  JusticeStatus,
  Language,
  LanguageLevel,
  MaritalStatus,
  OffenseCategory,
  Orientation,
  PersonalStrengths,
  ReferredBy,
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
} from '../constants';

export interface RelativeExperience {
  title: string;
  company: string;
  startAtMonth: string;
  startAtYear: string;
  endAtMonth: string | null;
  endAtYear: string | null;
  location: string;
  description: string;
}

export interface Education {
  schoolIssuer: string;
  degree: string;
  areaOfStudy: string;
  startYear: string;
  yearEarned: string;
  description: string;
}

export interface License {
  licenseName: string;
  issuingOrganization: string;
  issueAtMonth: string;
  issueAtYear: string;
  expirationAtMonth: string | null;
  expirationAtYear: string | null;
}

export interface Languages {
  language: Language;
  level: LanguageLevel;
}

export interface ClientType {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  address: string;
  city: string;
  state: State | string;
  postalCode: string;
  email: string;
  support: Support[];
  gender?: Gender | null;
  orientation?: Orientation | null;
  religion?: Religion | null;
  maritalStatus?: MaritalStatus | null;
  age?: Age | null;
  disability?: boolean | null;
  ethnicity?: Ethnicity | null;
  veteranStatus?: VeteranStatus | null;
  referredBy: ReferredBy;
  personalStrengths: PersonalStrengths[];
  experience: ExperienceSkills[];
  languages: Languages[];
  relativeExperience: RelativeExperience[];
  personalSummary: string;
  education: Education[];
  license: License[];
  updatedAt: Date;
  veteranOrJustice: VeteranOrJustice[];

  // justiceImpacted client
  justiceStatus?: JusticeStatus;
  facility?: string | null;
  expectedReleasedAt?: string | null;
  releasedCounty?: string | null;
  offense?: OffenseCategory[];

  sexualOffenderRegistry?: boolean | null;
  sbn?: boolean | null;
  timeServed?: TimeServed | null;
  releasedAt?: ReleasedAt | null;
  stateOrFederal?: StateFederal | null;

  // veteran client
  veteranService?: VeteranBranchOfService[];
  veteranCampaigns?: VeteranCampaign[];
  veteranRank?: VeteranRank;
  veteranStartAt?: string;
  veteranEndAt?: string;
  veteranReservist?: boolean;
  veteranTypeDischarge?: VeteranTypeDischarge;
  veteranDd214?: boolean;
}

export type UpdateClientProfileRequest = Omit<ClientType, 'email' | 'createdAt' | 'updatedAt'> & {
  email?: string;
};

export type CreateClientProfileRequest = Omit<
  ClientType,
  'id' | 'email' | 'createdAt' | 'updatedAt'
> & {
  rspId: string;
  isNewRspMember: boolean;
};

export interface ListRspClientRequest {
  support?: Support[];
  county?: string;
  offenses?: OffenseCategory[];
  veteranOrJustice?: VeteranOrJustice[];
}

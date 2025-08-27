import {
  FieldComponentProps,
  FieldType,
  WizardChoicesProps,
  WizardStep,
} from '@disruptive-labs/ui';
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
  OffenseWizardType,
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

export enum StepsClient {
  veteranOrJustice = 'veteranOrJustice',

  veteranService = 'veteranService',
  veteranReservist = 'veteranReservist',
  veteranCampaigns = 'veteranCampaigns',
  veteranDates = 'veteranDates',
  veteranTypeDischarge = 'veteranTypeDischarge',
  veteranRank = 'veteranRank',
  veteranDd214 = 'veteranDd214',

  name = 'name',
  justice = 'justice',
  facility = 'facility',
  expectedReleasedAt = 'expectedReleasedAt',
  releasedCounty = 'releasedCounty',
  phone = 'phone',
  address = 'address',

  offenseCategory = 'offenseCategory',
  sexualOffenderRegistry = 'sexualOffenderRegistry',
  sbn = 'sbn',
  timeServed = 'timeServed',
  releasedAt = 'releasedAt',
  stateOrFederal = 'stateOrFederal',

  support = 'support',
  reentryServiceProvider = 'reentryServiceProvider',
  reentryPipeline = 'reentryPipeline',
  personalStrengths = 'personalStrengths',
  experienceSkills = 'experienceSkills',
  languages = 'languages',

  relativeExperience = 'relativeExperience',
  personalSummary = 'personalSummary',
  education = 'education',
  license = 'license',
  diversityInclusion = 'diversityInclusion',
  referredBy = 'referredBy',
}

export interface WizardData extends OffenseWizardType {
  veteranOrJustice: VeteranOrJustice[];

  firstName: string;
  lastName: string;
  phone?: string;
  // address
  address: string;
  city: string;
  state: State | string;
  postalCode: string;

  support: Support[];
  rspId?: string;
  isNewRspMember?: boolean;

  // diversityInclusion
  gender?: Gender;
  orientation?: Orientation;
  religion?: Religion;
  maritalStatus?: MaritalStatus;
  age?: Age;
  disability?: keyof typeof booleanOption;
  ethnicity?: Ethnicity;
  veteranStatus?: VeteranStatus;

  referredBy: ReferredBy;
  personalStrengths: PersonalStrengths[];
  experience: ExperienceSkills[];
  languages: Languages[];
  relativeExperience: (RelativeExperience & { stillWork: boolean })[];
  personalSummary: string;
  education: Education[];
  license: License[];

  // only justiceImpacted clients
  justiceStatus?: JusticeStatus;
  sexualOffenderRegistry?: keyof typeof booleanOption | null;
  sbn?: keyof typeof booleanOption | null;
  timeServed?: TimeServed;
  releasedAt?: ReleasedAt;
  stateOrFederal?: StateFederal;
  facility: string;
  expectedReleasedAt?: string;
  releasedCounty?: string;

  // only veteran clients
  veteranService?: VeteranBranchOfService[];
  veteranCampaigns?: VeteranCampaign[];
  veteranRank?: VeteranRank;
  veteranStartAtMonth?: string;
  veteranStartAtYear?: string;
  veteranEndAtMonth?: string;
  veteranEndAtYear?: string;
  veteranReservist?: keyof typeof booleanOption;
  veteranTypeDischarge?: VeteranTypeDischarge;
  veteranDd214?: keyof typeof booleanOption;
}

export const booleanOption = {
  yes: true,
  no: false,
};

type WizardFormFields<T> = T extends FieldType ? Omit<FieldComponentProps<T>, 'control'> : never;
export type CustomWizardField = (
  | WizardFormFields<FieldType>
  | (Omit<WizardChoicesProps, 'control'> & {
      type: 'choices';
    })
) & {
  conditionalProps?: (
    fields: Partial<
      WizardData & RelativeExperience & Education & License & Languages & { stillWork: boolean }
    >,
  ) => { [key: string]: any };
  conditionalPropsParams?: string[];
};

export type CustomWizardStep = Omit<WizardStep, 'fields' | 'id'> & {
  id: StepsClient;
  fields?: CustomWizardField[];
};

type FilterConditionally<Source, Condition> = Pick<
  Source,
  { [K in keyof Source]-?: Source[K] extends Condition ? K : never }[keyof Source]
>;

export type ArrayStepWizardData = FilterConditionally<WizardData, object[]>;
export type ArrayStepItem = ArrayStepWizardData[keyof ArrayStepWizardData][0];
export type ArrayStepItems = Array<ArrayStepItem>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type AvailableKeys = KeysOfUnion<ArrayStepItem>;

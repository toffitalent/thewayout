import {
  ClientType,
  CreateClientProfileRequest,
  JusticeStatus,
  License,
  RelativeExperience,
  ReleasedAt,
  VeteranOrJustice,
} from '@two/shared';
import { booleanOption, WizardData } from '@app/features/client/profileDataTypes';
import { getWizardOffense } from './getWizardOffense';

const getRelativeExperienceFromWizard = (items: (RelativeExperience & { stillWork: boolean })[]) =>
  items.map(({ stillWork, ...experience }) => ({
    ...experience,
    endAtMonth: stillWork ? null : experience.endAtMonth,
    endAtYear: stillWork ? null : experience.endAtYear,
  }));

const getJusticeImpactedData = (data: WizardData, isCreator?: boolean) => {
  const {
    justiceStatus,
    offenseDrugs,
    offensePropertyDamage,
    offenseSexual,
    offenseTheft,
    offenseViolent,
    offenseWhiteCollar,
    offenseMotorVehicle,
    sexualOffenderRegistry,
    sbn,
    timeServed,
    releasedAt,
    stateOrFederal,
    facility,
    expectedReleasedAt,
    releasedCounty,
  } = data;

  const isOffenseChosen = !!(
    offenseDrugs ||
    offensePropertyDamage ||
    offenseSexual ||
    offenseTheft ||
    offenseViolent ||
    offenseWhiteCollar ||
    offenseMotorVehicle ||
    sexualOffenderRegistry
  );

  const isNoOffense = justiceStatus === JusticeStatus.noOffense;
  let releasedAtRequest;
  switch (justiceStatus) {
    case JusticeStatus.noOffense:
      releasedAtRequest = null;
      break;
    case JusticeStatus.currentlyIncarcerated:
      releasedAtRequest = ReleasedAt.notCompleted;
      break;
    default:
      releasedAtRequest = releasedAt;
  }

  const requestData = {
    justiceStatus,
    offense:
      isOffenseChosen && !isNoOffense
        ? [
            ...offenseDrugs,
            ...offensePropertyDamage,
            ...offenseSexual,
            ...offenseTheft,
            ...offenseViolent,
            ...offenseWhiteCollar,
            ...offenseMotorVehicle,
          ]
        : [],
    sexualOffenderRegistry:
      offenseSexual?.length && !isNoOffense && sexualOffenderRegistry
        ? booleanOption[sexualOffenderRegistry]
        : null,
    sbn: offenseSexual?.length && !isNoOffense && sbn ? booleanOption[sbn] : null,

    // must be null for otherwise the database does not update the values
    timeServed: isNoOffense ? null : timeServed,
    releasedAt: releasedAtRequest,
    stateOrFederal: isNoOffense ? null : stateOrFederal,
    facility: data.justiceStatus === JusticeStatus.currentlyIncarcerated ? facility : null,
    expectedReleasedAt:
      data.justiceStatus === JusticeStatus.currentlyIncarcerated ? expectedReleasedAt : null,
    releasedCounty:
      data.justiceStatus === JusticeStatus.currentlyIncarcerated ? releasedCounty : null,
  };

  const requestDataCreator = isCreator
    ? {
        sexualOffenderRegistry:
          offenseSexual?.length && sexualOffenderRegistry
            ? booleanOption[sexualOffenderRegistry]
            : undefined,
        sbn: offenseSexual?.length && sbn ? booleanOption[sbn] : undefined,
        facility: data.justiceStatus === JusticeStatus.currentlyIncarcerated ? facility : undefined,
        expectedReleasedAt:
          data.justiceStatus === JusticeStatus.currentlyIncarcerated
            ? expectedReleasedAt
            : undefined,
        releasedCounty:
          data.justiceStatus === JusticeStatus.currentlyIncarcerated ? releasedCounty : undefined,
      }
    : {};

  return { ...requestData, ...requestDataCreator };
};

type DataFromWizard<T> = T extends true
  ? CreateClientProfileRequest
  : Omit<CreateClientProfileRequest, 'rspId' | 'isNewRspMember'>;

export const getClientDataFromWizard = <T extends boolean, R = DataFromWizard<T>>(
  data: WizardData,
  isCreator?: T,
): R => {
  const {
    veteranOrJustice,
    firstName,
    lastName,
    address,
    city,
    state,
    postalCode,
    support,
    rspId,
    isNewRspMember,
    referredBy,
    personalStrengths,
    experience,
    languages,
    personalSummary,
    disability,
    gender,
    orientation,
    religion,
    maritalStatus,
    age,
    ethnicity,
    veteranStatus,
    phone,
    relativeExperience,
    education,
    license,

    veteranService,
    veteranRank,
    veteranStartAtMonth,
    veteranStartAtYear,
    veteranEndAtMonth,
    veteranEndAtYear,
    veteranReservist,
    veteranCampaigns,
    veteranDd214,
    veteranTypeDischarge,
  } = data;

  const requestData = {
    veteranOrJustice,
    firstName,
    lastName,
    address,
    city,
    state,
    postalCode,
    support,
    referredBy,
    personalStrengths,
    experience,
    languages,
    personalSummary,
    relativeExperience: relativeExperience
      ? getRelativeExperienceFromWizard(relativeExperience)
      : [],
    education: education || [],
    license: license || [],
    // must be null for otherwise the database does not update the values
    disability:
      disability && booleanOption[disability] !== undefined ? booleanOption[disability] : null,
    gender: !gender ? null : gender,
    orientation: !orientation ? null : orientation,
    religion: !religion ? null : religion,
    maritalStatus: !maritalStatus ? null : maritalStatus,
    age: !age ? null : age,
    ethnicity: !ethnicity ? null : ethnicity,
    veteranStatus: !veteranStatus ? null : veteranStatus,
    phone: !phone ? null : phone,
  };

  const requestDataCreator = isCreator
    ? {
        disability: !disability ? undefined : booleanOption[disability],
        gender: !gender ? undefined : gender,
        orientation: !orientation ? undefined : orientation,
        religion: !religion ? undefined : religion,
        maritalStatus: !maritalStatus ? undefined : maritalStatus,
        age: !age ? undefined : age,
        ethnicity: !ethnicity ? undefined : ethnicity,
        veteranStatus: !veteranStatus ? undefined : veteranStatus,
        rspId,
        isNewRspMember,
      }
    : {};

  return {
    ...requestData,
    ...requestDataCreator,
    ...(veteranOrJustice.includes(VeteranOrJustice.justiceImpacted) &&
      getJusticeImpactedData(data, isCreator)),
    ...(veteranOrJustice.includes(VeteranOrJustice.veteran) && {
      veteranService,
      veteranRank,
      veteranReservist: booleanOption[veteranReservist!],
      veteranCampaigns,
      veteranDd214: booleanOption[veteranDd214!],
      veteranTypeDischarge,
      veteranStartAt: `${veteranStartAtYear}-${veteranStartAtMonth}-01`,
      veteranEndAt:
        veteranEndAtYear && veteranEndAtMonth
          ? `${veteranEndAtYear}-${veteranEndAtMonth}-01`
          : undefined,
    }),
  } as R;
};

const booleanOrUndefined = (value: boolean | null | undefined) => {
  switch (value) {
    case true:
      return 'yes';
    case false:
      return 'no';
    default:
      return undefined;
  }
};

const getRelativeExperienceInitialData = (relativeExperience: RelativeExperience[]) =>
  relativeExperience.map((exp) => ({
    ...exp,
    stillWork: !(exp.endAtMonth && exp.endAtYear),
    endAtMonth: exp.endAtMonth || '',
    endAtYear: exp.endAtYear || '',
  }));

const getLicenseInitialData = (licenses: License[]) =>
  licenses.map((license) => ({
    ...license,
    expirationAtMonth: license.expirationAtMonth || '',
    expirationAtYear: license.expirationAtYear || '',
  }));

type InitialDataType = Omit<WizardData, 'rspId' | 'isNewRspMember'> & {
  rspId?: string;
  isNewRspMember?: boolean;
};

export const getClientInitialData = (client?: ClientType) =>
  (client
    ? {
        ...client,
        // nullable to undefined
        phone: client.phone || undefined,
        gender: client.gender || undefined,
        orientation: client.orientation || undefined,
        religion: client.religion || undefined,
        maritalStatus: client.maritalStatus || undefined,
        age: client.age || undefined,
        ethnicity: client.ethnicity || undefined,
        veteranStatus: client.veteranStatus || undefined,
        // boolean
        disability: booleanOrUndefined(client?.disability),
        veteranReservist: client?.veteranReservist ? 'yes' : 'no',
        // arrays
        languages: client?.languages || [],
        relativeExperience: getRelativeExperienceInitialData(client?.relativeExperience || []),
        education: client?.education || [],
        license: getLicenseInitialData(client?.license || []),
        // justiceImpacted
        ...getWizardOffense(client?.offense || []),
        sexualOffenderRegistry: booleanOrUndefined(client?.sexualOffenderRegistry),
        sbn: booleanOrUndefined(client?.sbn),
        facility: client?.facility || '',
        expectedReleasedAt: client?.expectedReleasedAt || '',
        releasedCounty: client?.releasedCounty || '',
        timeServed: client.timeServed || undefined,
        releasedAt: client.releasedAt || undefined,
        stateOrFederal: client.stateOrFederal || undefined,
      }
    : null) as InitialDataType;

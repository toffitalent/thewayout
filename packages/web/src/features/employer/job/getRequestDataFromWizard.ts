import { Job, TypeOfWork } from '@two/shared';
import { getWizardOffense } from '@app/utils/getWizardOffense';
import { WizardData } from './createJobDataTypes';

export const getRequestDataFromWizard = (data: Partial<WizardData>) => {
  const {
    offenseDrugs,
    offensePropertyDamage,
    offenseSexual,
    offenseTheft,
    offenseViolent,
    offenseWhiteCollar,
    offenseMotorVehicle,
    startAtMonth,
    startAtYear,
    salary,
    min,
    max,
    salaryDescription,
    bonuses,
    address,
    city,
    state,
    postalCode,
    typeOfWork,
    ...rest
  } = data;

  const requestData = {
    ...rest,
    ...((offenseDrugs ||
      offensePropertyDamage ||
      offenseSexual ||
      offenseTheft ||
      offenseViolent ||
      offenseWhiteCollar ||
      offenseMotorVehicle) && {
      offenses: [
        ...(offenseDrugs || []),
        ...(offensePropertyDamage || []),
        ...(offenseSexual || []),
        ...(offenseTheft || []),
        ...(offenseViolent || []),
        ...(offenseWhiteCollar || []),
        ...(offenseMotorVehicle || []),
      ],
    }),
    ...(startAtMonth && startAtYear && { startDate: `${startAtMonth}.${startAtYear}` }),
    ...(salary &&
      min &&
      max &&
      salaryDescription &&
      bonuses && {
        salaryOptions: {
          salary,
          min,
          max,
          description: salaryDescription,
          bonuses,
        },
      }),
    // must be null otherwise the database does not update the location value
    ...(typeOfWork && typeOfWork !== TypeOfWork.onsite && { location: null }),
    ...(address &&
      city &&
      state &&
      postalCode && { location: { address, city, state, postalCode } }),
    typeOfWork,
  };

  return requestData;
};

export const getWizardJob = (job?: Job) => {
  if (!job) {
    return null;
  }

  const jobToEdit = { ...job };
  delete jobToEdit.location;

  return {
    ...jobToEdit,
    startAtMonth: jobToEdit.startDate?.split('.')[0],
    startAtYear: jobToEdit.startDate?.split('.')[1],
    ...getWizardOffense(jobToEdit.offenses || []),
    salaryDescription: jobToEdit.salaryOptions?.description,
    salary: jobToEdit.salaryOptions?.salary,
    min: jobToEdit.salaryOptions?.min,
    max: jobToEdit.salaryOptions?.max,
    bonuses: jobToEdit.salaryOptions?.bonuses,
    ...job?.location,
  };
};

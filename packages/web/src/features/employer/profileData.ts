import { WizardStep } from '@disruptive-labs/ui';
import { Industry, NumberOfEmployers, YearsInBusiness } from '@two/shared';
import { states } from '@two/shared/src/constants/states';

export enum Steps {
  name = 'name',
  industry = 'industry',
  description = 'description',
  details = 'details',
  location = 'location',
}

export const stepsConfig: Record<Steps, { id: string; title: string }> = {
  [Steps.name]: { id: 'name', title: 'Employer Name' },
  [Steps.industry]: { id: 'industry', title: 'Industry' },
  [Steps.description]: { id: 'description', title: 'Company Description' },
  [Steps.details]: { id: 'details', title: 'Company Details' },
  [Steps.location]: { id: 'location', title: 'Company Location' },
};

export const steps: WizardStep[] = [
  {
    ...stepsConfig[Steps.name],
    fields: [
      {
        label: 'Name',
        name: 'name',
        type: 'text',
        placeholder: 'E.g. ABC Company',
        validate: { required: true },
      },
    ],
    nextButtonLabel: 'Save & Next',
    nextStep: 'industry',
  },
  {
    ...stepsConfig[Steps.industry],
    fields: [
      {
        label: 'Industry',
        name: 'industry',
        type: 'select',
        options: Object.values(Industry).map((el) => ({ label: el, value: el })),
        placeholder: 'Select',
        validate: { required: true },
      },
    ],
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
    nextStep: 'description',
  },
  {
    ...stepsConfig[Steps.description],
    fields: [
      {
        label: 'Description',
        name: 'description',
        type: 'text',
        multiline: true,
        placeholder: 'Your Company description... ',
        validate: { required: true, maxLength: 1000 },
        helperText: 'Max 1,000 characters.',
      },
    ],
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
    nextStep: 'details',
  },
  {
    ...stepsConfig[Steps.details],
    fields: [
      {
        label: 'Years in Business',
        name: 'yearsInBusiness',
        type: 'select',
        options: Object.values(YearsInBusiness).map((el) => ({ label: `${el} years`, value: el })),
        placeholder: 'Select',
        validate: { required: true },
      },
      {
        label: 'Number of Employees',
        name: 'numberOfEmployees',
        type: 'select',
        options: Object.values(NumberOfEmployers).map((el) => ({ label: el, value: el })),
        placeholder: 'Select',
        validate: { required: true },
      },
    ],
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
    nextStep: 'location',
  },
  {
    ...stepsConfig[Steps.location],
    fields: [
      {
        label: 'Address',
        name: 'address',
        type: 'text',
        placeholder: 'E.g. 459 S Hewitt St',
        validate: { required: true },
      },
      {
        label: 'City',
        name: 'city',
        type: 'text',
        placeholder: 'E.g. Los Angeles',
        validate: { required: true },
      },
      {
        label: 'State',
        name: 'state',
        type: 'select',
        options: Object.entries(states).map(([key, value]) => ({ value: key, label: value })),
        placeholder: 'Select',
        validate: { required: true },
      },
      {
        label: 'ZIP Code',
        name: 'postalCode',
        type: 'text',
        placeholder: 'E.g. 90255',
        validate: { required: true },
      },
    ],
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
    nextStep: 'confirm',
  },
];

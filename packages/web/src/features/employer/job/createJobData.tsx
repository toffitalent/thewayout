import { Box, Text, WizardStep } from '@disruptive-labs/ui';
import {
  Experience,
  JobSalaries,
  offenseCategories,
  offenseText,
  states,
  TypeOfWork,
  VeteranOrJustice,
  WorkingTime,
} from '@two/shared';
import { CustomStepAllowedOffense } from '@app/components/CustomStepAllowedOffense';
import { InfoBox } from '@app/components/InfoBox';
import { job, JobEnums } from '@app/data/jobText';
import { months } from '@app/data/months';
import { WizardData } from './createJobDataTypes';
import { CustomStepDetails } from './CustomStepDetails';
import { CustomStepQuestions } from './CustomStepQuestions';
import { CustomStepResponsibilities } from './CustomStepResponsibility';
import { CustomStepSalary } from './CustomStepSalary';

export enum Steps {
  details = 'details',
  location = 'location',
  veteranOrJustice = 'veteranOrJustice',
  offenses = 'offenses',
  responsibilities = 'responsibilities',
  skills = 'skills',
  pay = 'pay',
  questions = 'questions',
}

export const stepsConfig: Record<Steps, { id: string; title: string }> = {
  [Steps.details]: { id: Steps.details, title: 'Add job details' },
  [Steps.location]: { id: Steps.location, title: 'Add job location' },
  [Steps.veteranOrJustice]: {
    id: Steps.veteranOrJustice,
    title: 'Who Can Apply For This Position?',
  },
  [Steps.offenses]: { id: Steps.offenses, title: 'Allowed Offenses' },
  [Steps.responsibilities]: {
    id: Steps.responsibilities,
    title: 'Responsibilities & Expectations',
  },
  [Steps.skills]: { id: Steps.skills, title: 'Skills & Experience' },
  [Steps.pay]: { id: Steps.pay, title: 'Pay & Benefits' },
  [Steps.questions]: { id: Steps.questions, title: 'Job Specific Questions' },
};

const years = Array.from({ length: 3 }, (_, i) => String(new Date().getFullYear() + i));

const getOptionsFromEnum = (enumObj: object) =>
  Object.entries(enumObj).map(([key, value]) => ({
    label: job[key as JobEnums],
    value,
  }));

export const steps: WizardStep[] = [
  {
    ...stepsConfig[Steps.details],
    description:
      'Please refrain from including company name or any employer-identifying information.',
    fields: [
      {
        label: 'Job Title',
        name: 'title',
        type: 'text',
        placeholder: 'E.g. Car Wash Attendant',
        validate: { required: true },
        fluid: true,
      },
      {
        label: 'Short Description',
        name: 'description',
        type: 'text',
        placeholder:
          'E.g. Wash attendants are responsible for performing the daily operational practices of running the car wash facility.',
        validate: { required: true, maxLength: 1000 },
        multiline: true,
        fluid: true,
        helperText: 'Max 1,000 characters.',
      },
      {
        label: 'Department',
        name: 'department',
        type: 'text',
        placeholder: 'E.g. Customer Service',
        validate: { required: true },
        fluid: true,
      },
      {
        name: 'startAtMonth',
        label: 'Start Date',
        type: 'select',
        options: Object.entries(months).map(([value, label]) => ({ label, value })),
        validate: { required: true },
        width: '1/2',
        display: 'inline-block',
        pr: 2,
        className: 'fieldHalfWidth',
        placeholder: 'Select month',
      },
      {
        name: 'startAtYear',
        type: 'select',
        options: years.map((el) => ({ label: el, value: el })),
        validate: { required: true },
        width: '1/2',
        display: 'inline-block',
        pl: 2,
        className: 'fieldHalfWidth',
        placeholder: 'Select year',
      },
      {
        label: 'Work Location',
        name: 'typeOfWork',
        type: 'select',
        options: getOptionsFromEnum(TypeOfWork),
        validate: { required: true },
        placeholder: 'Select',
      },
      {
        label: 'Employment Type',
        name: 'workingTime',
        type: 'select',
        options: getOptionsFromEnum(WorkingTime),
        validate: { required: true },
        placeholder: 'Select',
      },
      {
        label: 'Number of Open Positions',
        name: 'numberOfOpenPositions',
        placeholder: 'E.g. 3',
        type: 'number',
        validate: { required: true, min: 1 },
        fluid: true,
      },
    ],
    className: 'detailsStep',
    nextButtonLabel: 'Save & Next',
    component: <CustomStepDetails />,
    nextStep: (wizardData) =>
      (wizardData as WizardData).typeOfWork === TypeOfWork.onsite
        ? Steps.location
        : Steps.veteranOrJustice,
  },
  {
    ...stepsConfig[Steps.location],
    description: 'Where is the main office / place of work located?',
    fields: [
      {
        label: 'Job Address',
        name: 'address',
        type: 'text',
        placeholder: 'E.g. 7562 Center Ave',
        validate: { required: true },
      },
      {
        label: 'Town / City',
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
        placeholder: 'E.g. California',
        validate: { required: true },
      },
      {
        label: 'Postcode / Zipcode',
        name: 'postalCode',
        type: 'text',
        placeholder: 'E.g. 92806',
        validate: { required: true },
      },
    ],
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
    nextStep: Steps.veteranOrJustice,
  },
  {
    ...stepsConfig[Steps.veteranOrJustice],
    description: 'Select all that apply.',
    fields: [
      {
        name: 'veteranOrJustice',
        type: 'choices',
        options: getOptionsFromEnum(VeteranOrJustice),
        multiple: true,
        inline: true,
        validate: (value) => (value.length >= 1 ? undefined : 'Error'),
      },
    ],
    showBackButton: true,
    nextButtonLabel: 'Save & Next',
    nextStep: (wizardData) =>
      (wizardData as WizardData).veteranOrJustice.includes(VeteranOrJustice.justiceImpacted)
        ? Steps.offenses
        : Steps.responsibilities,
  },
  {
    ...stepsConfig[Steps.offenses],
    description:
      'Only candidates that meet your allowable offenses (per State and Federal statutes) can apply for the job listing & will have their profile shared with you.',
    fields: Object.entries(offenseCategories).map(([key, values]) => ({
      name: `offense${key[0].toUpperCase() + key.slice(1)}`,
      label: values.name,
      type: 'choices',
      options: values.categories.map((el) => ({ label: offenseText[el], value: el })),
      inline: true,
      multiple: true,
      className: 'offenseCategoryStep',
    })),
    component: <CustomStepAllowedOffense />,
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
    nextStep: Steps.responsibilities,
  },
  {
    ...stepsConfig[Steps.responsibilities],
    description: 'Add your job responsibilities one at a time. Be mindful of inclusive language.',
    component: <CustomStepResponsibilities />,
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
    nextStep: Steps.skills,
  },
  {
    ...stepsConfig[Steps.skills],
    fields: [
      {
        label: 'Experience',
        name: 'experience',
        type: 'select',
        options: getOptionsFromEnum(Experience),
        validate: { required: true },
        placeholder: 'Select',
      },
      {
        label: (
          <Box display="inline-flex" alignItems="center">
            <Text fontWeight="700" mr={2} mb={0}>
              Skills - Description
            </Text>
            <InfoBox content="Explain the level of experience someone needs to be successful in this job." />
          </Box>
        ),
        name: 'skillsDescription',
        type: 'text',
        multiline: true,
        validate: { required: true, maxLength: 1000 },
        placeholder:
          "E.g. The most successful and happy people have PMA – a Positive Mental Attitude! We are a huge believer in putting attitude above aptitude. We can always teach you how to do the job, but we can't teach a Positive Mental Attitude... You either have it or you don't!",
        helperText: 'Max 1,000 characters.',
      },
    ],
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
    nextStep: Steps.pay,
  },
  {
    ...stepsConfig[Steps.pay],
    fields: [
      {
        label: 'Salary',
        name: 'salary',
        type: 'select',
        options: getOptionsFromEnum(JobSalaries),
        validate: { required: true },
        placeholder: 'Select',
      },
      {
        label: 'Min Salary',
        name: 'min',
        type: 'text',
        validate: { required: true },
        width: '1/2',
        display: 'inline-block',
        pr: 2,
        className: 'fieldHalfWidth',
      },
      {
        label: 'Max Salary',
        name: 'max',
        type: 'text',
        validate: { required: true },
        width: '1/2',
        display: 'inline-block',
        pl: 2,
        className: 'fieldHalfWidth',
      },
      {
        label: (
          <Box display="inline-flex" alignItems="center">
            <Text fontWeight="700" mr={2} mb={0}>
              Pay Description
            </Text>
            <InfoBox content="Can include frequency of pay, when applicants can expect their first pay check, and any other helpful pay information" />
          </Box>
        ),
        name: 'salaryDescription',
        type: 'text',
        multiline: true,
        validate: { required: true, maxLength: 1000 },
        placeholder:
          'E.g. Starting wage is $13 per hour + tips, with an Employer Bonus after positive a 90 Day Review (provided by the employer)',
        fluid: true,
        helperText: 'Max 1,000 characters.',
      },
    ],
    component: <CustomStepSalary />,
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
    nextStep: Steps.questions,
  },
  {
    ...stepsConfig[Steps.questions],
    description: 'Ask qualifying questions that will help identify the most fit candidates.',
    component: <CustomStepQuestions />,
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
    nextStep: 'confirm',
  },
];

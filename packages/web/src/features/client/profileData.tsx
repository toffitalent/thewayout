import { Box, Text } from '@disruptive-labs/ui';
import {
  Age,
  counties,
  Ethnicity,
  ExperienceSkills,
  facilities,
  Gender,
  JusticeStatus,
  Language,
  LanguageLevel,
  MaritalStatus,
  offenseCategories,
  offenseText,
  Orientation,
  PersonalStrengths,
  ReferredBy,
  ReleasedAt,
  Religion,
  StateFederal,
  states,
  Support,
  TimeServed,
  VeteranBranchOfService,
  VeteranCampaign,
  VeteranOrJustice,
  VeteranRank,
  VeteranTypeDischarge,
} from '@two/shared';
import { CustomStepPhone } from '@app/components/CustomStepPhone';
import { InfoBox } from '@app/components/InfoBox';
import { clientProfile, ClientProfileEnums } from '@app/data/clientProfileText';
import { monthsFullName as months } from '@app/data/months';
import {
  CustomStepEducation,
  CustomStepExperience,
  CustomStepLanguage,
  CustomStepLicense,
  CustomStepOffenseCategory,
  CustomStepPersonalSummary,
  CustomStepReentryPipeline,
  CustomStepReferredBy,
  CustomStepSupportServiceProvider,
  CustomStepVeteranDatesOfService,
} from './components/wizard';
import { booleanOption, CustomWizardStep, StepsClient, WizardData } from './profileDataTypes';

const booleanOptionsChoices: { label: string; value: keyof typeof booleanOption }[] = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

export const getOptionsFromEnum = (enumObj: object) =>
  Object.entries(enumObj).map(([key, value]) => ({
    label: clientProfile[key as ClientProfileEnums],
    value,
  }));

const validateEndDate = ({
  startAtMonth,
  startAtYear,
  endAtMonth,
  endAtYear,
  errorText,
}: {
  startAtMonth?: string;
  startAtYear?: string;
  endAtMonth?: string | null;
  endAtYear?: string | null;
  errorText: string;
}) => {
  const startDate = new Date(Number(startAtYear), Number(startAtMonth));
  const endDate = new Date(Number(endAtYear), Number(endAtMonth));

  if (endAtYear && endAtMonth) {
    return endDate >= startDate ? undefined : errorText;
  }

  return undefined;
};

export const validateReleasedDate = (date: string) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const releasedDate = new Date(date).setHours(0, 0, 0, 0);
  return today < releasedDate ? undefined : 'Date must be in the future';
};

const years = Array.from({ length: 75 }, (_, i) => String(new Date().getFullYear() - i));
const yearsFuture = Array.from({ length: 18 }, (_, i) => String(new Date().getFullYear() + i));

export const steps: CustomWizardStep[] = [
  {
    id: StepsClient.veteranOrJustice,
    title: 'Are You a Veteran or Justice Impacted Individual?',
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
    nextStep: (data) =>
      (data as WizardData).veteranOrJustice.includes(VeteranOrJustice.veteran)
        ? StepsClient.veteranService
        : StepsClient.justice,
  },

  // steps for veteran
  {
    id: StepsClient.veteranService,
    title: 'Branch of Service',
    description: 'Select all that apply.',
    fields: [
      {
        name: 'veteranService',
        type: 'choices',
        options: getOptionsFromEnum(VeteranBranchOfService),
        multiple: true,
        inline: true,
        validate: (value) => (value.length >= 1 ? undefined : 'Error'),
      },
    ],
    showBackButton: true,
    nextButtonLabel: 'Save & Next',
    nextStep: StepsClient.veteranReservist,
  },
  {
    id: StepsClient.veteranReservist,
    title: 'Are You Currently a Member of the Reserves or National Guard?',
    fields: [
      {
        name: 'veteranReservist',
        type: 'choices',
        options: booleanOptionsChoices,
        inline: true,
        validate: { required: true },
      },
    ],
    showBackButton: true,
    nextButtonLabel: 'Save & Next',
    nextStep: StepsClient.veteranCampaigns,
  },
  {
    id: StepsClient.veteranCampaigns,
    title: 'Did you serve in any campaigns?',
    description: 'Select all that apply.',
    fields: [
      {
        name: 'veteranCampaigns',
        type: 'choices',
        options: getOptionsFromEnum(VeteranCampaign),
        multiple: true,
        inline: true,
      },
    ],
    showBackButton: true,
    nextButtonLabel: 'Save & Next',
    nextStep: StepsClient.veteranDates,
  },
  {
    id: StepsClient.veteranDates,
    title: 'Dates of Service',
    fields: [
      {
        name: 'veteranStartAtMonth',
        label: 'Start Date',
        placeholder: 'Month',
        type: 'select',
        options: Object.entries(months).map(([value, label]) => ({ label, value })),
        validate: { required: true },
        width: '1/2',
        display: 'inline-block',
        pr: 1,
        className: 'fieldHalfWidth',
      },
      {
        name: 'veteranStartAtYear',
        placeholder: 'Year',
        type: 'select',
        options: years.map((el) => ({ label: el, value: el })),
        validate: { required: true },
        width: '1/2',
        display: 'inline-block',
        pl: 1,
        className: 'fieldHalfWidth',
      },
      {
        name: 'veteranEndAtMonth',
        label: 'End Date',
        placeholder: 'Month',
        type: 'select',
        options: Object.entries(months).map(([value, label]) => ({ label, value })),
        width: '1/2',
        display: 'inline-block',
        pr: 1,
        className: 'fieldHalfWidth',
      },
      {
        name: 'veteranEndAtYear',
        placeholder: 'Year',
        type: 'select',
        options: years.map((el) => ({ label: el, value: el })),
        width: '1/2',
        display: 'inline-block',
        pl: 1,
        className: 'fieldHalfWidth',
      },
    ],
    component: <CustomStepVeteranDatesOfService />,
    showBackButton: true,
    nextButtonLabel: 'Save & Next',
    nextStep: StepsClient.veteranTypeDischarge,
  },
  {
    id: StepsClient.veteranTypeDischarge,
    title: 'Type of Discharge',
    fields: [
      {
        name: 'veteranTypeDischarge',
        label: 'Type of Discharge',
        type: 'select',
        options: getOptionsFromEnum(VeteranTypeDischarge),
        placeholder: 'Type of Discharge',
        validate: { required: true },
      },
    ],
    showBackButton: true,
    nextButtonLabel: 'Save & Next',
    nextStep: StepsClient.veteranRank,
  },
  {
    id: StepsClient.veteranRank,
    title: 'Rank at Discharge',
    fields: [
      {
        name: 'veteranRank',
        label: 'Rank',
        type: 'select',
        options: getOptionsFromEnum(VeteranRank),
        placeholder: 'Rank',
        validate: { required: true },
      },
    ],
    showBackButton: true,
    nextButtonLabel: 'Save & Next',
    nextStep: StepsClient.veteranDd214,
  },
  {
    id: StepsClient.veteranDd214,
    title: 'Do you have a copy of your DD-214?',
    fields: [
      {
        name: 'veteranDd214',
        type: 'choices',
        options: booleanOptionsChoices,
        inline: true,
        validate: { required: true },
      },
    ],
    showBackButton: true,
    nextButtonLabel: 'Save & Next',
    nextStep: (data) =>
      (data as WizardData).veteranOrJustice.includes(VeteranOrJustice.justiceImpacted)
        ? StepsClient.justice
        : StepsClient.phone,
  },

  // steps for justice
  {
    id: StepsClient.justice,
    title: "What's your current justice status?",
    fields: [
      {
        name: 'justiceStatus',
        type: 'choices',
        options: getOptionsFromEnum(JusticeStatus),
        inline: true,
        validate: { required: true },
      },
    ],
    showBackButton: true,
    nextStep: (data) => {
      if ((data as WizardData).justiceStatus === JusticeStatus.currentlyIncarcerated) {
        return StepsClient.facility;
      }
      if ((data as WizardData).justiceStatus === JusticeStatus.noOffense) {
        return StepsClient.phone;
      }
      return StepsClient.offenseCategory;
    },
  },
  {
    id: StepsClient.facility,
    title: 'Where Are You Currently Incarcerated?',
    fields: [
      {
        name: 'facility',
        label: 'Correctional Facility',
        type: 'select',
        options: facilities.sort().map((el) => ({ label: el, value: el })),
        placeholder: ' ',
        validate: { required: true },
      },
    ],
    showBackButton: true,
    nextButtonLabel: 'Save & Next',
    nextStep: StepsClient.expectedReleasedAt,
  },
  {
    id: StepsClient.expectedReleasedAt,
    title: 'What Is Your Expected Release Date?',
    fields: [
      {
        name: 'expectedReleasedAt',
        type: 'date',
        label: 'Expected Release Date',
        placeholder: ' ',
        validate: { required: true, validate: validateReleasedDate },
      },
    ],
    showBackButton: true,
    nextButtonLabel: 'Save & Next',
    nextStep: StepsClient.releasedCounty,
  },
  {
    id: StepsClient.releasedCounty,
    title: 'Which County Are You Being Released To?',
    fields: [
      {
        name: 'releasedCounty',
        label: 'County',
        type: 'select',
        options: counties.map((el) => ({ label: el, value: el })),
        placeholder: ' ',
        validate: { required: true },
      },
    ],
    showBackButton: true,
    nextButtonLabel: 'Save & Next',
    nextStep: (data: Partial<WizardData>) =>
      data.justiceStatus === JusticeStatus.noOffense
        ? StepsClient.phone
        : StepsClient.offenseCategory,
  },
  {
    id: StepsClient.offenseCategory,
    title: 'Nature Of Offense(s)',
    description: (
      <>
        <Text fontWeight="700">
          Important note: we will never share this information with the employer.
        </Text>
        <Text>
          Which of the following categories best describes the offense (or offenses) that you were
          convicted of? This allows us to match you with jobs that your offense won&apos;t conflict
          with.
        </Text>
      </>
    ),
    fields: Object.entries(offenseCategories).map(([key, values]) => ({
      name: `offense${key[0].toUpperCase() + key.slice(1)}`,
      label: values.name,
      type: 'choices',
      options: values.categories.map((el) => ({ label: offenseText[el], value: el })),
      inline: true,
      multiple: true,
      className: 'offenseCategoryStep',
    })),
    component: <CustomStepOffenseCategory />,
    showBackButton: true,
    nextStep: (data: Partial<WizardData>) =>
      data.offenseSexual && data.offenseSexual.length
        ? StepsClient.sexualOffenderRegistry
        : StepsClient.timeServed,
  },
  {
    id: StepsClient.sexualOffenderRegistry,
    title: 'Are you on the sexual offender registry?',
    fields: [
      {
        name: 'sexualOffenderRegistry',
        type: 'choices',
        options: booleanOptionsChoices,
        inline: true,
      },
    ],
    showBackButton: true,
    nextStep: StepsClient.sbn,
  },
  {
    id: StepsClient.sbn,
    title: 'Are you on the Special Bulletin Notifications (SBN)?',
    fields: [
      {
        name: 'sbn',
        type: 'choices',
        options: booleanOptionsChoices,
        inline: true,
      },
    ],
    showBackButton: true,
    nextStep: StepsClient.timeServed,
  },
  {
    id: StepsClient.timeServed,
    title: 'Time Served',
    description:
      'Which range of time most accurately represents the total amount of time served for your conviction(s)?\nIf currently incarcerated, in a halfway house or under supervised release, amount of time you will have served upon completion of current status.',
    fields: [
      {
        name: 'timeServed',
        type: 'choices',
        options: getOptionsFromEnum(TimeServed),
        inline: true,
        validate: { required: true },
      },
    ],
    showBackButton: true,
    nextStep: (data) =>
      (data as WizardData).justiceStatus === JusticeStatus.currentlyIncarcerated
        ? StepsClient.stateOrFederal
        : StepsClient.releasedAt,
  },
  {
    id: StepsClient.releasedAt,
    title: 'Completed Sentence',
    description: 'How long ago did you complete your sentence?',
    fields: [
      {
        name: 'releasedAt',
        type: 'choices',
        options: getOptionsFromEnum(ReleasedAt),
        inline: true,
        validate: { required: true },
      },
    ],
    showBackButton: true,
    nextStep: StepsClient.stateOrFederal,
  },
  {
    id: StepsClient.stateOrFederal,
    title: 'State or Federal Offense',
    description: 'Was your conviction State, Federal, or both?',
    fields: [
      {
        name: 'stateOrFederal',
        type: 'choices',
        options: getOptionsFromEnum(StateFederal),
        inline: true,
        validate: { required: true },
      },
    ],
    showBackButton: true,
    nextStep: StepsClient.phone,
  },

  // steps for all
  {
    id: StepsClient.phone,
    title: "What's your phone number?",
    fields: [
      {
        label: (
          <Box display="inline-flex">
            <Text>Phone Number &nbsp;</Text>
            <Text fontWeight="400">(Optional)</Text>
          </Box>
        ),
        name: 'phone',
        type: 'text',
        placeholder: 'Add your phone number',
      },
    ],
    component: <CustomStepPhone />,
    showBackButton: true,
    nextStep: StepsClient.address,
  },
  {
    id: StepsClient.address,
    title: "What's your address?",
    fields: [
      {
        label: 'Your Address',
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
    showBackButton: true,
    nextStep: StepsClient.support,
  },
  {
    id: StepsClient.support,
    title: 'What kind of support do you need?',
    description:
      "We know employment alone is often not enough. Please choose the additional support services you need, and we'll do our best to match you with a reentry service provider (RSP) that can help provide resources.",
    fields: [
      {
        name: 'support',
        type: 'choices',
        options: getOptionsFromEnum(Support),
        multiple: true,
        inline: true,
      },
    ],
    showBackButton: true,
    nextStep: StepsClient.reentryServiceProvider,
  },
  {
    id: StepsClient.reentryServiceProvider,
    title: (
      <Box display="inline-flex" alignItems="center">
        <Text fontSize="2xl" fontWeight="700" mr={4}>
          Support Service Provider
        </Text>
        <InfoBox content="An organization that provides additional supportive services to assist in your reentry." />
      </Box>
    ),
    description: 'Which of the following Support Service Providers are you currently working with?',
    component: <CustomStepSupportServiceProvider />,
    showBackButton: true,
    nextStep: (data) =>
      (data as WizardData).isNewRspMember
        ? StepsClient.reentryPipeline
        : StepsClient.personalStrengths,
  },
  {
    id: StepsClient.reentryPipeline,
    title: 'Reentry pipeline',
    description:
      'Choose a reentry service provider that best matches your needs. Note: it may take between 24-48 hours for a response.',
    component: <CustomStepReentryPipeline />,
    showBackButton: true,
    nextStep: StepsClient.personalStrengths,
  },
  {
    id: StepsClient.personalStrengths,
    title: 'Personal Strengths',
    description: 'Select your top 5 personal strengths that best describe you',
    fields: [
      {
        name: 'personalStrengths',
        type: 'choices',
        options: getOptionsFromEnum(PersonalStrengths),
        inline: true,
        multiple: true,
        validate: (value) => (value.length === 5 ? undefined : 'Error'),
        maxChoices: 5,
      },
    ],
    showBackButton: true,
    nextStep: StepsClient.experienceSkills,
  },
  {
    id: StepsClient.experienceSkills,
    title: 'Experience/Skills',
    description:
      'Which of the following trades/industries do you have at least 2 years of experience in (choose all that apply)?',
    fields: [
      {
        name: 'experience',
        type: 'choices',
        options: getOptionsFromEnum(ExperienceSkills),
        inline: true,
        multiple: true,
      },
    ],
    showBackButton: true,
    nextStep: StepsClient.languages,
  },
  {
    id: StepsClient.languages,
    title: 'Add your languages',
    description: 'Start with your native language. You can add more languages you know later.',
    component: <CustomStepLanguage />,
    fields: [
      {
        name: 'language',
        type: 'select',
        options: getOptionsFromEnum(Language),
        label: 'Language',
        placeholder: 'Select',
        validate: { required: true },
      },
      {
        name: 'level',
        type: 'select',
        options: getOptionsFromEnum(LanguageLevel),
        label: 'Level',
        placeholder: 'Select',
        validate: { required: true },
      },
    ],
    showBackButton: true,
    nextStep: StepsClient.relativeExperience,
  },
  {
    id: StepsClient.relativeExperience,
    fields: [
      {
        name: 'title',
        label: 'Title',
        placeholder: 'E.g. Store Manager',
        type: 'text',
        validate: { required: true },
      },
      {
        name: 'company',
        label: 'Company',
        placeholder: 'E.g. ABC Company LLC ',
        type: 'text',
        validate: { required: true },
      },
      {
        name: 'startAtMonth',
        label: 'Start Date',
        placeholder: 'Month',
        type: 'select',
        options: Object.entries(months).map(([value, label]) => ({ label, value })),
        validate: { required: true },
        width: '1/2',
        display: 'inline-block',
        pr: 1,
        className: 'fieldHalfWidth',
      },
      {
        name: 'startAtYear',
        placeholder: 'Year',
        type: 'select',
        options: years.map((el) => ({ label: el, value: el })),
        validate: { required: true },
        width: '1/2',
        display: 'inline-block',
        pl: 1,
        className: 'fieldHalfWidth',
      },
      {
        name: 'endAtMonth',
        label: 'End Date',
        placeholder: 'Month',
        type: 'select',
        options: Object.entries(months).map(([value, label]) => ({ label, value })),
        width: '1/2',
        display: 'inline-block',
        pr: 1,
        className: 'fieldHalfWidth',
        conditionalProps: ({ startAtMonth, startAtYear, endAtMonth, endAtYear, stillWork }) => ({
          validate: {
            required: !stillWork,
            validate: () => {
              if (stillWork) {
                return undefined;
              }

              return validateEndDate({
                startAtMonth,
                startAtYear,
                endAtMonth,
                endAtYear,
                errorText: 'End date must be after start date',
              });
            },
          },
          disabled: stillWork,
        }),
        conditionalPropsParams: [
          'startAtMonth',
          'startAtYear',
          'endAtMonth',
          'endAtYear',
          'stillWork',
        ],
      },
      {
        name: 'endAtYear',
        placeholder: 'Year',
        type: 'select',
        options: years.map((el) => ({ label: el, value: el })),
        width: '1/2',
        display: 'inline-block',
        pl: 1,
        className: 'fieldHalfWidth',
        conditionalProps: ({ startAtMonth, startAtYear, endAtMonth, endAtYear, stillWork }) => ({
          validate: {
            required: !stillWork,
            validate: () => {
              if (stillWork) {
                return undefined;
              }

              return validateEndDate({
                startAtMonth,
                startAtYear,
                endAtMonth,
                endAtYear,
                errorText: ' ',
              });
            },
          },
          disabled: stillWork,
        }),
        conditionalPropsParams: ['startAtMonth', 'startAtYear', 'endAtMonth', 'endAtYear'],
      },
      {
        name: 'stillWork',
        type: 'checkbox',
        label: 'I still work here',
      },
      {
        name: 'location',
        label: 'Location',
        placeholder: 'E.g. Milwaukee, WI',
        type: 'text',
        validate: { required: true },
      },
      {
        name: 'description',
        label: (
          <Box display="inline-flex" alignItems="center">
            <Text fontWeight="700" mr={2} mb={0}>
              Description
            </Text>
            <InfoBox
              content={
                <>
                  <Text textAlign="left">Examples:</Text>
                  <ul>
                    <li>
                      <Text textAlign="left">
                        Inventoried all items in retail department, maintaining 0% loss rate YoY
                      </Text>
                    </li>
                    <li>
                      <Text textAlign="left">
                        Maintained product stock information for over 100 items
                      </Text>
                    </li>
                    <li>
                      <Text textAlign="left">
                        Loaded and delivered expensive medical equipment with zero damage losses
                      </Text>
                    </li>
                  </ul>
                </>
              }
            />
          </Box>
        ),
        placeholder:
          'Add 3-4 bullet points that describe what your responsibilities were and your outcomes',
        type: 'text',
        multiline: true,
        validate: { required: true, maxLength: 500 },
      },
    ],
    component: <CustomStepExperience />,
    showBackButton: true,
    nextStep: StepsClient.personalSummary,
  },
  {
    id: StepsClient.personalSummary,
    title: 'Personal Summary',
    description:
      "Share a brief statement of what you bring to a job and summarize your skill set. This is your chance to explain why you're the best choice for jobs you apply for.",
    fields: [
      {
        name: 'personalSummary',
        placeholder: 'Your summary goes here.',
        type: 'text',
        multiline: true,
        helperText: 'Max 1,000 characters.',
        validate: { maxLength: 1000 },
      },
    ],
    showBackButton: true,
    component: <CustomStepPersonalSummary />,
    nextStep: StepsClient.education,
  },
  {
    id: StepsClient.education,
    fields: [
      {
        name: 'schoolIssuer',
        label: 'School / Issuer',
        placeholder: 'E.g. ABC School',
        type: 'text',
        validate: { required: true },
      },
      {
        name: 'degree',
        label: 'Degree',
        placeholder: 'E.g. High School Diploma',
        type: 'text',
        validate: { required: true },
      },
      {
        name: 'areaOfStudy',
        label: 'Area of Study',
        placeholder: 'E.g. Arts',
        type: 'text',
        validate: { required: true },
      },
      {
        name: 'startYear',
        label: 'Start Year',
        placeholder: 'Select',
        type: 'select',
        options: years.map((el) => ({ label: el, value: el })),
        validate: { required: true },
        width: '1/2',
        display: 'inline-block',
        pr: 1,
        className: 'fieldHalfWidth',
      },
      {
        name: 'yearEarned',
        label: 'Year Earned',
        placeholder: 'Select',
        type: 'select',
        options: years.map((el) => ({ label: el, value: el })),
        conditionalProps: ({ startYear, yearEarned }) => ({
          validate: () => {
            if (!yearEarned || !startYear) {
              return undefined;
            }
            return yearEarned >= startYear ? undefined : 'Year earned must be after start year';
          },
        }),
        conditionalPropsParams: ['startYear', 'yearEarned'],
        width: '1/2',
        display: 'inline-block',
        pl: 1,
        className: 'fieldHalfWidth',
      },
      {
        name: 'description',
        label: 'Description',
        placeholder: 'Share some of your learnings and accomplishments',
        type: 'text',
        multiline: true,
        validate: { required: true, maxLength: 500 },
      },
    ],
    showBackButton: true,
    component: <CustomStepEducation />,
    nextStep: StepsClient.license,
  },
  {
    id: StepsClient.license,
    title: 'Add license / certification',
    description: 'Please tell us about your license / certification',
    fields: [
      {
        name: 'licenseName',
        label: 'Name',
        placeholder: 'E.g. CNC',
        type: 'text',
        validate: { required: true },
      },
      {
        name: 'issuingOrganization',
        label: 'Issuing Organization',
        placeholder: 'E.g. MATC',
        type: 'text',
        validate: { required: true },
      },
      {
        name: 'issueAtMonth',
        label: 'Issue Date',
        placeholder: 'Month',
        type: 'select',
        options: Object.entries(months).map(([value, label]) => ({ label, value })),
        validate: { required: true },
        width: '1/2',
        display: 'inline-block',
        pr: 1,
        className: 'fieldHalfWidth',
      },
      {
        name: 'issueAtYear',
        placeholder: 'Year',
        type: 'select',
        options: years.map((el) => ({ label: el, value: el })),
        validate: { required: true },
        width: '1/2',
        display: 'inline-block',
        pl: 1,
        className: 'fieldHalfWidth',
      },
      {
        name: 'expirationAtMonth',
        label: (
          <Box>
            <Text>Expiration Date</Text>
            <Text fontWeight="400" color="grey.600">
              (Optional)
            </Text>
          </Box>
        ),
        placeholder: 'Month',
        type: 'select',
        options: Object.entries(months).map(([value, label]) => ({ label, value })),
        width: '1/2',
        display: 'inline-block',
        pr: 1,
        className: 'fieldHalfWidth',
        conditionalProps: ({ issueAtMonth, issueAtYear, expirationAtMonth, expirationAtYear }) => ({
          validate: () => {
            if (!expirationAtMonth && !expirationAtYear) {
              return undefined;
            }

            return validateEndDate({
              startAtMonth: issueAtMonth,
              startAtYear: issueAtYear,
              endAtMonth: expirationAtMonth,
              endAtYear: expirationAtYear,
              errorText: 'Expiration date must be after issue date',
            });
          },
        }),
        conditionalPropsParams: [
          'issueAtMonth',
          'issueAtYear',
          'expirationAtMonth',
          'expirationAtYear',
        ],
      },
      {
        name: 'expirationAtYear',
        placeholder: 'Year',
        type: 'select',
        options: yearsFuture.map((el) => ({ label: el, value: el })),
        width: '1/2',
        display: 'inline-block',
        pl: 1,
        className: 'fieldHalfWidth',
        conditionalProps: ({ issueAtMonth, issueAtYear, expirationAtMonth, expirationAtYear }) => ({
          validate: () => {
            if (!expirationAtMonth && !expirationAtYear) {
              return undefined;
            }

            return validateEndDate({
              startAtMonth: issueAtMonth,
              startAtYear: issueAtYear,
              endAtMonth: expirationAtMonth,
              endAtYear: expirationAtYear,
              errorText: ' ',
            });
          },
        }),
        conditionalPropsParams: [
          'issueAtMonth',
          'issueAtYear',
          'expirationAtMonth',
          'expirationAtYear',
        ],
      },
    ],
    component: <CustomStepLicense />,
    showBackButton: true,
    nextStep: StepsClient.diversityInclusion,
  },
  {
    id: StepsClient.diversityInclusion,
    title: 'Diversity and Inclusion',
    description:
      'In an effort to promote equal opportunities and reinforce hiring practices at our organization we have included below some optional demographic questions. Your responses, or your choice not to respond, is entirely anonymous and will not be associated with your application.',
    fields: [
      {
        name: 'gender',
        type: 'select',
        placeholder: 'Gender Identity',
        options: getOptionsFromEnum(Gender),
        width: '1/2',
        display: 'inline-block',
        className: 'fieldHalfWidth',
        pr: 1,
      },
      {
        name: 'orientation',
        type: 'select',
        placeholder: 'Sexual Orientation',
        options: getOptionsFromEnum(Orientation),
        width: '1/2',
        display: 'inline-block',
        className: 'fieldHalfWidth',
        pl: 1,
      },
      {
        name: 'religion',
        type: 'select',
        placeholder: 'Religion',
        options: getOptionsFromEnum(Religion),
        width: '1/2',
        display: 'inline-block',
        className: 'fieldHalfWidth',
        pr: 1,
      },
      {
        name: 'maritalStatus',
        type: 'select',
        placeholder: 'Marital Status',
        options: getOptionsFromEnum(MaritalStatus),
        width: '1/2',
        display: 'inline-block',
        className: 'fieldHalfWidth',
        pl: 1,
      },
      {
        name: 'age',
        type: 'select',
        placeholder: 'Age Bracket',
        options: getOptionsFromEnum(Age),
        width: '1/2',
        display: 'inline-block',
        className: 'fieldHalfWidth',
        pr: 1,
      },
      {
        name: 'disability',
        type: 'select',
        placeholder: 'Disability',
        options: booleanOptionsChoices,
        width: '1/2',
        display: 'inline-block',
        className: 'fieldHalfWidth',
        pl: 1,
      },
      {
        name: 'ethnicity',
        type: 'select',
        placeholder: 'Ethnicity',
        options: getOptionsFromEnum(Ethnicity),
        className: 'ethnicity',
        ml: 0,
        pr: 1,
      },
    ],
    className: 'diversityInclusionStep',
    showBackButton: true,
    nextStep: StepsClient.referredBy,
  },
  {
    id: StepsClient.referredBy,
    title: 'How did you hear about The Way Out?',
    description:
      'Please let us know the name of the person or organization that referred you to The Way Out.',
    fields: [
      {
        name: 'referredBy',
        type: 'choices',
        options: getOptionsFromEnum(ReferredBy),
        inline: true,
        validate: { required: true },
      },
    ],
    component: <CustomStepReferredBy />,
    showBackButton: true,
    nextButtonLabel: 'Submit',
  },
];

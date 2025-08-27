import { WizardStep } from '@disruptive-labs/ui';
import {
  JusticeStatus,
  justiceText,
  offenseCategories,
  offenseText,
  OffenseWizardType,
  RspPosition,
  rspPositionText,
  State,
  states,
  Support,
  supportText,
  VeteranOrJustice,
} from '@two/shared';
import { CustomStepAllowedOffense } from '@app/components/CustomStepAllowedOffense';
import { CustomStepPhone } from '@app/components/CustomStepPhone';
import { clientProfile, ClientProfileEnums } from '@app/data/clientProfileText';
import { CustomStepContact } from './CustomStepContact';
import { CustomStepOffensesDescription } from './CustomStepOffensesDescription';
import { CustomStepPicture } from './CustomStepPicture';
import { CustomStepRspPicture } from './CustomStepRspPicture';
import { CustomStepServicesArea } from './CustomStepServicesArea';

export interface WizardRspData extends OffenseWizardType {
  // rsp user
  phone: string;
  avatar: string;
  avatarUrl?: string;
  position: RspPosition;

  // rsp organization
  name: string;
  avatarRsp: string;
  avatarRspUrl?: string;
  description: string;
  address: string;
  city: string;
  state: State;
  postalCode: string;
  servicesArea: string[];
  veteranOrJustice: VeteranOrJustice[];
  support: Support[];
  phoneRspContact: string;
  emailRspContact: string;
  justiceStatus: JusticeStatus[];
}

enum RspUserSteps {
  phone = 'phone',
  avatar = 'avatar',
  role = 'role',
}

export enum RspSteps {
  organizationName = 'organizationName',
  avatarRsp = 'avatarRsp',
  description = 'description',
  address = 'address',
  servicesArea = 'servicesArea',
  veteranOrJustice = 'veteranOrJustice',
  support = 'support',
  contact = 'contact',
  justiceStatus = 'justiceStatus',
  offenses = 'offenses',
}

export const memberProfileSteps: WizardStep<WizardRspData>[] = [
  {
    id: RspUserSteps.phone,
    title: "What's Your Phone Number?",
    fields: [
      {
        label: 'Phone number',
        name: 'phone',
        type: 'text',
        placeholder: 'Add your phone number',
        validate: { required: true },
      },
    ],
    component: <CustomStepPhone />,
    showBackButton: true,
    nextButtonLabel: 'Save & Next',
    nextStep: RspUserSteps.avatar,
  },
  {
    id: RspUserSteps.avatar,
    title: 'Add a Profile Picture',
    fields: [
      {
        label: 'Add a Profile Picture',
        name: 'avatar',
        type: 'url',
      },
    ],
    component: <CustomStepPicture />,
    showBackButton: true,
    nextButtonLabel: 'Save & Next',
    nextStep: RspUserSteps.role,
  },
];

export const ownerProfileSteps: WizardStep<WizardRspData>[] = [
  {
    id: RspUserSteps.role,
    title: 'What Is Your Role Within The Organization?',
    fields: [
      {
        name: 'position',
        label: 'Role',
        type: 'select',
        options: Object.entries(RspPosition).map(([key, value]) => ({
          label: rspPositionText[key as RspPosition],
          value,
        })),
        validate: { required: true },
        placeholder: 'Select',
      },
    ],
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
    nextStep: RspSteps.organizationName,
  },
];

export const rspSteps: WizardStep<WizardRspData>[] = [
  {
    id: RspSteps.organizationName,
    title: 'Organization Name',
    fields: [
      {
        name: 'name',
        type: 'text',
        label: 'Name',
        placeholder: 'E.g. The Way Out',
        validate: { required: true },
      },
    ],
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
    nextStep: RspSteps.avatarRsp,
  },
  {
    id: RspSteps.avatarRsp,
    title: 'Organization Logo',
    fields: [
      {
        label: 'Add a Profile Picture',
        name: 'avatarRsp',
        type: 'url',
      },
    ],
    component: <CustomStepRspPicture />,
    showBackButton: true,
    nextButtonLabel: 'Save & Next',
    nextStep: RspSteps.description,
  },
  {
    id: RspSteps.description,
    title: 'Organization Description',
    fields: [
      {
        name: 'description',
        type: 'text',
        label: 'Description',
        placeholder: 'Your Company Description',
        validate: { required: true, maxLength: 1000 },
        multiline: true,
      },
    ],
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
    nextStep: RspSteps.address,
  },
  {
    id: RspSteps.address,
    title: 'Business Address',
    fields: [
      {
        label: 'Your Address',
        name: 'address',
        type: 'text',
        placeholder: 'E.g. 459 S Hewitt St',
        validate: { required: true },
      },
      {
        label: 'Town / City',
        name: 'city',
        type: 'text',
        placeholder: 'E.g. Milwaukee',
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
        label: 'Zip Code',
        name: 'postalCode',
        type: 'text',
        placeholder: 'E.g. 53202',
        validate: { required: true },
      },
    ],
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
    nextStep: RspSteps.servicesArea,
  },
  {
    id: RspSteps.servicesArea,
    title: 'Service Area',
    description: 'Please select all applicable service areas that you currently serve.',
    fields: [
      {
        name: 'servicesArea',
        type: 'text',
        label: 'Search Area',
        validate: { required: true },
      },
    ],
    component: <CustomStepServicesArea />,
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
    nextStep: RspSteps.veteranOrJustice,
  },
  {
    id: RspSteps.veteranOrJustice,
    title: 'Who Can Apply For Your Services?',
    description:
      'Important: by deselecting Veterans, you are only excluling Veterans that are NOT justice impacted.',
    fields: [
      {
        name: 'veteranOrJustice',
        type: 'choices',
        options: Object.entries(VeteranOrJustice).map(([key, value]) => ({
          label: clientProfile[key as ClientProfileEnums],
          value,
        })),
        multiple: true,
        inline: true,
        validate: (value) => (value.length >= 1 ? undefined : 'Error'),
      },
    ],
    showBackButton: true,
    nextButtonLabel: 'Save & Next',
    nextStep: RspSteps.support,
  },
  {
    id: RspSteps.support,
    title: 'What support services do you provide?',
    description:
      "Please select all the support services that you provide. We'll do our best to match you with the most applicable candidates.",
    fields: [
      {
        name: 'support',
        type: 'choices',
        options: Object.entries(Support).map(([key, value]) => ({
          label: supportText[key as Support],
          value,
        })),
        multiple: true,
        inline: true,
        validate: (support) => (support.length ? undefined : 'At least one required'),
      },
    ],
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
    nextStep: RspSteps.contact,
  },
  {
    id: RspSteps.contact,
    title: 'Organization Contact Info',
    fields: [
      {
        name: 'phoneRspContact',
        type: 'text',
        label: 'Phone Number (Optional)',
      },
      {
        name: 'emailRspContact',
        type: 'email',
        label: 'Email (Optional)',
      },
    ],
    component: <CustomStepContact />,
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
  },
  {
    id: RspSteps.justiceStatus,
    title: 'Accepted Justice Status',
    fields: [
      {
        name: 'justiceStatus',
        type: 'choices',
        options: Object.entries(JusticeStatus).map(([key, value]) => ({
          label: justiceText[key as JusticeStatus],
          value,
        })),
        multiple: true,
        inline: true,
        validate: (justiceStatus) => (justiceStatus.length ? undefined : 'At least one required'),
      },
    ],
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
    nextStep: RspSteps.offenses,
  },
  {
    id: RspSteps.offenses,
    title: 'Allowed Offenses',
    description: <CustomStepOffensesDescription />,
    fields: Object.entries(offenseCategories).map(([key, values]) => ({
      name: `offense${key[0].toUpperCase() + key.slice(1)}`,
      label: values.name,
      type: 'choices',
      options: values.categories.map((el) => ({ label: offenseText[el], value: el })),
      inline: true,
      multiple: true,
      className: 'offenseCategoryStep',
      validate: (offense) => (offense.length ? undefined : 'At least one required'),
    })),
    component: <CustomStepAllowedOffense isRequired />,
    nextButtonLabel: 'Save & Next',
    showBackButton: true,
  },
];

import type { WizardStep } from '@disruptive-labs/ui';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { ClientType, JobApplicationStatus } from '@two/shared';

export type NextPageWithLayout<P = object> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type ClientWithApplication = ClientType & {
  applicationStatus: JobApplicationStatus;
  applicationId: string;
};

export interface CustomStepTextField extends Omit<Partial<WizardStep>, 'fields'> {
  fields?: {
    name: string;
    label: string;
    type: 'text';
    placeholder: string;
    validate?: { required: boolean };
  }[];
}

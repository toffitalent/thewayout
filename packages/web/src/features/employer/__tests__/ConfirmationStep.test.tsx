import { useWizardContext } from '@disruptive-labs/ui';
import React from 'react';
import { Industry, NumberOfEmployers, State, YearsInBusiness } from '@two/shared';
import { render, waitFor } from '@test';
import { ConfirmationStep } from '../ConfirmationStep';

jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));

describe('ConfirmationStep', () => {
  beforeEach(() => {
    (useWizardContext as any).mockImplementation(() => ({
      data: {
        name: 'Company',
        industry: Industry.accounting,
        description: 'description',
        yearsInBusiness: YearsInBusiness['0-3'],
        numberOfEmployees: NumberOfEmployers['1-50'],
        address: 'Test',
        city: 'Los Angeles',
        state: State.CA,
        postalCode: '90255',
      },
      setData: jest.fn(),
      goTo: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container } = await waitFor(() => render(<ConfirmationStep onSubmit={jest.fn()} />));
    expect(container).toMatchSnapshot();
  });
});

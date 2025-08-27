import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import React from 'react';
import { UserType } from '@two/shared';
import { mockState, render, waitFor, within } from '@test';
import { DashboardPage } from '../DashboardPage';

describe('DashboardPage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      events: { on: jest.fn(), off: jest.fn() },
    }));
  });

  test('renders correctly', async () => {
    const { container } = await waitFor(() =>
      render(<DashboardPage />, {
        initialState: {
          ...mockState,
          auth: { user: { employer: { name: 'Test' }, type: UserType.Employer } },
        },
      }),
    );
    expect(container).toMatchSnapshot();
  });

  test('should open modal and not redirect to job creator if job limit exceeded', async () => {
    const { queryAllByRole, getByRole, queryByText } = await waitFor(() =>
      render(<DashboardPage />, {
        initialState: {
          ...mockState,
          auth: {
            user: { employer: { name: 'Test', availableJobsCount: 0 }, type: UserType.Employer },
          },
        },
      }),
    );
    await userEvent.click(getByRole('button', { name: 'Create New Job Offer' }));
    expect(queryAllByRole('dialog').length).toBe(1);

    await waitFor(() => {
      expect(queryByText('You have exceeded your free job quota!')).toBeInTheDocument();
    });

    await userEvent.click(within(getByRole('dialog')).getByRole('button'));
    expect(queryAllByRole('dialog').length).toBe(0);
  });
});

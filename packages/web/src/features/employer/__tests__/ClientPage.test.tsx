import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import React from 'react';
import { JobApplicationStatus } from '@two/shared';
import { fixtures, mockState, render, waitFor, within } from '@test';
import { ClientPage } from '../ClientPage';

const stateWithInterview = {
  ...mockState,
  employerJobs: {
    client: { ...fixtures.client, applicationStatus: JobApplicationStatus.interview },
  },
};

describe('ClientPage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: { id: 'TEST_EMPLOYER_ID', clientId: fixtures.client.id },
    }));
  });

  test('renders correctly', async () => {
    const { container } = await waitFor(() => render(<ClientPage />));
    expect(container).toMatchSnapshot();

    const { container: uncloaked } = render(<ClientPage />, { initialState: stateWithInterview });

    expect(uncloaked).toMatchSnapshot();
  });

  test('should open and close modal - Request Interview', async () => {
    const { getByRole, queryAllByRole, getByText } = render(<ClientPage />);
    expect(queryAllByRole('dialog').length).toBe(0);

    const openModalText = getByText('Interview');
    await userEvent.click(openModalText);
    expect(queryAllByRole('dialog').length).toBe(1);
    expect(getByText('Are you sure you want to request an interview?')).toBeInTheDocument();

    const modalCloseButton = within(getByRole('dialog')).getByRole('button', {
      name: 'Close',
    });
    await userEvent.click(modalCloseButton);
    expect(queryAllByRole('dialog').length).toBe(0);
  });

  test('should open and close modal - Reject', async () => {
    const { getByRole, queryAllByRole, getByText } = render(<ClientPage />, {
      initialState: stateWithInterview,
    });
    expect(queryAllByRole('dialog').length).toBe(0);

    const openModalText = getByText('Reject');
    await userEvent.click(openModalText);
    expect(queryAllByRole('dialog').length).toBe(1);
    expect(getByText('Are you sure you want to reject this applicant?')).toBeInTheDocument();

    const modalCloseButton = within(getByRole('dialog')).getByRole('button', {
      name: 'No',
    });
    await userEvent.click(modalCloseButton);
    expect(queryAllByRole('dialog').length).toBe(0);
  });

  test('should open and close modal - Hire', async () => {
    const { getByRole, queryAllByRole, getByText } = render(<ClientPage />, {
      initialState: stateWithInterview,
    });
    expect(queryAllByRole('dialog').length).toBe(0);

    const openModalText = getByText('Hire');
    await userEvent.click(openModalText);
    expect(queryAllByRole('dialog').length).toBe(1);
    expect(getByText('Are you sure you want to hire this applicant?')).toBeInTheDocument();

    const modalCloseButton = within(getByRole('dialog')).getByRole('button', {
      name: 'No',
    });
    await userEvent.click(modalCloseButton);
    expect(queryAllByRole('dialog').length).toBe(0);
  });
});

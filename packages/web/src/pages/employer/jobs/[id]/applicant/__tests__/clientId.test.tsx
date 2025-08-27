import { useRouter } from 'next/router';
import React from 'react';
import { UserType } from '@two/shared';
import { useAppAuth } from '@app/hooks';
import { fixtures, mockState, render, waitFor } from '@test';
import ClientPageWithLayout from '../[clientId].page';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
}));

describe('ClientPageWithLayout', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
      query: { id: 'TEST_EMPLOYER_ID', clientId: fixtures.client.id },
    }));
    (useAppAuth as any).mockImplementation(() => ({
      error: undefined,
      isAuthenticated: false,
      isLoading: false,
      user: {
        roles: [UserType.Employer],
      },
    }));
  });

  test('renders correctly', async () => {
    const { container } = await waitFor(() =>
      render(<ClientPageWithLayout />, {
        initialState: { ...mockState, auth: { user: { employer: {} } } },
      }),
    );
    expect(container).toMatchSnapshot();
  });
});

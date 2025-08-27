import { useRouter } from 'next/router';
import { UserType } from '@two/shared';
import { ClientProfileSections } from '@app/components/ClientProfile';
import { useAppAuth } from '@app/hooks';
import { render, waitFor } from '@test';
import EditProfilePageWithLayout from '../edit-profile.page';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
}));

describe('EditProfilePageWithLayout', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
      beforePopState: jest.fn(),
      query: { section: ClientProfileSections.professionalSummary },
    }));
    (useAppAuth as any).mockImplementation(() => ({
      error: undefined,
      isAuthenticated: false,
      isLoading: false,
      user: {
        roles: [UserType.Client],
      },
    }));
  });

  test('renders correctly', async () => {
    const { container } = await waitFor(() => render(<EditProfilePageWithLayout />));

    expect(container).toMatchSnapshot();
  });
});

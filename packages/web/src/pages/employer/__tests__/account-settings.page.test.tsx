import { useRouter } from 'next/router';
import { UserType } from '@two/shared';
import { useAppAuth } from '@app/hooks';
import { render, waitFor } from '@test';
import AccountSettingsPageWithLayout from '../account-settings.page';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
}));

describe('AccountSettingsPageWithLayout', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
      push: jest.fn(),
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
    const { container, findByText } = render(<AccountSettingsPageWithLayout />, {
      initialState: { auth: { user: { employer: {} } } },
    });
    await waitFor(async () => expect(await findByText('Account Settings')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });
});

import { useRouter } from 'next/router';
import { RspRole, UserType } from '@two/shared';
import { useAppAuth } from '@app/hooks';
import { mockState, render, waitFor } from '@test';
import CreateProfilePageWithLayout from '../create-profile.page';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
}));

describe('CreateProfilePageWithLayout', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
      push: jest.fn(),
      beforePopState: jest.fn(),
    }));
    (useAppAuth as any).mockImplementation(() => ({
      error: undefined,
      isAuthenticated: false,
      isLoading: false,
      user: {
        roles: [UserType.Rsp],
      },
    }));
  });

  test('renders correctly', async () => {
    const { container, findByText } = render(<CreateProfilePageWithLayout />, {
      initialState: {
        ...mockState,
        auth: {
          user: { rspAccount: { role: RspRole.owner }, type: UserType.Rsp },
        },
      },
    });

    await waitFor(async () => expect(await findByText('Phone number')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });
});

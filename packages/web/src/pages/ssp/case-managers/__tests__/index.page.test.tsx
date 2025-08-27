import { useRouter } from 'next/router';
import { RspRole, UserType } from '@two/shared';
import { useAppAuth } from '@app/hooks';
import { mockState, render, waitFor } from '@test';
import CaseManagersPagePageWithLayout from '../index.page';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
}));

describe('CaseManagersPagePageWithLayout', () => {
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
        roles: [UserType.Rsp],
      },
    }));
  });

  test('renders correctly', async () => {
    const { container, findByText } = render(<CaseManagersPagePageWithLayout />, {
      initialState: {
        ...mockState,
        auth: {
          user: { rspAccount: { role: RspRole.owner, isProfileFilled: true }, type: UserType.Rsp },
        },
      },
    });
    await waitFor(async () => expect(await findByText('Case Managers')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });
});

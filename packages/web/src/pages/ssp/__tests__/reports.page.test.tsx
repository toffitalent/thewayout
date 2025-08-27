import { useRouter } from 'next/router';
import { RspRole, UserType } from '@two/shared';
import { useAppAuth } from '@app/hooks';
import { fixtures, mockState, render, waitFor } from '@test';
import ReportsPagePageWithLayout from '../reports.page';

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
    const { container, findByText } = render(<ReportsPagePageWithLayout />, {
      initialState: {
        ...mockState,
        auth: {
          user: {
            rspAccount: { role: RspRole.owner, isProfileFilled: true, rsp: fixtures.rsp },
            type: UserType.Rsp,
          },
        },
      },
    });
    await waitFor(async () => expect(await findByText('Reports')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });
});

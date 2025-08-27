import { useRouter } from 'next/router';
import { RspRole, UserType } from '@two/shared';
import { useAppAuth } from '@app/hooks';
import { mockState, render, waitFor } from '@test';
import AddCaseManagerPageWithLayout from '../add.page';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
}));

describe('AddCaseManagerPageWithLayout', () => {
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
    const { container, findByText } = render(<AddCaseManagerPageWithLayout />, {
      initialState: {
        ...mockState,
        auth: {
          user: { rspAccount: { role: RspRole.owner }, type: UserType.Rsp },
        },
      },
    });

    await waitFor(async () => expect(await findByText('First Name')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });
});

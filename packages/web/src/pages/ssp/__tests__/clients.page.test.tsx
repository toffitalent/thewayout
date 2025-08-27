import { useRouter } from 'next/router';
import { UserType } from '@two/shared';
import { useAppAuth } from '@app/hooks';
import { mockState, render, waitFor } from '@test';
import RspClientsPageWithLayout from '../clients.page';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
}));

describe('RspClientsPageWithLayout', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
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
    const { container, findByText } = render(<RspClientsPageWithLayout />, {
      initialState: {
        ...mockState,
        auth: { user: { rspAccount: { isProfileFilled: true } } },
      },
    });
    await waitFor(async () => expect(await findByText('Clients')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });
});

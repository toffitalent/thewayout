import { useRouter } from 'next/router';
import { UserType } from '@two/shared';
import { useAppAuth } from '@app/hooks';
import { render } from '@test';
import ConfirmEmployerCreateProfilePage from '../confirm.page';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
}));

describe('ConfirmEmployerCreateProfilePage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
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
    const { container } = render(<ConfirmEmployerCreateProfilePage />, {
      initialState: { auth: { user: { employer: {} } } },
    });
    expect(container).toMatchSnapshot();
  });
});

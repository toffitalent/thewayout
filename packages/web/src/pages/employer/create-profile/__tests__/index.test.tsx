import { useRouter } from 'next/router';
import { UserType } from '@two/shared';
import { useAppAuth } from '@app/hooks';
import { render, waitFor } from '@test';
import EmployerCreateProfilePage from '../index.page';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
}));

describe('EmployerCreateProfilePage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
      beforePopState: jest.fn(),
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
    const { container, findByRole } = await waitFor(() =>
      render(<EmployerCreateProfilePage />, {
        initialState: { auth: { user: { employer: {} } } },
      }),
    );
    await waitFor(async () =>
      expect(await findByRole('textbox', { name: 'Name' })).toBeInTheDocument(),
    );
    expect(container).toMatchSnapshot();
  });
});

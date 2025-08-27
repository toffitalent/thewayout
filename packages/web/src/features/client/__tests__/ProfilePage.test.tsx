import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import { UserType } from '@two/shared';
import { useAppAuth } from '@app/hooks';
import { fixtures, mockState, render, waitFor } from '@test';
import { ProfilePage } from '../ProfilePage';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
}));

describe('MyProfilePage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
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
    const { container } = render(<ProfilePage />);
    expect(container).toMatchSnapshot();
  });

  test('change to cloaked view for client', async () => {
    const { container, queryByText, findByTestId } = render(<ProfilePage />);
    expect(queryByText('Offense History')).toBeInTheDocument();
    expect(queryByText('Test User')).toBeInTheDocument();
    expect(queryByText('T**** U****')).not.toBeInTheDocument();

    await userEvent.click(await findByTestId('cloaked'));
    await waitFor(() => expect(queryByText('Offense History')).not.toBeInTheDocument());
    expect(queryByText('Test User')).not.toBeInTheDocument();
    expect(queryByText('Support Needed')).not.toBeInTheDocument();
    expect(queryByText('Personal Details')).not.toBeInTheDocument();
    expect(queryByText('T**** U****')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  test('shows "Military Experience" section if client is veteran', async () => {
    const initialState = {
      ...mockState,
      auth: {
        user: {
          ...fixtures.user,
          client: fixtures.veteranClient,
        },
      },
    };
    const { container, findByText, queryByText } = render(<ProfilePage />, { initialState });

    expect(await findByText('Military Experience')).toBeInTheDocument();
    expect(queryByText('Offense History')).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test('shows "Offense History" section if client is justiceImpacted', async () => {
    const { findByText, queryByText } = render(<ProfilePage />);

    expect(await findByText('Offense History')).toBeInTheDocument();
    expect(queryByText('Military Experience')).not.toBeInTheDocument();
  });

  test('shows both "Military Experience" and "Offense History" section if client is veteran and justiceImpacted', async () => {
    const initialState = {
      ...mockState,
      auth: {
        user: {
          ...fixtures.user,
          client: fixtures.veteranAndJusticeImpactedClient,
        },
      },
    };
    const { container, findByText } = render(<ProfilePage />, { initialState });

    expect(await findByText('Military Experience')).toBeInTheDocument();
    expect(await findByText('Offense History')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});

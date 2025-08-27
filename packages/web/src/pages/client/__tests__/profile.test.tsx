import { useRouter } from 'next/router';
import { UserType } from '@two/shared';
import { useAppAuth } from '@app/hooks';
import { render } from '@test';
import ProfilePageWithLayout from '../profile.page';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
}));

describe('ProfilePageWithLayout', () => {
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

  test('renders correctly', () => {
    const { container } = render(<ProfilePageWithLayout />);
    expect(container).toMatchSnapshot();
  });
});

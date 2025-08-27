import { useRouter } from 'next/router';
import { UserType } from '@two/shared';
import { useAppAuth } from '@app/hooks';
import { fixtures, mockState, render } from '@test';
import JobPageWithLayout from '../index.page';

const { job } = fixtures;

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
}));

describe('JobPageWithLayout', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
      query: { id: String(job.id) },
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
    const { container } = render(<JobPageWithLayout />, {
      initialState: { ...mockState, auth: { user: { employer: {} } } },
    });
    expect(container).toMatchSnapshot();
  });
});

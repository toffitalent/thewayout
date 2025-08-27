import { useRouter } from 'next/router';
import { UserType } from '@two/shared';
import { useAppAuth } from '@app/hooks';
import { fixtures, mockState, render, waitFor } from '@test';
import EditJobPageWithLayout from '../[id].page';

const { job } = fixtures;
const initialState = {
  ...mockState,
  auth: {
    user: { employer: { name: 'Test' }, type: UserType.Employer },
  },
};

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
}));

describe('EditJobPageWithLayout', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
      query: { id: String(job.id) },
      push: jest.fn(),
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
      render(<EditJobPageWithLayout />, { initialState }),
    );

    await waitFor(async () =>
      expect(await findByRole('textbox', { name: 'Job Title' })).toBeInTheDocument(),
    );

    expect(container).toMatchSnapshot();
  });
});

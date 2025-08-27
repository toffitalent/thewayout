import { useRouter } from 'next/router';
import { useAppAuth } from '@app/hooks';
import { render, waitFor } from '@test';
import { DefaultLayout } from '../DefaultLayout';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
}));

describe('DefaultLayout', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      events: { on: jest.fn(), off: jest.fn() },
    }));
    (useAppAuth as any).mockImplementation(() => ({
      isAuthenticated: true,
      isLoading: false,
    }));
  });

  test('renders correctly', async () => {
    const { container, findByText } = render(
      <DefaultLayout>
        <div>Page</div>
      </DefaultLayout>,
    );
    await waitFor(async () => expect(await findByText('Dashboard')).toBeInTheDocument());

    expect(container).toMatchSnapshot();
  });
});

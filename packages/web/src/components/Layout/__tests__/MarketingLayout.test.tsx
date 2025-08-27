import { useRouter } from 'next/router';
import { useAppAuth, useDashboardRedirection } from '@app/hooks';
import { render, waitFor } from '@test';
import { MarketingLayout } from '../MarketingLayout';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
  useDashboardRedirection: jest.fn(),
}));

describe('MarketingLayout', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      events: { on: jest.fn(), off: jest.fn() },
    }));
    (useAppAuth as any).mockImplementation(() => ({
      user: null,
      isLoading: false,
    }));
    (useDashboardRedirection as any).mockImplementation(() => false);
  });

  test('renders correctly', async () => {
    const { container, findByText } = render(
      <MarketingLayout>
        <div>Page</div>
      </MarketingLayout>,
    );
    await waitFor(async () => expect(await findByText('Job Seekers')).toBeInTheDocument());

    expect(container).toMatchSnapshot();
  });
});

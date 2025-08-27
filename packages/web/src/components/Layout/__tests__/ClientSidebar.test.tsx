import { useRouter } from 'next/router';
import { render, waitFor } from '@test';
import { ClientSidebar } from '../ClientSidebar';

describe('ClientSidebar', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      asPath: '/',
    }));
  });

  test('renders correctly', async () => {
    const { container, findByText } = render(<ClientSidebar />);

    await waitFor(async () => expect(await findByText('Dashboard')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });
});

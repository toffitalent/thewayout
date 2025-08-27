import { useRouter } from 'next/router';
import { fixtures, render, waitFor } from '@test';
import JobPageWithLayout from '../[id].page';

const { job } = fixtures;

describe('JobPageWithLayout', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: { id: String(job.id) },
    }));
  });

  test('renders correctly', async () => {
    const { container, queryByTestId } = render(<JobPageWithLayout />);
    await waitFor(() => expect(queryByTestId('loading-spinner')).not.toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });
});

import { useRouter } from 'next/router';
import { fixtures, mockState, render, waitFor } from '@test';
import { JobPage } from '../JobPage';

const { job } = fixtures;

describe('JobPage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: { id: String(job.id) },
    }));
  });

  test('renders correctly', async () => {
    const { container } = render(<JobPage />, {
      initialState: { ...mockState, auth: { user: { employer: {} } } },
    });

    expect(container).toMatchSnapshot();
  });
});

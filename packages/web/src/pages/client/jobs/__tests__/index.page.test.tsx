import { useRouter } from 'next/router';
import { fixtures, render, waitFor } from '@test';
import JobsListPageWithLayout from '../index.page';

const jobToSnap = {
  ...fixtures.job,
  createdAt: new Date(),
};

describe('JobsListPageWithLayout', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
    }));
  });

  test('renders correctly', async () => {
    const { container, queryByTestId } = render(<JobsListPageWithLayout />, {
      initialState: {
        clientJobs: {
          jobsList: {
            ids: [jobToSnap.id],
            entities: { [jobToSnap.id]: jobToSnap },
            total: 1,
            listUpdatedAt: '',
          },
        },
      },
    });
    await waitFor(() => expect(queryByTestId('loading-spinner')).not.toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });
});

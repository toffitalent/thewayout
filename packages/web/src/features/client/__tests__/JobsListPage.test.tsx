import { fixtures, mockState, render } from '@test';
import { JobsListPage } from '../JobsListPage';

const jobToSnap = {
  ...fixtures.job,
  createdAt: new Date(),
};

describe('JobsListPage', () => {
  test('renders correctly', async () => {
    const { container } = render(<JobsListPage />, {
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
    expect(container).toMatchSnapshot();
  });
});

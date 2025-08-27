import { useRouter } from 'next/router';
import { JusticeStatus } from '@two/shared';
import { fixtures, mockState, render } from '@test';
import { JobPage } from '../JobPage';

const { job } = fixtures;

describe('JobPage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: { id: String(job.id) },
    }));
  });

  test('renders correctly', async () => {
    const { container } = render(<JobPage />);
    expect(container).toMatchSnapshot();
  });

  test('disable button when client is "Currently Incarcerated"', async () => {
    const { findAllByRole, findAllByText } = render(<JobPage />, {
      initialState: {
        ...mockState,
        auth: {
          user: {
            ...fixtures.user,
            client: { justiceStatus: JusticeStatus.currentlyIncarcerated },
          },
        },
      },
    });

    expect((await findAllByRole('button', { name: 'Apply now' }))[0]).toBeDisabled();
    expect((await findAllByRole('button', { name: 'Apply now' }))[1]).toBeDisabled();
    expect(
      (
        await findAllByText(
          'You will be able to apply for jobs as soon as you are in the “free world”. In the meantime, a Supportive Services Provider should be reaching out to you shortly.',
        )
      ).length,
    ).toBe(2);
  });

  test('enable button when client is not "Currently Incarcerated"', async () => {
    const { findAllByRole, queryAllByText } = render(<JobPage />, {
      initialState: {
        ...mockState,
        auth: {
          user: {
            ...fixtures.user,
            client: { justiceStatus: JusticeStatus.freeWorld },
          },
        },
      },
    });

    expect((await findAllByRole('button', { name: 'Apply now' }))[0]).not.toBeDisabled();
    expect((await findAllByRole('button', { name: 'Apply now' }))[1]).not.toBeDisabled();
    expect(
      queryAllByText(
        'You will be able to apply for jobs as soon as you are in the “free world”. In the meantime, a Supportive Services Provider should be reaching out to you shortly.',
      ).length,
    ).toBe(0);
  });
});

import { useRouter } from 'next/router';
import { UserType, VeteranOrJustice } from '@two/shared';
import { fixtures, mockState, render, waitFor } from '@test';
import { Steps } from '../createJobData';
import { EditJobPage } from '../EditJobPage';

const { job } = fixtures;
const initialState = {
  ...mockState,
  auth: {
    user: { employer: { name: 'Test' }, type: UserType.Employer },
  },
};

describe('EditJobPage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: { id: String(job.id) },
      beforePopState: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container, findByRole, findByTestId } = await waitFor(() =>
      render(<EditJobPage />, { initialState }),
    );
    await waitFor(async () =>
      expect(await findByRole('textbox', { name: 'Job Title' })).toBeInTheDocument(),
    );

    expect((await findByTestId(Steps.offenses)).className.includes('display-none')).toBeFalsy();
    expect(container).toMatchSnapshot();
  });

  test('hides "Allowed Offenses" if "Justice Impacted" not selected in "Allowed Applicants', async () => {
    const { findByTestId } = await waitFor(() =>
      render(<EditJobPage />, {
        initialState: {
          ...initialState,
          employerJobs: { job: { ...fixtures.job, veteranOrJustice: [VeteranOrJustice.veteran] } },
        },
      }),
    );

    expect((await findByTestId(Steps.offenses)).className.includes('display-none')).toBeTruthy();
  });
});

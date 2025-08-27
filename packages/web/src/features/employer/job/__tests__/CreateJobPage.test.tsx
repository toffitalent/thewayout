import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import { TypeOfWork, UserType, VeteranOrJustice, WorkingTime } from '@two/shared';
import { job } from '@app/data/jobText';
import { mockState, render, waitFor } from '@test';
import { CreateJobPage } from '../CreateJobPage';

const initialState = {
  ...mockState,
  auth: {
    user: { employer: { name: 'Test', availableJobsCount: 1 }, type: UserType.Employer },
  },
};

describe('CreateJobPage', () => {
  let replace: jest.Mock;

  beforeEach(() => {
    replace = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({
      beforePopState: jest.fn(),
      replace,
    }));
  });

  test('renders correctly', async () => {
    const { container, findByRole } = await waitFor(() =>
      render(<CreateJobPage />, { initialState }),
    );
    await waitFor(async () =>
      expect(await findByRole('textbox', { name: 'Job Title' })).toBeInTheDocument(),
    );

    expect(container).toMatchSnapshot();
  });

  test('redirects to dashboard if job creation exceeded', async () => {
    await waitFor(() =>
      render(<CreateJobPage />, {
        initialState: {
          ...mockState,
          auth: {
            user: { employer: { name: 'Test', availableJobsCount: 0 }, type: UserType.Employer },
          },
        },
      }),
    );
    expect(replace).toBeCalledWith('/employer');
  });

  test('shows "Allowed Offenses" step if "Justice Impacted" chosen', async () => {
    const { findByRole, findAllByRole, findByText } = await waitFor(() =>
      render(<CreateJobPage />, { initialState }),
    );

    // details step
    await userEvent.type(await findByRole('textbox', { name: 'Job Title' }), 'Job');
    await userEvent.type(await findByRole('textbox', { name: 'Short Description' }), 'Description');
    await userEvent.type(await findByRole('textbox', { name: 'Department' }), 'Department');
    await userEvent.selectOptions(await findByRole('combobox', { name: 'Start Date' }), 'May');
    await userEvent.selectOptions(
      (await findAllByRole('combobox'))[1],
      (new Date().getFullYear() + 1).toString(),
    );
    await userEvent.selectOptions(
      await findByRole('combobox', { name: 'Work Location' }),
      job[TypeOfWork.remote],
    );
    await userEvent.selectOptions(
      await findByRole('combobox', { name: 'Employment Type' }),
      job[WorkingTime.contractor],
    );
    await userEvent.type(await findByRole('spinbutton'), '1');
    await userEvent.click(await findByRole('button', { name: 'Save & Next' }));

    // veteran or justice impacted step
    await userEvent.click(
      await findByRole('checkbox', { name: job[VeteranOrJustice.justiceImpacted] }),
    );
    await userEvent.click(await findByRole('button', { name: 'Save & Next' }));

    expect(await findByText('Allowed Offenses')).toBeInTheDocument();
  });

  test('skips "Allowed Offenses" step if only "Veteran" chosen', async () => {
    const { findByRole, findAllByRole, findByText } = await waitFor(() =>
      render(<CreateJobPage />, { initialState }),
    );

    // details step
    await userEvent.type(await findByRole('textbox', { name: 'Job Title' }), 'Job');
    await userEvent.type(await findByRole('textbox', { name: 'Short Description' }), 'Description');
    await userEvent.type(await findByRole('textbox', { name: 'Department' }), 'Department');
    await userEvent.selectOptions(await findByRole('combobox', { name: 'Start Date' }), 'May');
    await userEvent.selectOptions(
      (await findAllByRole('combobox'))[1],
      (new Date().getFullYear() + 1).toString(),
    );
    await userEvent.selectOptions(
      await findByRole('combobox', { name: 'Work Location' }),
      job[TypeOfWork.remote],
    );
    await userEvent.selectOptions(
      await findByRole('combobox', { name: 'Employment Type' }),
      job[WorkingTime.contractor],
    );
    await userEvent.type(await findByRole('spinbutton'), '1');
    await userEvent.click(await findByRole('button', { name: 'Save & Next' }));

    // veteran or justice impacted step
    await userEvent.click(await findByRole('checkbox', { name: job[VeteranOrJustice.veteran] }));
    await userEvent.click(await findByRole('button', { name: 'Save & Next' }));

    expect(await findByText('Responsibilities & Expectations')).toBeInTheDocument();
  });
});

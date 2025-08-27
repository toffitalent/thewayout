import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import { Industry, NumberOfEmployers, State, YearsInBusiness } from '@two/shared';
import { act, fireEvent, fixtures, mockThunks, render, waitFor } from '@test';
import * as actions from '../actions';
import { CreateProfilePage } from '../CreateProfilePage';

const { user } = fixtures;

describe('CreateProfilePage', () => {
  let push: jest.Mock;

  beforeEach(() => {
    push = jest.fn();

    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
      query: {},
      push,
      beforePopState: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container, findByRole } = await waitFor(() => render(<CreateProfilePage />));
    await waitFor(async () =>
      expect(await findByRole('textbox', { name: 'Name' })).toBeInTheDocument(),
    );
    expect(container).toMatchSnapshot();
  });

  test('handles submit', async () => {
    const [createEmployer] = mockThunks(actions, ['createEmployer']);
    const { findByRole, findAllByRole, getByRole, getByText, dispatch } = await waitFor(() =>
      render(<CreateProfilePage />),
    );

    // Employer Name step
    await userEvent.type(await findByRole('textbox', { name: 'Name' }), 'Test Company', {
      delay: 1,
    });
    await act(() => fireEvent.click(getByRole('button', { name: 'Save & Next' })));
    expect(await findByRole('heading', { name: 'Industry' })).toBeInTheDocument();

    // Industry step
    await userEvent.selectOptions(await findByRole('combobox'), 'Accounting');
    await act(() => fireEvent.click(getByRole('button', { name: 'Save & Next' })));
    expect(await findByRole('heading', { name: 'Company Description' })).toBeInTheDocument();

    // Description step
    await userEvent.type(await findByRole('textbox', { name: 'Description' }), 'Test Description', {
      delay: 1,
    });
    await act(() => fireEvent.click(getByRole('button', { name: 'Save & Next' })));
    expect(await findByRole('heading', { name: 'Company Details' })).toBeInTheDocument();

    // Company details step
    await userEvent.selectOptions((await findAllByRole('combobox'))[0], '0-3 years');
    await userEvent.selectOptions((await findAllByRole('combobox'))[1], '1-50');
    await act(() => fireEvent.click(getByRole('button', { name: 'Save & Next' })));
    expect(await findByRole('heading', { name: 'Company Location' })).toBeInTheDocument();

    // Company location step
    await userEvent.type(await findByRole('textbox', { name: 'Address' }), 'Test Address', {
      delay: 1,
    });
    await userEvent.type(await findByRole('textbox', { name: 'City' }), 'Test City', {
      delay: 1,
    });
    await userEvent.selectOptions(await findByRole('combobox'), 'Alabama');
    await userEvent.type(await findByRole('textbox', { name: 'ZIP Code' }), 'ZIP', {
      delay: 1,
    });
    await act(() => fireEvent.click(getByRole('button', { name: 'Save & Next' })));
    expect(await findByRole('heading', { name: 'Confirm your data' })).toBeInTheDocument();

    // Confirmation
    expect(getByText('Test Company')).toBeInTheDocument();
    expect(getByText('Accounting')).toBeInTheDocument();
    expect(getByText('Test Description')).toBeInTheDocument();
    expect(getByText('0-3')).toBeInTheDocument();
    expect(getByText('1-50')).toBeInTheDocument();
    expect(getByText('Test Address')).toBeInTheDocument();
    expect(getByText('Test City, AL ZIP')).toBeInTheDocument();
    // Submit
    await act(() => fireEvent.click(getByRole('button', { name: 'Confirm' })));
    await waitFor(async () => {
      expect(createEmployer).toBeCalledWith({
        name: 'Test Company',
        industry: Industry.accounting,
        description: 'Test Description',
        yearsInBusiness: YearsInBusiness['0-3'],
        numberOfEmployees: NumberOfEmployers['1-50'],
        address: 'Test Address',
        city: 'Test City',
        state: State.AL,
        postalCode: 'ZIP',
      });
    });
    expect(dispatch).toBeCalled();
    expect(push).toBeCalledWith('/employer/create-profile/confirm/');
  });
});

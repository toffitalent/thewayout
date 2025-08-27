import userEvent from '@testing-library/user-event';
import * as actions from '@app/features/auth/actions';
import { act, fireEvent, fixtures, mockState, mockThunks, render, waitFor } from '@test';
import { AccountSettingsTab } from '../AccountSettingsTab';

const initialState = {
  ...mockState,
  auth: {
    user: { rspAccount: fixtures.rspAccountMember },
  },
};

describe('AccountSettingsTab', () => {
  test('renders correctly', async () => {
    const { container, findByText } = render(<AccountSettingsTab isPhone />, { initialState });

    await waitFor(async () => expect(await findByText('First Name')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });

  test('handles submission for personal information', async () => {
    const [updateUser] = mockThunks(actions, ['updateUser']);
    const { getAllByRole, findByText, dispatch } = render(<AccountSettingsTab isPhone />, {
      initialState,
    });

    await userEvent.type(await findByText('First Name'), 'firstname', { delay: 1 });
    await userEvent.type(await findByText('Last Name'), 'lastname', { delay: 1 });
    await userEvent.type(await findByText('Email'), 'email@email.com', { delay: 1 });
    await userEvent.type(await findByText('Phone'), '3344444444', { delay: 1 });

    await act(() => fireEvent.click(getAllByRole('button', { name: 'Save' })[0]));

    expect(updateUser).toBeCalledWith({
      firstName: 'firstname',
      lastName: 'lastname',
      email: 'email@email.com',
      phone: '3344444444',
    });
    expect(dispatch).toBeCalled();
  });

  test('handles submission for security', async () => {
    const [updateUser] = mockThunks(actions, ['updateUser']);
    const { getAllByRole, findByText, dispatch } = render(<AccountSettingsTab isPhone />, {
      initialState,
    });

    await userEvent.type(await findByText('Current Password'), 'password1', { delay: 1 });
    await userEvent.type(await findByText('New Password'), 'password2', { delay: 1 });
    await userEvent.type(await findByText('Confirm Password'), 'password2', { delay: 1 });

    await act(() => fireEvent.click(getAllByRole('button', { name: 'Save' })[1]));

    expect(updateUser).toBeCalledWith({
      password: 'password1',
      newPassword: 'password2',
    });
    expect(dispatch).toBeCalled();
  });

  test('not shows phone input', async () => {
    const { queryByText } = render(<AccountSettingsTab isPhone={false} />, { initialState });
    expect(queryByText('Phone')).not.toBeInTheDocument();
  });
});

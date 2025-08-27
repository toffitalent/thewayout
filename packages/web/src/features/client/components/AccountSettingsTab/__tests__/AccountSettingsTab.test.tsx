import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import * as userActions from '@app/features/auth/actions';
import * as clientActions from '@app/features/client/actions';
import { act, fireEvent, fixtures, mockThunks, render } from '@test';
import { AccountSettingsTab } from '../AccountSettingTab';

describe('AccountSettingsTab', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      replace: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container, findByText } = render(<AccountSettingsTab />);

    expect(await findByText('Personal Information')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test('handles submission for personal information', async () => {
    const [updateClient] = mockThunks(clientActions, ['updateClient']);
    const { getAllByRole, findByRole, dispatch } = render(<AccountSettingsTab />);

    const firstNameInput = await findByRole('textbox', { name: 'First Name' });
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'firstname', { delay: 1 });

    await act(() => fireEvent.click(getAllByRole('button', { name: 'Save' })[0]));

    expect(updateClient).toBeCalledWith(expect.objectContaining({ firstName: 'firstname' }));
    expect(dispatch).toBeCalled();
  });

  test('handles submission for security', async () => {
    const [updateUser] = mockThunks(userActions, ['updateUser']);
    const { getAllByRole, findByText, dispatch } = render(<AccountSettingsTab />);

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
});

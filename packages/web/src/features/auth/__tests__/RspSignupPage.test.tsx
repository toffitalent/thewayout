import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import { UserType } from '@two/shared';
import { mockThunks, render } from '@test';
import * as actions from '../actions';
import { RspSignupPage } from '../RspSignupPage';

describe('RspSignupPage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
      query: {},
      replace: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container } = render(<RspSignupPage />);
    expect(container).toMatchSnapshot();
  });

  test('handles submission', async () => {
    const [signUp] = mockThunks(actions, ['signUp']);
    const { dispatch, getByRole, getByLabelText } = render(<RspSignupPage />);

    await userEvent.type(getByLabelText('First Name'), 'firstname', { delay: 1 });
    await userEvent.type(getByLabelText('Last Name'), 'lastname', { delay: 1 });
    await userEvent.type(getByLabelText('Email'), 'email@email.com', { delay: 1 });
    await userEvent.type(getByLabelText('Password'), 'password', { delay: 1 });
    await userEvent.click(getByLabelText(/^By signing up, I agree to the /));
    await userEvent.click(getByRole('button'));

    expect(signUp).toBeCalledWith({
      firstName: 'firstname',
      lastName: 'lastname',
      email: 'email@email.com',
      password: 'password',
      terms: true,
      type: UserType.Rsp,
    });
    expect(dispatch).toBeCalled();
  });

  test('handles submission by invited case manager', async () => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
      query: {
        firstName: 'firstname',
        lastName: 'lastname',
        email: 'email@email.com',
        invitationId: 'TEST_ID',
      },
      replace: jest.fn(),
    }));
    const [signUp] = mockThunks(actions, ['signUp']);
    const { dispatch, getByRole, getByLabelText } = render(<RspSignupPage />);

    expect(getByLabelText('First Name')).toBeDisabled();
    expect(getByLabelText('First Name')).toHaveValue('firstname');
    expect(getByLabelText('Last Name')).toBeDisabled();
    expect(getByLabelText('Last Name')).toHaveValue('lastname');
    expect(getByLabelText('Email')).toBeDisabled();
    expect(getByLabelText('Email')).toHaveValue('email@email.com');

    await userEvent.type(getByLabelText('Password'), 'password', { delay: 1 });
    await userEvent.click(getByLabelText(/^By signing up, I agree to the /));
    await userEvent.click(getByRole('button'));

    expect(signUp).toBeCalledWith({
      firstName: 'firstname',
      lastName: 'lastname',
      email: 'email@email.com',
      password: 'password',
      terms: true,
      type: UserType.Rsp,
      invitationId: 'TEST_ID',
    });
    expect(dispatch).toBeCalled();
  });
});

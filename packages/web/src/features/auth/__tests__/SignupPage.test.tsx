import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import React from 'react';
import { useErrorIndicator } from '@app/hooks';
import { mockDispatch, mockThunks, render } from '@test';
import * as actions from '../actions';
import { ClientSignupPage, EmployerSignupPage } from '../SignupPage';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual<any>('@app/hooks'),
  useErrorIndicator: jest.fn(),
}));

describe('SignupPage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
      query: {},
      push: jest.fn(),
      replace: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container } = render(<ClientSignupPage />);
    expect(container).toMatchSnapshot();
  });

  test('renders employer page correctly', async () => {
    const { container } = render(<EmployerSignupPage />);
    expect(container).toMatchSnapshot();
  });

  test('handles submission', async () => {
    const [signUp] = mockThunks(actions, ['signUp']);
    const { dispatch, getByRole, getByLabelText } = render(<ClientSignupPage />);

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
      type: 'client',
    });
    expect(dispatch).toBeCalled();
  });

  test('displays error on failure', async () => {
    const mockShowError = jest.fn();
    (useErrorIndicator as jest.Mock).mockImplementation(() => mockShowError);

    const error = new Error('Failed');
    const dispatch = mockDispatch(jest.fn().mockRejectedValue(error));
    const [signUp] = mockThunks(actions, ['signUp']);

    const { getByRole, getByLabelText } = render(<ClientSignupPage />, { dispatch });

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
      type: 'client',
    });
    expect(dispatch).toBeCalled();
    expect(mockShowError).toBeCalledWith(error);
  });
});

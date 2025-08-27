import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import React from 'react';
import { useErrorIndicator } from '@app/hooks';
import { mockDispatch, mockThunks, render, waitFor } from '@test';
import * as actions from '../actions';
import { ResetPasswordPage } from '../ResetPasswordPage';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual<any>('@app/hooks'),
  useErrorIndicator: jest.fn(),
}));

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
      query: {
        token: 'test',
        username: 'email@email.com',
      },
      push: jest.fn(),
      replace: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container } = render(<ResetPasswordPage />);
    expect(container).toMatchSnapshot();
  });

  test('handles submission', async () => {
    const [resetPassword] = mockThunks(actions, ['resetPassword']);
    const { dispatch, getByRole, getByLabelText } = render(<ResetPasswordPage />);
    await userEvent.type(getByLabelText('Password'), 'password', { delay: 1 });
    await userEvent.type(getByLabelText('Confirm password'), 'password', { delay: 1 });
    await userEvent.click(getByRole('button'));

    expect(resetPassword).toBeCalledWith({
      password: 'password',
      token: 'test',
      username: 'email@email.com',
    });
    expect(dispatch).toBeCalled();
  });

  test('displays error on failure', async () => {
    const mockShowError = jest.fn();
    (useErrorIndicator as jest.Mock).mockImplementation(() => mockShowError);

    const error = new Error('Failed');
    const dispatch = mockDispatch(jest.fn().mockRejectedValue(error));
    const [resetPassword] = mockThunks(actions, ['resetPassword']);

    const { getByRole, getByLabelText } = render(<ResetPasswordPage />, { dispatch });
    await userEvent.type(getByLabelText('Password'), 'password', { delay: 1 });
    await userEvent.type(getByLabelText('Confirm password'), 'password', { delay: 1 });
    await userEvent.click(getByRole('button'));

    expect(resetPassword).toBeCalledWith({
      password: 'password',
      token: 'test',
      username: 'email@email.com',
    });
    expect(dispatch).toBeCalled();
    expect(mockShowError).toBeCalledWith(error);
  });

  test('navigates to home page if token/username missing', async () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
      query: {},
      push,
      replace: jest.fn(),
    }));

    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(push).toBeCalledWith('/');
    });
  });
});

import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import React from 'react';
import { useErrorIndicator } from '@app/hooks';
import { getByText, mockDispatch, mockThunks, render, waitFor } from '@test';
import * as actions from '../actions';
import { ForgotPasswordPage } from '../ForgotPasswordPage';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual<any>('@app/hooks'),
  useErrorIndicator: jest.fn(),
}));

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
      query: {},
    }));
  });

  test('renders correctly', async () => {
    const { container } = render(<ForgotPasswordPage />);
    expect(container).toMatchSnapshot();
  });

  test('handles submission', async () => {
    const [forgotPassword] = mockThunks(actions, ['forgotPassword']);
    const { container, dispatch, getByRole, getByLabelText } = render(<ForgotPasswordPage />);

    await userEvent.type(getByLabelText('Email'), 'email@email.com', { delay: 1 });
    await userEvent.click(getByRole('button'));

    expect(forgotPassword).toBeCalledWith('email@email.com');
    expect(dispatch).toBeCalled();
    expect(container).toMatchSnapshot();
  });

  test('clears success message if email not received clicked', async () => {
    const { getByRole, getByLabelText, queryByText } = render(<ForgotPasswordPage />);

    await userEvent.type(getByLabelText('Email'), 'email@email.com', { delay: 1 });
    await userEvent.click(getByRole('button'));

    await waitFor(() => {
      expect(queryByText("I didn't receive an email.")).toBeInTheDocument();
    });

    await userEvent.click(getByRole('button'));

    await waitFor(() => {
      expect(
        queryByText('Enter the email address associated with the account.'),
      ).toBeInTheDocument();
    });
  });

  test('displays error on failure', async () => {
    const mockShowError = jest.fn();
    (useErrorIndicator as jest.Mock).mockImplementation(() => mockShowError);

    const error = new Error('Failed');
    const dispatch = mockDispatch(jest.fn().mockRejectedValue(error));
    const [forgotPassword] = mockThunks(actions, ['forgotPassword']);
    const { getByRole, getByLabelText } = render(<ForgotPasswordPage />, { dispatch });

    await userEvent.type(getByLabelText('Email'), 'email@email.com', { delay: 1 });
    await userEvent.click(getByRole('button'));

    expect(forgotPassword).toBeCalledWith('email@email.com');
    expect(dispatch).toBeCalled();
    expect(mockShowError).toBeCalledWith(error);
  });
});

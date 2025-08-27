import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import React from 'react';
import { useErrorIndicator } from '@app/hooks';
import { mockDispatch, mockThunks, render, waitFor } from '@test';
import * as actions from '../actions';
import { LoginPage } from '../LoginPage';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual<any>('@app/hooks'),
  useErrorIndicator: jest.fn(),
}));

describe('LoginPage', () => {
  let replace: jest.Mock;

  beforeEach(() => {
    replace = jest.fn();

    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
      query: {},
      replace,
    }));
  });

  test('renders correctly', async () => {
    const { container } = render(<LoginPage />);
    expect(container).toMatchSnapshot();
  });

  test('handles submission', async () => {
    const [login] = mockThunks(actions, ['login']);
    const { dispatch, getByRole, getByLabelText } = render(<LoginPage />);
    await userEvent.type(getByLabelText('Email'), 'email@email.com', { delay: 1 });
    await userEvent.type(getByLabelText('Password'), 'password', { delay: 1 });
    await userEvent.click(getByRole('button'));

    expect(login).toBeCalledWith({
      username: 'email@email.com',
      password: 'password',
    });
    expect(dispatch).toBeCalled();
    await waitFor(() => {
      expect(replace).toBeCalledWith('/');
    });
  });

  test('displays error on failure', async () => {
    const mockShowError = jest.fn();
    (useErrorIndicator as jest.Mock).mockImplementation(() => mockShowError);

    const error = new Error('Failed');
    const dispatch = mockDispatch(jest.fn().mockRejectedValue(error));
    const [login] = mockThunks(actions, ['login']);

    const { getByRole, getByLabelText } = render(<LoginPage />, { dispatch });
    await userEvent.type(getByLabelText('Email'), 'email@email.com', { delay: 1 });
    await userEvent.type(getByLabelText('Password'), 'password', { delay: 1 });
    await userEvent.click(getByRole('button'));

    expect(login).toBeCalledWith({
      username: 'email@email.com',
      password: 'password',
    });
    expect(dispatch).toBeCalled();
    expect(mockShowError).toBeCalledWith(error);
  });

  test('redirects to path in return_to query', async () => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
      query: { return_to: '/test/' },
      replace,
    }));

    const [login] = mockThunks(actions, ['login']);
    const { dispatch, getByRole, getByLabelText } = render(<LoginPage />);
    await userEvent.type(getByLabelText('Email'), 'email@email.com', { delay: 1 });
    await userEvent.type(getByLabelText('Password'), 'password', { delay: 1 });
    await userEvent.click(getByRole('button'));

    expect(login).toBeCalledWith({
      username: 'email@email.com',
      password: 'password',
    });
    expect(dispatch).toBeCalled();
    await waitFor(() => {
      expect(replace).toBeCalledWith('/test/');
    });
  });

  test('does not redirect to non-relative uris', async () => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
      query: { return_to: 'https://example.com/test/' },
      replace,
    }));

    const [login] = mockThunks(actions, ['login']);
    const { dispatch, getByRole, getByLabelText } = render(<LoginPage />);
    await userEvent.type(getByLabelText('Email'), 'email@email.com', { delay: 1 });
    await userEvent.type(getByLabelText('Password'), 'password', { delay: 1 });
    await userEvent.click(getByRole('button'));

    expect(login).toBeCalledWith({
      username: 'email@email.com',
      password: 'password',
    });
    expect(dispatch).toBeCalled();
    await waitFor(() => {
      expect(replace).toBeCalledWith('/');
    });
  });
});

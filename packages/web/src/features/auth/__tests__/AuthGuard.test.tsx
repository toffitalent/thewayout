import { useAuth } from '@disruptive-labs/client/react';
import { useRouter } from 'next/router';
import { UserType } from '@two/shared';
import { useAppSelector } from '@app/hooks';
import { render, waitFor } from '@test';
import { AuthGuard } from '../AuthGuard';

jest.mock('@disruptive-labs/client/react', () => ({
  ...jest.requireActual('@disruptive-labs/client/react'),
  useAuth: jest.fn(),
}));

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppSelector: jest.fn(),
}));

describe('AuthGuard', () => {
  let replace: jest.Mock;
  let push: jest.Mock;

  beforeEach(() => {
    replace = jest.fn();
    push = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({ replace, asPath: '/test/', isReady: true, push });
  });

  test('shows error and navigates to login page if unauthorized user', async () => {
    (useAuth as any).mockImplementation(() => ({
      error: undefined,
      isAuthenticated: false,
      isLoading: false,
      user: null,
    }));

    render(
      <AuthGuard type={UserType.Client} scopes={['test']}>
        Page
      </AuthGuard>,
    );

    expect(replace).toHaveBeenCalledWith({
      pathname: '/login/',
      query: { return_to: '/test/' },
    });
  });

  test('does not include return_to query on logout', async () => {
    (useAuth as any)
      .mockImplementationOnce(() => ({
        error: undefined,
        isAuthenticated: true,
        isLoading: false,
        user: { id: 'user-id', roles: [UserType.Client] },
      }))
      .mockImplementationOnce(() => ({
        error: undefined,
        isAuthenticated: false,
        isLoading: false,
        user: null,
      }));

    const { rerender } = render(<AuthGuard type={UserType.Client}>Page</AuthGuard>);
    rerender(<AuthGuard type={UserType.Client}>Page</AuthGuard>);

    await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
    expect(replace).toHaveBeenCalledWith({
      pathname: '/login/',
      query: undefined,
    });
  });

  test('navigates to alternative main page based on user type mismatch', async () => {
    (useAuth as any).mockImplementation(() => ({
      error: undefined,
      isAuthenticated: true,
      isLoading: false,
      user: { roles: [UserType.Client], scope: '' },
    }));

    render(<AuthGuard type={UserType.Employer}>Page</AuthGuard>);

    expect(replace).toHaveBeenCalledWith('/client/');
  });

  test("navigates to error page if user don't have required scope", async () => {
    (useAuth as any).mockImplementation(() => ({
      error: undefined,
      isAuthenticated: true,
      isLoading: false,
      user: { roles: [UserType.Client], scope: '' },
    }));

    render(
      <AuthGuard type={UserType.Client} scopes={['test']}>
        Page
      </AuthGuard>,
    );

    expect(replace).toHaveBeenCalledWith('/403/');
  });

  test('waits for router to be ready before authorizing', async () => {
    (useAuth as any).mockImplementation(() => ({
      error: undefined,
      isAuthenticated: false,
      isLoading: false,
      user: null,
    }));

    (useRouter as jest.Mock)
      .mockReturnValueOnce({ replace, asPath: null, isReady: false })
      .mockReturnValueOnce({ replace, asPath: null, isReady: false })
      .mockReturnValueOnce({ replace, asPath: '/test/', isReady: true });

    const { rerender } = render(<AuthGuard type={UserType.Client}>Page</AuthGuard>);
    rerender(<AuthGuard type={UserType.Client}>Page</AuthGuard>);

    expect(replace).toBeCalledTimes(1);
    expect(replace).toBeCalledWith({
      pathname: '/login/',
      query: {
        return_to: '/test/',
      },
    });
  });

  test('should not redirect after user update', async () => {
    (useAuth as any).mockImplementation(() => ({
      error: undefined,
      isAuthenticated: true,
      isLoading: false,
      user: { roles: [UserType.Client], scope: '' },
    }));

    (useAppSelector as any)
      .mockReturnValue({ client: { name: 'Second' } })
      .mockReturnValueOnce({ client: { name: 'First' } });

    const { rerender } = render(<AuthGuard type={UserType.Client}>Page</AuthGuard>);
    rerender(<AuthGuard type={UserType.Client}>Page</AuthGuard>);

    expect(replace).not.toBeCalled();
    expect(push).not.toBeCalled();
  });
});

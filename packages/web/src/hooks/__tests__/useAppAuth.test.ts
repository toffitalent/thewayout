import { useAuth } from '@disruptive-labs/client/react';
import { useRouter } from 'next/router';
import { UserType } from '@two/shared';
import { act, renderHook, waitFor } from '@test';
import { useAuthRedirect } from '../useAppAuth';

jest.mock('@disruptive-labs/client/react', () => ({
  ...jest.requireActual('@disruptive-labs/client/react'),
  useAuth: jest.fn(),
}));

describe('useAuthRedirect', () => {
  let replace: jest.Mock;

  beforeEach(() => {
    replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace, asPath: '/login/', isReady: true });

    (useAuth as any).mockImplementation(() => ({
      error: undefined,
      isAuthenticated: false,
      isLoading: false,
      user: null,
    }));
  });

  test('returns redirect function', () => {
    const { result } = renderHook(() => useAuthRedirect());
    expect(typeof result.current).toBe('function');
    act(() => {
      result.current();
    });
    expect(replace).toBeCalledWith('/');
  });

  test('automatically redirects if authenticated', async () => {
    (useAuth as any)
      .mockImplementationOnce(() => ({
        error: undefined,
        isAuthenticated: false,
        isLoading: true,
        user: null,
      }))
      .mockImplementation(() => ({
        error: undefined,
        isAuthenticated: true,
        isLoading: false,
        user: { roles: [UserType.Client] },
      }));

    const { rerender } = renderHook(() => useAuthRedirect());

    await waitFor(() => {
      expect(replace).not.toBeCalled();
    });

    rerender();

    await waitFor(() => {
      expect(replace).toBeCalledWith('/client/');
    });
  });

  test('does not automatically redirect if disabled', async () => {
    (useAuth as any).mockImplementation(() => ({
      error: undefined,
      isAuthenticated: true,
      isLoading: false,
      user: { roles: [UserType.Client] },
    }));

    renderHook(() => useAuthRedirect(false));

    await waitFor(() => {
      expect(replace).not.toBeCalled();
    });
  });
});

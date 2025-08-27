import { useAuth } from '@disruptive-labs/client/dist/react';
import { renderHook } from '@testing-library/react';
import { useRouter } from 'next/router';
import { UserType } from '@two/shared';
import { useDashboardRedirection } from '../useDashboardRedirection';

jest.mock('@disruptive-labs/client/react', () => ({
  ...jest.requireActual('@disruptive-labs/client/react'),
  useAuth: jest.fn(),
}));

describe('useDashboardRedirection', () => {
  let replace: jest.Mock;

  beforeEach(() => {
    replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace, asPath: '/', isReady: true });
  });

  test('return true and redirect to client dashboard should redirect', () => {
    (useAuth as any).mockImplementation(() => ({
      isLoading: false,
      user: { roles: [UserType.Client] },
    }));

    const { result } = renderHook(() => useDashboardRedirection());
    expect(result.current).toBe(true);
    expect(replace).toBeCalledWith('/client/');
  });

  test('return true and redirect to employer dashboard should redirect', () => {
    (useAuth as any).mockImplementation(() => ({
      isLoading: false,
      user: { roles: [UserType.Employer] },
    }));

    const { result } = renderHook(() => useDashboardRedirection());
    expect(result.current).toBe(true);
    expect(replace).toBeCalledWith('/employer/');
  });

  test('return false and not redirect', () => {
    (useAuth as any).mockImplementation(() => ({ isLoading: false, user: null }));

    const { result } = renderHook(() => useDashboardRedirection());
    expect(result.current).toBe(false);
    expect(replace).not.toBeCalled();
  });
});

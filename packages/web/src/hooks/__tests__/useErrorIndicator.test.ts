import { Toast } from '@disruptive-labs/ui';
import { ApiError } from '@app/api';
import { renderHook } from '@test';
import { useErrorIndicator } from '../useErrorIndicator';

describe('useErrorIndicator', () => {
  let toast: jest.SpyInstance;

  beforeEach(() => {
    toast = jest.spyOn(Toast, 'show').mockImplementation(() => 0);
  });

  afterEach(() => {
    toast.mockRestore();
  });

  test('returns function to display error toast', () => {
    const error = new Error('');
    const { result } = renderHook(() => useErrorIndicator());
    expect(typeof result.current).toBe('function');
    expect(() => result.current(error)).toThrow(error);
    expect(toast).toBeCalledWith({ status: 'danger', text: 'Something went wrong' });
  });

  test('displays custom API messages based on code', () => {
    const error = new ApiError(ApiError.Types.Client, 401, {}, 'InvalidCredentials');
    const { result } = renderHook(() =>
      useErrorIndicator({ InvalidCredentials: 'Invalid credentials' }),
    );
    expect(() => result.current(error)).toThrow(error);
    expect(toast).toBeCalledWith({
      status: 'danger',
      text: 'Invalid credentials',
    });
  });

  describe('default API errors', () => {
    test('displays network error messages', () => {
      const error = new ApiError(ApiError.Types.Network);
      const { result } = renderHook(() => useErrorIndicator());
      expect(() => result.current(error)).toThrow(error);
      expect(toast).toBeCalledWith({ status: 'danger', text: 'No connection' });
    });

    test('displays rate limit error message', () => {
      const error = new ApiError(ApiError.Types.Client, 429, {}, 'RequestThrottled');
      const { result } = renderHook(() => useErrorIndicator());
      expect(() => result.current(error)).toThrow(error);
      expect(toast).toBeCalledWith({
        status: 'danger',
        text: 'Too many requests. Please try again in a few minutes.',
      });
    });

    test('displays default message if no codes match', () => {
      const error = new ApiError(ApiError.Types.Client, 400, {}, 'UnknownCode');
      const { result } = renderHook(() => useErrorIndicator({}, 'Uh oh!'));
      expect(() => result.current(error)).toThrow(error);
      expect(toast).toBeCalledWith({ status: 'danger', text: 'Uh oh!' });
    });

    test('displays default message if no types match', () => {
      const error = new ApiError(ApiError.Types.Internal);
      const { result } = renderHook(() => useErrorIndicator({}, 'Uh oh!'));
      expect(() => result.current(error)).toThrow(error);
      expect(toast).toBeCalledWith({ status: 'danger', text: 'Uh oh!' });
    });
  });

  test('does not display toast if no message available', () => {
    const error = new Error('Test');
    const { result } = renderHook(() => useErrorIndicator({}, null));
    expect(() => result.current(error)).toThrow(error);
    expect(toast).not.toBeCalled();
  });

  test('does not rethrow error if option disabled', () => {
    const error = new Error('Test');
    const { result } = renderHook(() => useErrorIndicator({}, null));
    expect(() => result.current(error, false)).not.toThrow();
  });
});

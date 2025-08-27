import { renderHook } from '@test';
import { useTimeout } from '../useTimeout';

describe('useTimeout', () => {
  test('returns timeout function', () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    const { result } = renderHook(() => useTimeout(fn, 1000));
    expect(typeof result.current).toBe('function');
    result.current();
    expect(fn).not.toBeCalled();
    jest.advanceTimersByTime(1500);
    expect(fn).toBeCalledTimes(1);
  });

  test('clears timeout on unmount', () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    const { result, unmount } = renderHook(() => useTimeout(fn, 1000));
    result.current();
    jest.advanceTimersByTime(500);
    unmount();
    jest.advanceTimersByTime(1000);
    expect(fn).not.toBeCalled();
  });
});

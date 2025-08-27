import { renderHook } from '@test';
import { usePrevious } from '../usePrevious';

describe('usePrevious', () => {
  test('returns previous value', () => {
    const { rerender, result } = renderHook(({ initialValue }) => usePrevious(initialValue), {
      initialProps: { initialValue: 1 },
    });
    expect(result.current).toBeUndefined();
    rerender({ initialValue: 2 });
    expect(result.current).toBe(1);
    rerender({ initialValue: 3 });
    expect(result.current).toBe(2);
  });
});

import { Toast } from '@disruptive-labs/ui';
import { renderHook } from '@test';
import { useIndicators } from '../useIndicators';

describe('useIndicators', () => {
  let toast: jest.SpyInstance;

  beforeEach(() => {
    toast = jest.spyOn(Toast, 'show').mockImplementation(() => 0);
  });

  afterEach(() => {
    toast.mockRestore();
  });

  test('wraps promise and displays error messages', async () => {
    const error = new Error('Test');
    const promise = jest.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useIndicators());
    expect(typeof result.current).toBe('function');
    await expect(() => result.current(promise())).rejects.toThrow(error);
    expect(toast).toBeCalledWith({ status: 'danger', text: 'Something went wrong' });
  });

  test('wraps promise and displays success messages', async () => {
    const value = { key: 'value' };
    const promise = jest.fn().mockResolvedValue(value);
    const { result } = renderHook(() => useIndicators({ success: 'Request succeeded!' }));
    await expect(result.current(promise())).resolves.toBe(value);
    expect(toast).toBeCalledWith({ status: 'success', text: 'Request succeeded!' });
  });

  test('does not show success message if not specified', async () => {
    const value = { key: 'value' };
    const promise = jest.fn().mockResolvedValue(value);
    const { result } = renderHook(() => useIndicators());
    await expect(result.current(promise())).resolves.toBe(value);
    expect(toast).not.toBeCalled();
  });
});

import { ApiError, ApiErrorType } from '@disruptive-labs/client';
import { miniSerializeError } from '@reduxjs/toolkit';
import { createApiThunk, isSerializedApiError, serializeApiError } from '../createApiThunk';

describe('createApiThunk', () => {
  test('creates async thunk and returns resolved value from payload creator', async () => {
    const result = { test: true };
    const payloadCreator = jest.fn().mockResolvedValue(result);
    const thunk = createApiThunk('test', payloadCreator);
    const action = thunk(null);
    const res = await action(jest.fn(), jest.fn(), undefined);
    expect(payloadCreator).toBeCalled();
    expect(res.type).toBe(thunk.fulfilled.type);
    expect(res.payload).toEqual(result);
  });

  test('rejects with payload creator error', async () => {
    const error = new ApiError(ApiErrorType.Network);
    const payloadCreator = jest.fn().mockRejectedValue(error);
    const thunk = createApiThunk('test', payloadCreator);
    const action = thunk(null);
    const res = await action(jest.fn(), jest.fn(), undefined);
    expect(payloadCreator).toBeCalled();
    expect(res.type).toBe(thunk.rejected.type);
    expect((res as any).error).toEqual(serializeApiError(error));
  });

  describe('isSerializedApiError', () => {
    test('returns true when object is serialized API error', () => {
      expect(isSerializedApiError(serializeApiError(new ApiError(ApiError.Types.Network, 0)))).toBe(
        true,
      );
    });

    test('returns false when object is not serialized API error', () => {
      expect(isSerializedApiError({})).toBe(false);
      expect(isSerializedApiError(miniSerializeError(new Error('test')))).toBe(false);
    });
  });
});

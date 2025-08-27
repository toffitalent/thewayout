import { ApiError, ApiErrorType } from '@disruptive-labs/client';
import {
  AsyncThunkPayloadCreator,
  createAsyncThunk,
  miniSerializeError,
  SerializedError,
} from '@reduxjs/toolkit';

export interface SerializedApiError {
  name: string;
  message: string;
  stack?: string;
  type: ApiErrorType;
  status: number;
  code: string;
  data: Record<string, unknown>;
  isApiError: boolean;
}

export const isSerializedApiError = (error: any): error is SerializedApiError =>
  typeof error === 'object' && error?.isApiError === true;

export const serializeApiError = (error: unknown): SerializedApiError | SerializedError =>
  error instanceof ApiError
    ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        type: error.type,
        status: error.status,
        code: error.code,
        data: error.data,
        isApiError: true,
      }
    : miniSerializeError(error);

interface ApiThunkConfig {
  serializedErrorType: SerializedApiError | SerializedError;
}

interface ApiThunkOptions<ThunkArg = void, ThunkAPI = any> {
  condition?(arg: ThunkArg, api: ThunkAPI): boolean | undefined;
  dispatchConditionRejection?: boolean;
}

export const createApiThunk = <Returned, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ApiThunkConfig>,
  options?: ApiThunkOptions<
    ThunkArg,
    Pick<
      Parameters<AsyncThunkPayloadCreator<Returned, ThunkArg, ApiThunkConfig>>[1],
      'getState' | 'extra'
    >
  >,
) =>
  createAsyncThunk<Returned, ThunkArg, ApiThunkConfig>(typePrefix, payloadCreator, {
    ...options,
    serializeError: serializeApiError,
  });

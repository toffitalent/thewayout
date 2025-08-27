import { Toast } from '@disruptive-labs/ui';
import { useCallback } from 'react';
import { ApiError } from '@app/api';
import { isSerializedApiError, SerializedApiError } from '@app/utils';

const getDefaultMessageByErrorCode = (error: ApiError) => {
  switch (error.code) {
    case 'RequestThrottled':
      return 'Too many requests. Please try again in a few minutes.';
    default:
      return null;
  }
};

const getErrorMessage = (
  error: ApiError | SerializedApiError,
  errorCodeMap: Record<string, string>,
  defaultMessage: string | null,
) => {
  switch (error.type) {
    case ApiError.Types.Client:
      return errorCodeMap?.[error.code] ?? getDefaultMessageByErrorCode(error) ?? defaultMessage;
    case ApiError.Types.Network:
      return 'No connection';
    default:
      return defaultMessage;
  }
};

export const useErrorIndicator = (
  errorCodeMap?: Record<string, string>,
  defaultMessage: string | null = 'Something went wrong',
) =>
  useCallback(
    (error: any, shouldRethrowError = true) => {
      const text =
        error instanceof ApiError || isSerializedApiError(error)
          ? getErrorMessage(error, errorCodeMap ?? {}, defaultMessage)
          : defaultMessage;

      if (text) Toast.show({ status: 'danger', text });

      if (shouldRethrowError) throw error;
    },
    [defaultMessage, errorCodeMap],
  );

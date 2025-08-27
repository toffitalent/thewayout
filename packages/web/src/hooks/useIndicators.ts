import { Toast } from '@disruptive-labs/ui';
import { useCallback } from 'react';
import { useErrorIndicator } from './useErrorIndicator';

export const useIndicators = ({
  errors,
  error,
  success,
}: {
  errors?: Record<string, string>;
  error?: string;
  success?: string;
} = {}) => {
  const showError = useErrorIndicator(errors, error);

  return useCallback(
    <T>(promise: Promise<T>) =>
      promise
        .then((value) => {
          if (success) {
            Toast.show({ status: 'success', text: success });
          }

          return value;
        })
        .catch((err) => {
          showError(err, false);
          throw err;
        }),
    [showError, success],
  );
};

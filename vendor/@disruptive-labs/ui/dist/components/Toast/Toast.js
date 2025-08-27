import { useEffect } from 'react';
import { dismiss, dismissAll, show } from './ToastProvider';
/**
 * Toast is used to show alerts to the user on top of other content. They are attached to the
 * viewport and will animate in and out. The toast will close itself when the dismiss button is
 * clicked or after a timeout (the default timeout is 5 seconds).
 *
 * Toasts can be triggered by rendering the `Toast` component in another React component or by
 * using the static `Toast.show()` method.
 *
 * Toasts only show one at a time, so triggering many toasts in rapid succession will cause them to
 * continue to appear one after another for a while.
 */
export const Toast = (toast) => {
    useEffect(() => {
        show(toast);
    }, []); // eslint-disable-line
    return null;
};
const createUtilityMethod = (status) => (text, duration) => show({ status, text, duration });
Toast.dismiss = dismiss;
Toast.dismissAll = dismissAll;
Toast.show = show;
Toast.danger = createUtilityMethod('danger');
Toast.info = createUtilityMethod('info');
Toast.success = createUtilityMethod('success');
Toast.warning = createUtilityMethod('warning');

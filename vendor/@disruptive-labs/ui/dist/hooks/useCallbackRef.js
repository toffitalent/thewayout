import { useState } from 'react';
/**
 * `useCallbackRef` is a React hook for responding to refs being set on the target element. By
 * using useState under the hood rather than useRef, in combination with React's support for
 * callback refs, the component will be notified/updated once the ref is set on the target.
 */
export const useCallbackRef = () => useState(null);

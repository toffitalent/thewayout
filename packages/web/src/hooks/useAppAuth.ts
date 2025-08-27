import { useAuth } from '@disruptive-labs/client/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { AppClient, UserType } from '@app/api';

export const useAppAuth = () => useAuth<AppClient>();

export function useAuthRedirect(autoRedirectOnFirstRender = true) {
  const auth = useAppAuth();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const redirect = useCallback(() => {
    setShouldRedirect(true);
  }, []);

  // Handle auto-redirect on ready, if enabled
  useEffect(() => {
    if (!router.isReady || auth.isLoading) return;

    if (autoRedirectOnFirstRender && auth.isAuthenticated) redirect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isLoading, router.isReady, autoRedirectOnFirstRender, redirect]);

  // Handle manual redirect once auth.user available
  useEffect(() => {
    if (shouldRedirect) {
      setShouldRedirect(false);

      const userType = Object.values(UserType).find((item) => auth.user?.roles?.includes(item));
      router.replace(
        userType ? `/${userType !== UserType.Rsp ? userType : `ssp/case-managers`}/` : '/',
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user, shouldRedirect]);

  return redirect;
}

import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useAppAuth, useAuthRedirect } from './useAppAuth';

export const useDashboardRedirection = () => {
  const router = useRouter();
  const auth = useAppAuth();
  const redirect = useAuthRedirect(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (auth.isLoading) {
      return;
    }
    if (auth.user && router.asPath === '/') {
      redirect();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user, auth.isLoading, router.asPath]);

  return useMemo(() => isLoading, [isLoading]);
};

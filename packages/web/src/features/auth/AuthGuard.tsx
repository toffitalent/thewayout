import { Box, Spinner, useEventCallback } from '@disruptive-labs/ui';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { UserType } from '@two/shared';
import { useAppAuth, useAppSelector, useAuthRedirect } from '@app/hooks';
import { selectAuthUser } from './reducer';

export interface AuthGuardProps {
  children: React.ReactNode;
  scopes?: string[];
  type: UserType;
}

export function AuthGuard({ children, scopes, type }: AuthGuardProps) {
  const auth = useAppAuth();
  const user = useAppSelector(selectAuthUser);
  const redirect = useAuthRedirect(false);
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const navigateToLogin = useEventCallback(() => {
    router.replace({
      pathname: '/login/',
      query: isAuthorized
        ? undefined
        : {
            return_to: router.asPath,
          },
    });
  });

  useEffect(() => {
    if (auth.isLoading || !router.isReady) return;

    if (!auth.user) {
      navigateToLogin();
    } else if (user && auth.user?.roles?.includes('client') && !user.client) {
      router.push('/client/create-profile');
      setIsAuthorized(true);
    } else if (user && auth.user?.roles?.includes('employer') && !user.employer) {
      router.push('/employer/create-profile');
      setIsAuthorized(true);
    } else if (user && auth.user?.roles?.includes('rsp') && !user.rspAccount?.isProfileFilled) {
      router.push('/ssp/create-profile');
      setIsAuthorized(true);
    } else if (!auth.user?.roles?.includes(type)) {
      redirect();
    } else if (scopes && !auth.user?.scope.split(' ').some?.((r) => scopes.includes(r))) {
      router.replace('/403/');
    } else {
      // Authorized
      setIsAuthorized(true);
    }
    // router is unstable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAuthenticated, auth.isLoading, auth.user, router.isReady, scopes, user]);

  return isAuthorized ? (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{children}</>
  ) : (
    <Box pv={20} textAlign="center">
      <Spinner color="primary" />
    </Box>
  );
}

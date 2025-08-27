import '../styles/base.scss';

import { ToastProvider } from '@disruptive-labs/ui';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Script from 'next/script';
import React, { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { trackPageView } from '@app/features/analytics';
import { AuthProvider } from '@app/features/auth';
import { store } from '@app/store';
import type { NextPageWithLayout } from '@app/types';
import scripts from '../../lib/scripts';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const referrer = useRef(typeof document !== 'undefined' ? document?.referrer || '' : '');
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    const handleRouteChange = () => {
      trackPageView({ referrer: referrer.current });
      referrer.current = document.URL;
    };

    if (router.isReady) {
      // Initial page view
      handleRouteChange();
    }

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Provider store={store}>
        <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
      </Provider>
      <ToastProvider />
      {scripts.map(({ id, script }) => (
        <Script key={id} id={id} dangerouslySetInnerHTML={{ __html: script }} />
      ))}
    </>
  );
}

export default App;

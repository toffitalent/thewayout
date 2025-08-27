import type { Context } from '@disruptive-labs/server';
import * as Sentry from '@sentry/node';
import config from '@two/config';

/* istanbul ignore next */
if (config.get('sentry.api.dsn')) {
  Sentry.init({
    dsn: config.get('sentry.api.dsn'),
    environment: process.env.APP_ENV || process.env.NODE_ENV,
    release: config.get('sentry.release'),
  });
}

export function onError(error: Error, ctx?: Context) {
  Sentry.withScope((scope) => {
    if (ctx) {
      if (ctx.auth) {
        scope.setContext('auth', {
          appId: ctx.auth.appId,
          roles: ctx.auth.roles,
          scope: ctx.auth.scope,
        });
      }
      scope.setContext('request', {
        id: ctx.requestId,
        path: ctx.path,
        routerPath: ctx.routerPath,
      });
      scope.setUser({
        id: ctx.auth?.userId ? String(ctx.auth.userId) : undefined,
        ip_address: ctx.ip,
      });
    }

    Sentry.captureException(error);
  });
}

export { Sentry };

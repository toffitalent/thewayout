import type { Context } from '@disruptive-labs/server';
import { onError, Sentry } from '../Sentry';

const defaultCtx = {
  auth: {
    appId: 1,
    roles: ['admin'],
    scope: ['user'],
    userId: 1,
  },
  ip: '__IP_ADDRESS__',
  requestId: '__REQUEST_ID__',
  path: '/v1/path/',
  routerPath: '/path/',
};

describe('Sentry', () => {
  describe('onError', () => {
    let captureException: jest.SpyInstance;
    let setContext: jest.Mock;
    let setUser: jest.Mock;

    beforeEach(() => {
      captureException = jest.spyOn(Sentry, 'captureException').mockImplementation();
      setContext = jest.fn();
      setUser = jest.fn();
      jest
        .spyOn(Sentry, 'withScope')
        .mockImplementation((callback) => callback({ setContext, setUser } as any));
    });

    test('calls Sentry.captureException', () => {
      const error = new Error();
      onError(error);
      expect(captureException).toBeCalledTimes(1);
      expect(captureException).toBeCalledWith(error);
    });

    test('adds request context if context available', () => {
      const error = new Error();
      const ctx = defaultCtx;
      onError(error, ctx as Context);
      expect(captureException).toBeCalledWith(error);
      expect(setContext).toBeCalledTimes(2);
      expect(setContext).toBeCalledWith('auth', {
        appId: ctx.auth.appId,
        roles: ctx.auth.roles,
        scope: ctx.auth.scope,
      });
      expect(setContext).toBeCalledWith('request', {
        id: ctx.requestId,
        path: ctx.path,
        routerPath: ctx.routerPath,
      });
      expect(setUser).toBeCalledTimes(1);
      expect(setUser).toBeCalledWith({
        id: String(ctx.auth.userId),
        ip_address: ctx.ip,
      });
    });

    test('does not add auth context if undefined', () => {
      const error = new Error();
      const ctx = { ...defaultCtx, auth: undefined } as unknown as Context;
      onError(error, ctx);
      expect(captureException).toBeCalledWith(error);
      expect(setContext).toBeCalledTimes(1);
      expect(setUser).toBeCalledTimes(1);
    });

    test('set userId to undefined if unauthenticated', () => {
      const error = new Error();
      const ctx = { ...defaultCtx, auth: { ...defaultCtx.auth, userId: null } };
      onError(error, ctx as Context);
      expect(captureException).toBeCalledWith(error);
      expect(setContext).toBeCalledTimes(2);
      expect(setUser).toBeCalledTimes(1);
      expect(setUser).toBeCalledWith({
        id: undefined,
        ip_address: ctx.ip,
      });
    });
  });
});

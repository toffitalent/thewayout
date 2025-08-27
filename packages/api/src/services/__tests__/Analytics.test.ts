import { Sentry } from '@app/services/Sentry';
import * as Analytics from '../Analytics';

jest.mock('@app/services/Sentry', () => ({
  Sentry: {
    captureException: jest.fn(),
  },
}));

describe('Analytics', () => {
  beforeEach(() => {
    (Analytics.analytics.alias as jest.Mock).mockImplementation((_, cb) => cb());
    (Analytics.analytics.flush as jest.Mock).mockImplementation((cb) => cb());
    (Analytics.analytics.identify as jest.Mock).mockImplementation((_, cb) => cb());
    (Analytics.analytics.track as jest.Mock).mockImplementation((_, cb) => cb());
  });

  test('initializes Segment analytics library with key', () => {
    expect((Analytics.analytics as any).args).toEqual([
      '__SEGMENT_KEY__',
      { enable: false, flushAt: 1 },
    ]);
  });

  describe('identifyUser', () => {
    test('identifies user and flushes', async () => {
      const res = await Analytics.identifyUser({
        userId: 'XXXXXX',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
      });

      expect(res).toBeUndefined();
      expect(Analytics.analytics.identify).toBeCalledWith(
        {
          userId: 'XXXXXX',
          traits: {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
          },
        },
        expect.any(Function),
      );

      expect(Analytics.analytics.flush).toBeCalled();
    });

    test('aliases anonymousId if supplied', async () => {
      const res = await Analytics.identifyUser({
        userId: 'XXXXXX',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        anonymousId: 'anonymous-id-value',
      });

      expect(res).toBeUndefined();
      expect(Analytics.analytics.identify).toBeCalledWith(
        {
          userId: 'XXXXXX',
          traits: {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
          },
        },
        expect.any(Function),
      );

      expect(Analytics.analytics.alias).toBeCalledWith(
        {
          previousId: 'anonymous-id-value',
          userId: 'XXXXXX',
        },
        expect.any(Function),
      );

      expect(Analytics.analytics.flush).toBeCalled();
    });

    test('logs errors to Sentry', async () => {
      const error = new Error('test');
      (Analytics.analytics.identify as jest.Mock).mockImplementation((_, cb) => cb(error));

      const res = await Analytics.identifyUser({
        userId: 'XXXXXX',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
      });

      expect(res).toBeUndefined();
      expect(Sentry.captureException).toBeCalledWith(error);
    });
  });

  describe('trackEvent', () => {
    test('tracks analytics event', async () => {
      const res = await Analytics.trackEvent('Signed Up', {
        userId: 'XXXXXX',
      });

      expect(res).toBeUndefined();
      expect(Analytics.analytics.track).toBeCalledWith(
        {
          userId: 'XXXXXX',
          event: 'Signed Up',
          properties: {},
        },
        expect.any(Function),
      );
    });

    test('logs errors to Sentry', async () => {
      const error = new Error('test');
      (Analytics.analytics.track as jest.Mock).mockImplementation((_, cb) => cb(error));

      const res = await Analytics.trackEvent('Signed Up', {
        userId: 'XXXXXX',
      });

      expect(res).toBeUndefined();
      expect(Sentry.captureException).toBeCalledWith(error);
    });
  });
});

import Analytics from 'analytics-node';
import { promisify } from 'util';
import config from '@two/config';
import { Sentry } from './Sentry';

const segmentKey = config.get('analytics.segment.api', '');

export const analytics = new Analytics(segmentKey || '__SEGMENT_KEY__', {
  enable: !!segmentKey,
  flushAt: 1,
});

const alias = promisify(analytics.alias.bind(analytics));
const flush = promisify(analytics.flush.bind(analytics));
const identify = promisify(analytics.identify.bind(analytics));
const track = promisify(analytics.track.bind(analytics));

export interface AnalyticsUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export async function identifyUser({
  anonymousId,
  userId,
  ...traits
}: AnalyticsUser & { anonymousId?: string }): Promise<void> {
  try {
    await identify({
      userId,
      traits,
    });

    if (anonymousId) {
      await alias({ previousId: anonymousId, userId });
    }

    await flush();
  } catch (err) {
    Sentry.captureException(err);
  }
}

export interface AnalyticsEventProperties {
  anonymousId?: string;
  userId?: string;
}

export type AnalyticsEvent = {
  'Signed Up': AnalyticsEventProperties;
  'User Deleted': AnalyticsEventProperties;
  'User Updated': AnalyticsEventProperties;
};

export async function trackEvent<T extends keyof AnalyticsEvent>(
  event: T,
  { anonymousId, userId, ...properties }: AnalyticsEvent[T],
): Promise<void> {
  try {
    await track({
      anonymousId,
      userId,
      event,
      properties,
    } as Parameters<typeof track>[0]);
  } catch (err) {
    Sentry.captureException(err);
  }
}

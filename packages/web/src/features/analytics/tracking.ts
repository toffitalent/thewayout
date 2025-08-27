import snakecaseKeys from 'snakecase-keys';
import { Events } from './Events';

export type AnalyticsEvent = Events;

export interface AnalyticsUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export const identifyUser = ({ id, ...user }: AnalyticsUser) => {
  try {
    window?.analytics?.identify?.(id, user);
  } catch (err) {
    // Ignore
  }
};

export const trackEvent = <T extends keyof AnalyticsEvent>(
  name: T,
  properties: AnalyticsEvent[T] = {} as AnalyticsEvent[T],
  options: SegmentAnalytics.SegmentOpts = {},
) => {
  try {
    window?.analytics?.track?.(name, snakecaseKeys(properties ?? {}), {
      ...options,
    });
  } catch (err) {
    // Ignore
  }
};

export interface AnalyticsPageView extends Record<string, any> {
  category?: string;
  name?: string;
}

export const trackPageView = (
  { category, name, ...properties }: AnalyticsPageView = {},
  options: SegmentAnalytics.SegmentOpts = {},
) => {
  try {
    window?.analytics?.page?.(category, name, snakecaseKeys(properties), options);
  } catch (err) {
    // Ignore
  }
};

export const reset = () => {
  try {
    window?.analytics?.reset?.();
  } catch (err) {
    // Ignore
  }
};

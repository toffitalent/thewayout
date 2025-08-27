import { identifyUser, trackEvent, trackPageView } from '../tracking';

describe('Analytics > Tracking', () => {
  beforeAll(() => {
    window.analytics = {
      ...window.analytics,
      track: jest.fn(),
      identify: jest.fn(),
      page: jest.fn(),
    };
  });

  test('identifyUser function calls window.analytics.identify function', () => {
    identifyUser({
      id: '71d60da3-5559-409f-85f7-61a435955d59',
      email: 'email@example.com',
      firstName: 'Firstname',
    });

    expect(window.analytics.identify).toBeCalledTimes(1);
    expect(window.analytics.identify).toBeCalledWith('71d60da3-5559-409f-85f7-61a435955d59', {
      email: 'email@example.com',
      firstName: 'Firstname',
    });
  });

  test('trackEvent function calls window.analytics.track function', () => {
    trackEvent('Placeholder Event 1');
    expect(window.analytics.track).toBeCalledTimes(1);
    expect(window.analytics.track).toBeCalledWith('Placeholder Event 1', {}, {});
  });

  test('trackEvent function calls window.analytics.track function with event properties', () => {
    trackEvent('Placeholder Event 2', { id: 'test' });
    expect(window.analytics.track).toBeCalledTimes(1);
    expect(window.analytics.track).toBeCalledWith('Placeholder Event 2', { id: 'test' }, {});
  });

  test('trackEvent function passes options to window.analytics.track function', () => {
    trackEvent('Placeholder Event 1', undefined, { integrations: { All: false } });
    expect(window.analytics.track).toBeCalledTimes(1);
    expect(window.analytics.track).toBeCalledWith(
      'Placeholder Event 1',
      {},
      {
        integrations: { All: false },
      },
    );
  });

  test('trackPageView function calls window.analytics.page function', () => {
    trackPageView({ category: 'test', name: 'test' });
    expect(window.analytics.page).toBeCalledTimes(1);
    expect(window.analytics.page).toBeCalledWith('test', 'test', {}, {});
  });
});

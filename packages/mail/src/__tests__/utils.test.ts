import { getUrl } from '../utils';

describe('utils', () => {
  describe('getUrl', () => {
    test('returns web URL', () => {
      expect(getUrl('/account')).toBe('http://__WEB__/account/');
      expect(getUrl('/account/')).toBe('http://__WEB__/account/');
    });

    test('returns web URL with query params', () => {
      expect(getUrl('/account', { utm_source: 'email' })).toBe(
        'http://__WEB__/account/?utm_source=email',
      );

      expect(getUrl('/account/', { utm_source: 'email' })).toBe(
        'http://__WEB__/account/?utm_source=email',
      );
    });
  });
});

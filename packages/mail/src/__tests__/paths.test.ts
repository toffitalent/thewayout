import config from '@two/config';

describe('paths', () => {
  beforeEach(() => {
    (global as any).__webpack_public_path__ = undefined;
  });

  afterAll(() => {
    delete (global as any).__webpack_public_path__;
  });

  test('sets __webpack_public_path__', () => {
    expect(__webpack_public_path__).toBeUndefined();
    const paths = require('../paths');
    expect(paths).toEqual({});
    expect(__webpack_public_path__).toBe(`${config.get('urls.mail')}/`);
  });
});

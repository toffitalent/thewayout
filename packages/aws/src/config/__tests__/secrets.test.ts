import { secrets } from '../secrets';

describe('secrets', () => {
  test('exports secrets configuration', () => {
    expect(secrets).toMatchSnapshot();
  });
});

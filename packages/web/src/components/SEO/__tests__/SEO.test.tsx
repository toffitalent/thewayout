import { render } from '@test';
import { SEO } from '../SEO';

jest.mock(
  'next/head',
  () =>
    ({ children }: any) =>
      children,
);

describe('SEO', () => {
  let processEnv: any;

  beforeEach(() => {
    processEnv = process.env;
  });

  afterEach(() => {
    process.env = processEnv;
  });

  test('renders correctly', async () => {
    const { container } = render(<SEO />);
    expect(container).toMatchSnapshot();
  });
});

import { useRouter } from 'next/router';
import { render } from '@test';
import { CreatorLayout } from '../CreatorLayout';

describe('CreatorLayout', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      events: { on: jest.fn(), off: jest.fn() },
      asPath: '/',
    }));
  });

  test('renders correctly', async () => {
    const { container } = render(
      <CreatorLayout>
        <div>Page</div>
      </CreatorLayout>,
    );

    expect(container).toMatchSnapshot();
  });
});

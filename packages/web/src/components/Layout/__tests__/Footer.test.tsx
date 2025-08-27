import { render } from '@test';
import { Footer } from '../Footer';

describe('Footer', () => {
  test('renders correctly', () => {
    const { container } = render(<Footer />);
    expect(container).toMatchSnapshot();
  });
});

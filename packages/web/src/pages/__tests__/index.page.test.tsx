import { render } from '@test';
import HomePage from '../index.page';

describe('HomePage', () => {
  test('renders correctly', () => {
    const { container } = render(<HomePage />);
    expect(container).toMatchSnapshot();
  });
});

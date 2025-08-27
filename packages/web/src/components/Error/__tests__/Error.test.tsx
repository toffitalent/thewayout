import { render } from '@test';
import { Crash, NotFound } from '../Error';

describe('Crash', () => {
  test('renders correctly', () => {
    const { container } = render(<Crash />);
    expect(container).toMatchSnapshot();
  });
});

describe('NotFound', () => {
  test('renders correctly', () => {
    const { container } = render(<NotFound />);
    expect(container).toMatchSnapshot();
  });
});

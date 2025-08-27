import { render } from '@testing-library/react';
import { SharedComponent } from '../SharedComponent';

describe('SharedComponent', () => {
  test('renders correctly', () => {
    const { container } = render(<SharedComponent />);
    expect(container).toMatchSnapshot();
  });
});

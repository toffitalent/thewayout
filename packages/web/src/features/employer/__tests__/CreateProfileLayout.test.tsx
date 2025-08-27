import { render } from '@test';
import { CreateProfileLayout } from '../CreateProfileLayout';

describe('CreateProfileLayout', () => {
  test('renders correctly', () => {
    const { container } = render(<CreateProfileLayout>Test</CreateProfileLayout>);
    expect(container).toMatchSnapshot();
  });
});

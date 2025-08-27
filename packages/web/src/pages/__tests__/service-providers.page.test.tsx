import { render } from '@test';
import ServiceProvidersPage from '../service-providers.page';

describe('ServiceProvidersPage', () => {
  test('renders correctly', () => {
    const { container } = render(<ServiceProvidersPage />);
    expect(container).toMatchSnapshot();
  });
});

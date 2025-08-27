import { render } from '@test';
import PrivacyPage from '../privacy.page';

describe('PrivacyPage', () => {
  test('renders correctly', () => {
    const { container } = render(<PrivacyPage />);
    expect(container).toMatchSnapshot();
  });
});

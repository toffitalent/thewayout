import { render } from '@test';
import TermsPage from '../terms.page';

describe('TermsPage', () => {
  test('renders correctly', () => {
    const { container } = render(<TermsPage />);
    expect(container).toMatchSnapshot();
  });
});

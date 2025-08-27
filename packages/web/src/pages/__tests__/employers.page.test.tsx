import { render } from '@test';
import EmployersPage from '../employers.page';

describe('EmployersPage', () => {
  test('renders correctly', () => {
    const { container } = render(<EmployersPage />);
    expect(container).toMatchSnapshot();
  });
});

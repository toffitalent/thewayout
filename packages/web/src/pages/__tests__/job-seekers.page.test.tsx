import { render } from '@test';
import JobSeekersPage from '../job-seekers.page';

describe('JobSeekersPage', () => {
  test('renders correctly', () => {
    const { container } = render(<JobSeekersPage />);
    expect(container).toMatchSnapshot();
  });
});

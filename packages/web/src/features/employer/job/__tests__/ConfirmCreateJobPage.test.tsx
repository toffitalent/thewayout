import { render } from '@test';
import { ConfirmCreateJobPage } from '../ConfirmCreateJobPage';

describe('ConfirmCreateJobPage', () => {
  test('renders correctly', () => {
    const { container } = render(<ConfirmCreateJobPage />);
    expect(container).toMatchSnapshot();
  });
});
